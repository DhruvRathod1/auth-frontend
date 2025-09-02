import React, { useState, useEffect } from 'react';
import authService from '../services/authService';

const Dashboard = () => {
    const [healthStatus, setHealthStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tokenInfo, setTokenInfo] = useState(null);

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const response = await authService.healthCheck();
                setHealthStatus(response);
            } catch (error) {
                setHealthStatus({ status: 'error', message: 'Health check failed' });
            }
        };

        const getTokenInfo = () => {
            const token = authService.getToken();
            if (token) {
                try {
                    // Basic token info (in production, decode JWT properly)
                    setTokenInfo({
                        exists: true,
                        length: token.length,
                        preview: token.substring(0, 20) + '...'
                    });
                } catch (error) {
                    setTokenInfo({ exists: false });
                }
            }
        };

        const init = async () => {
            await checkHealth();
            getTokenInfo();
            setLoading(false);
        };

        init();
    }, []);

    const handleRefreshToken = async () => {
        try {
            await authService.refreshTokens();
            window.location.reload();
        } catch (error) {
            alert('Failed to refresh token');
        }
    };

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-card">
                <h1>Welcome to Dashboard</h1>
                <p>You have successfully authenticated!</p>
            </div>

            <div className="dashboard-card">
                <h2>API Health Status</h2>
                {healthStatus ? (
                    <div>
                        <p><strong>Status:</strong> {healthStatus.status || 'Connected'}</p>
                        <p><strong>Message:</strong> {healthStatus.message || 'API is healthy'}</p>
                    </div>
                ) : (
                    <p>Checking health status...</p>
                )}
            </div>

            <div className="dashboard-card">
                <h2>Token Information</h2>
                {tokenInfo ? (
                    <div>
                        <p><strong>Token Exists:</strong> {tokenInfo.exists ? 'Yes' : 'No'}</p>
                        {tokenInfo.exists && (
                            <>
                                <p><strong>Token Length:</strong> {tokenInfo.length} characters</p>
                                <p><strong>Token Preview:</strong> {tokenInfo.preview}</p>
                                <button
                                    className="btn btn-secondary mt-1"
                                    onClick={handleRefreshToken}
                                    style={{ width: 'auto' }}
                                >
                                    Refresh Token
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <p>No token information available</p>
                )}
            </div>

            <div className="dashboard-card">
                <h2>Available API Endpoints</h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ padding: '0.25rem 0' }}>✅ POST /auth/signup - Register user</li>
                    <li style={{ padding: '0.25rem 0' }}>✅ POST /auth/signin - Sign in user</li>
                    <li style={{ padding: '0.25rem 0' }}>✅ POST /auth/verify - Verify email</li>
                    <li style={{ padding: '0.25rem 0' }}>✅ POST /auth/forgot-password - Request reset</li>
                    <li style={{ padding: '0.25rem 0' }}>✅ POST /auth/reset-password - Reset password</li>
                    <li style={{ padding: '0.25rem 0' }}>✅ POST /auth/refresh-tokens - Refresh tokens</li>
                    <li style={{ padding: '0.25rem 0' }}>✅ GET /auth/google/auth - Google OAuth</li>
                    <li style={{ padding: '0.25rem 0' }}>✅ GET /auth/health - Health check</li>
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;