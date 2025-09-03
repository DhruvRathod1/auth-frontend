import React from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="container">
                <div className="auth-card">
                    <h1>Access Denied</h1>
                    <p>Please sign in to access the dashboard.</p>
                    <button 
                        className="btn btn-primary"
                        onClick={() => navigate('/')}
                    >
                        Go to Sign In
                    </button>
                </div>
            </div>
        );
    }

    const userName = user.name || user.email?.split('@')[0] || 'User';

    return (
        <div className="container">
            <div className="dashboard">
                <h1>Welcome to Your Dashboard, {userName}! 🎉</h1>
                <div className="dashboard-content">
                    <div className="user-info">
                        <h2>Your Account Information</h2>
                        <p><strong>Email:</strong> {user.email}</p>
                        {user.name && <p><strong>Name:</strong> {user.name}</p>}
                        {user.provider && <p><strong>Sign-in Method:</strong> {user.provider}</p>}
                    </div>
                    
                    <div className="features">
                        <h2>Available Features</h2>
                        <ul>
                            <li>✅ User Authentication</li>
                            <li>✅ Google OAuth Integration</li>
                            <li>✅ Email Verification</li>
                            <li>✅ Password Reset</li>
                            <li>✅ Secure Token Management</li>
                        </ul>
                    </div>
                    
                    <div className="welcome-message">
                        <p>You have successfully signed in to your account. This is your personal dashboard where you can manage your account and access your features.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;