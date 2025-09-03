import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

const GoogleCallback = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('Processing...');
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useUser();

    useEffect(() => {
        const handleGoogleCallback = async () => {
            try {
                setStatus('Processing Google authentication...');

                // Check if we have tokens in URL (from successful backend redirect)
                const token = searchParams.get('token');
                const refreshToken = searchParams.get('refresh');
                const errorParam = searchParams.get('error');

                console.log('URL search params:', {
                    token: token ? 'present' : 'missing',
                    refresh: refreshToken ? 'present' : 'missing',
                    error: errorParam,
                    fullURL: window.location.href
                });

                if (errorParam) {
                    setError(`Authentication failed: ${errorParam}`);
                    setTimeout(() => navigate('/'), 5000);
                    return;
                }

                if (token && refreshToken) {
                    setStatus('Processing tokens...');

                    // Store tokens
                    localStorage.setItem('accessToken', token);
                    localStorage.setItem('refreshToken', refreshToken);

                    // Decode JWT to get user info
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        const user = {
                            id: payload.sub,
                            email: payload.email || `user_${payload.sub.substring(0, 8)}@google.com`,
                            name: payload.name || payload.given_name || 'Google User',
                            provider: 'google',
                            username: payload.username || payload.sub
                        };

                        console.log('Decoded user from token:', user);
                        setStatus('Signing you in...');
                        login(user);

                        showWelcomeToast(user.name);

                        setStatus('Redirecting to dashboard...');
                        setTimeout(() => navigate('/dashboard'), 1500);
                        return;

                    } catch (decodeError) {
                        console.error('Error decoding token:', decodeError);

                        // Fallback: create basic user object
                        const user = {
                            id: `google_${Date.now()}`,
                            email: 'google.user@example.com',
                            name: 'Google User',
                            provider: 'google'
                        };

                        login(user);
                        navigate('/dashboard');
                        return;
                    }
                }

                // If no tokens in URL, we need to exchange the code
                const code = searchParams.get('code');
                const state = searchParams.get('state');

                if (!code) {
                    console.log('No tokens received from callback');
                    setError('No authorization code or tokens received from Google. Please try again.');
                    setTimeout(() => navigate('/'), 5000);
                    return;
                }

                console.log('Authorization code received, redirecting to backend for token exchange...');
                setStatus('Exchanging authorization code...');

                // Redirect to backend for token exchange
                // The backend will handle the OAuth flow and redirect back with tokens
                const backendCallbackUrl = `https://7rtfzr1a2i.execute-api.ap-south-1.amazonaws.com/Dev/auth/google/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state || '')}`;

                console.log('Redirecting to backend:', backendCallbackUrl);
                window.location.href = backendCallbackUrl;

            } catch (err) {
                console.error('Google callback error:', err);
                setError('Authentication failed. Please try again.');
                setTimeout(() => navigate('/'), 5000);
            } finally {
                setLoading(false);
            }
        };

        handleGoogleCallback();
    }, [searchParams, navigate, login, location]);

    const showWelcomeToast = (userName) => {
        const toast = document.createElement('div');
        toast.className = 'welcome-toast';
        toast.textContent = `Welcome, ${userName}! 👋`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    };

    if (loading) {
        return (
            <div className="auth-container">
                <div className="auth-wrapper">
                    <div className="auth-card" style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
                        <div className="auth-header">
                            <div className="auth-logo">🔄</div>
                            <h1 className="auth-title">Signing you in...</h1>
                            <p className="auth-subtitle">Please wait while we complete your authentication</p>
                        </div>

                        <div style={{ margin: '2rem 0' }}>
                            <div className="spinner" style={{
                                width: '50px',
                                height: '50px',
                                border: '4px solid #f3f3f3',
                                borderTop: '4px solid #667eea',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                margin: '0 auto'
                            }}></div>
                        </div>

                        <p style={{ color: '#718096', fontSize: '0.9rem' }}>
                            {status}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="auth-container">
                <div className="auth-wrapper">
                    <div className="auth-card" style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
                        <div className="auth-header">
                            <div className="auth-logo">❌</div>
                            <h1 className="auth-title">Authentication Error</h1>
                        </div>

                        <div className="error-message" style={{ textAlign: 'left', margin: '1.5rem 0' }}>
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>

                        <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
                            Redirecting you back to sign in in 5 seconds...
                        </p>

                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/')}
                        >
                            Go Back to Sign In
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default GoogleCallback;