import React from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const UserDisplay = () => {
    const { user, logout } = useUser();
    const navigate = useNavigate();

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const userName = user.name || user.email?.split('@')[0] || 'User';

    return (
        <div className="user-display">
            <span className="user-name">Hi, {userName}!</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
    );
};

export default UserDisplay;