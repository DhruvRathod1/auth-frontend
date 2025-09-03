import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const showWelcomeToast = (userName) => {
        const toast = document.createElement('div');
        toast.className = 'welcome-toast';
        toast.textContent = `Welcome, ${userName}! Please verify your email 📧`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    };

    // In your SignUp component's handleSubmit:
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.signup(formData);
            console.log('Signup successful:', response);

            // Navigate to verify email with email in state
            navigate('/verify-email', {
                state: { email: formData.email }
            });

        } catch (err) {
            console.error('Signup error:', err);
            const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Signup failed';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        setGoogleLoading(true);
        setError('');

        try {
            const response = await authService.getGoogleAuthUrl();
            if (response.authUrl) {
                const loadingToast = document.createElement('div');
                loadingToast.className = 'welcome-toast';
                loadingToast.style.background = '#007bff';
                loadingToast.textContent = 'Redirecting to Google... 🔄';
                document.body.appendChild(loadingToast);

                setTimeout(() => {
                    window.location.href = response.authUrl;
                }, 500);
            }
        } catch (err) {
            setError('Google authentication failed');
            setGoogleLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="auth-card">
                <h1>Sign Up</h1>

                <button
                    type="button"
                    className={`btn btn-google ${googleLoading ? 'loading' : ''}`}
                    onClick={handleGoogleAuth}
                    disabled={googleLoading || loading}
                >
                    {googleLoading ? (
                        <>
                            <span className="spinner"></span>
                            Connecting to Google...
                        </>
                    ) : (
                        'Continue with Google'
                    )}
                </button>

                <div style={{ textAlign: 'center', margin: '1rem 0', color: '#6c757d' }}>
                    or
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={loading || googleLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading || googleLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading || googleLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            disabled={loading || googleLoading}
                        />
                    </div>

                    {error && <div className="error">{error}</div>}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading || googleLoading}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="text-center mt-1">
                    <span>Already have an account? </span>
                    <Link to="/" className="link">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;