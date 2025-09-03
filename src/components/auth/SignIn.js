import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import authService from '../../services/authService';

const SignIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');
    
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await authService.signin(formData);
            
            if (result.success) {
                // Store tokens and user data
                localStorage.setItem('accessToken', result.tokens.AccessToken);
                localStorage.setItem('refreshToken', result.tokens.RefreshToken);
                localStorage.setItem('idToken', result.tokens.IdToken);
                localStorage.setItem('user', JSON.stringify(result.user));
                
                setUser(result.user);
                navigate('/dashboard');
            } else {
                setError(result.message || 'Sign in failed');
            }
        } catch (error) {
            console.error('Sign in error:', error);
            
            if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else if (error.message) {
                setError(error.message);
            } else {
                setError('An error occurred during sign in');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        setError('');
        
        try {
            console.log('Starting Google OAuth flow...');
            const result = await authService.getGoogleAuthUrl();
            
            if (result.authUrl) {
                console.log('Redirecting to Google OAuth...');
                // Redirect to Google OAuth - this is a full page redirect, not an AJAX call
                window.location.href = result.authUrl;
            } else {
                setError('Failed to get Google authentication URL');
                setGoogleLoading(false);
            }
        } catch (error) {
            console.error('Google OAuth error:', error);
            setError('Failed to initiate Google sign-in');
            setGoogleLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Sign In</h2>
                
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
                
                <div className="divider">
                    <span>OR</span>
                </div>
                
                <button
                    type="button"
                    className="google-button"
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading}
                >
                    {googleLoading ? 'Redirecting...' : 'Continue with Google'}
                </button>
                
                <div className="auth-links">
                    <Link to="/forgot-password">Forgot your password?</Link>
                    <span>Don't have an account? <Link to="/signup">Sign up</Link></span>
                </div>
            </div>
        </div>
    );
};

export default SignIn;