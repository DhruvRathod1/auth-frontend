import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import authService from '../../services/authService';

const GoogleCallback = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('Processing...');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useUser();

    useEffect(() => {
        const handleGoogleCallback = async () => {
            try {
                setStatus('Getting authorization code...');
                const code = searchParams.get('code');
                const state = searchParams.get('state');
                const errorParam = searchParams.get('error');

                if (errorParam) {
                    setError(`Google authentication cancelled: ${errorParam}`);
                    return;
                }

                if (!code) {
                    setError('No authorization code received from Google');
                    return;
                }

                setStatus('Verifying with server...');
                const response = await authService.processGoogleCallback(code, state);

                if (!response || !response.user) {
                    setError('Invalid response from server');
                    return;
                }

                const { user } = response;

                setStatus('Signing you in...');
                login(user);

                showWelcomeToast(user.name || user.email?.split('@')[0] || 'User');

                setStatus('Redirecting to dashboard...');
                setTimeout(() => navigate('/dashboard'), 1500);

            } catch (err) {
                console.error('Google callback error:', err);
                const errorMessage = err.response?.data?.message || err.message || 'Authentication failed';
                setError(`Authentication failed: ${errorMessage}`);
                setTimeout(() => navigate('/'), 5000);
            } finally {
                setLoading(false);
            }
        };

        handleGoogleCallback();
    }, [searchParams, navigate, login]);

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
            <div className="container">
                <div className="auth-card">
                    <h1>🔄 Signing you in...</h1>
                    <div style={{ textAlign: 'center', margin: '2rem 0' }}>
                        <div className="spinner" style={{
                            width: '50px',
                            height: '50px',
                            border: '4px solid #f3f3f3',
                            borderTop: '4px solid #007bff',
                            margin: '0 auto'
                        }}></div>
                    </div>
                    <p style={{ textAlign: 'center', color: '#666' }}>
                        {status}
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="auth-card">
                    <h1>❌ Authentication Error</h1>
                    <div className="error">{error}</div>
                    <p style={{ textAlign: 'center', color: '#666', marginTop: '1rem' }}>
                        Redirecting you back to sign in in 5 seconds...
                    </p>
                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
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