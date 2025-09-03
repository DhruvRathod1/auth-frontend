import React from 'react';
import { useUser } from '../contexts/UserContext';

const Dashboard = () => {
    const { user } = useUser();

    if (!user) {
        return (
            <div className="container">
                <div className="auth-card">
                    <h1>Access Denied</h1>
                    <p>Please sign in to access the dashboard.</p>
                </div>
            </div>
        );
    }

    const userName = user.name || user.email?.split('@')[0] || 'User';

    return (
        <div className="container">
            <div className="dashboard">
                <h1>Welcome to Your Dashboard, {userName}! 🎉</h1>
                <p>You have successfully signed in to your account.</p>
                <p><strong>Email:</strong> {user.email}</p>
                {user.name && <p><strong>Name:</strong> {user.name}</p>}
                <p>This is your personal dashboard where you can manage your account and access your features.</p>
            </div>
        </div>
    );
};

export default Dashboard;