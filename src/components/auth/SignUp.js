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
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Simple welcome toast function
    const showWelcomeToast = (userName) => {
        const toast = document.createElement('div');
        toast.className = 'welcome-toast';
        toast.textContent = `Welcome, ${userName}! Please verify your email 📧`;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await authService.signup({ // Removed unused 'response'
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            
            // Show welcome toast
            showWelcomeToast(formData.name || formData.email.split('@')[0]);
            
            // Navigate to verification page
            setTimeout(() => {
                navigate('/verify-email', { state: { email: formData.email } });
            }, 1500);
            
        } catch (err) {
            setError(err.response?.data?.message || 'Sign up failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        try {
            const response = await authService.getGoogleAuthUrl();
            if (response.authUrl) {
                window.location.href = response.authUrl;
            }
        } catch (err) {
            setError('Google authentication failed');
        }
    };

    return (
        <div className="container">
            <div className="auth-card">
                <h1>Sign Up</h1>

                <button
                    type="button"
                    className="btn btn-google"
                    onClick={handleGoogleAuth}
                >
                    Continue with Google
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
                        />
                    </div>

                    {error && <div className="error">{error}</div>}

                    <button type="submit" className="btn btn-primary" disabled={loading}>
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