import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import authService from '../../services/authService';

const SignIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useUser();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const showWelcomeToast = (userName) => {
        const toast = document.createElement('div');
        toast.className = 'welcome-toast';
        toast.textContent = `Welcome back, ${userName}! 👋`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.signin(formData);
            const { user } = response;

            login(user);
            const userName = user.name || user.email?.split('@')[0] || 'User';
            showWelcomeToast(userName);

            setTimeout(() => navigate('/dashboard'), 1500);

        } catch (err) {
            setError(err.response?.data?.message || 'Sign in failed');
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
                <h1>Sign In</h1>

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

                    {error && <div className="error">{error}</div>}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading || googleLoading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="text-center mt-1">
                    <Link to="/forgot-password" className="link">Forgot Password?</Link>
                </div>

                <div className="text-center mt-1">
                    <span>Don't have an account? </span>
                    <Link to="/signup" className="link">Sign Up</Link>
                </div>
            </div>
        </div>
    );
};

export default SignIn;