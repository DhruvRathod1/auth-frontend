import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const UserDisplay = () => {
    const { user, logout, logoutGlobal, logoutLocal } = useUser();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleGlobalLogout = async () => {
        setLoading(true);
        try {
            await logoutGlobal();
            navigate('/');
        } catch (error) {
            console.error('Global logout failed:', error);
            // Navigate anyway since local state is cleared
            navigate('/');
        } finally {
            setLoading(false);
            setShowDropdown(false);
        }
    };

    const handleLocalLogout = async () => {
        setLoading(true);
        try {
            await logoutLocal();
            navigate('/');
        } catch (error) {
            console.error('Local logout failed:', error);
            // Navigate anyway since local state is cleared
            navigate('/');
        } finally {
            setLoading(false);
            setShowDropdown(false);
        }
    };

    const userName = user.name || user.email?.split('@')[0] || 'User';

    return (
        <div className="user-display" ref={dropdownRef}>
            <span className="user-name">Hi, {userName}!</span>
            <div className="logout-dropdown">
                <button 
                    onClick={() => setShowDropdown(!showDropdown)} 
                    className="logout-btn"
                    disabled={loading}
                >
                    {loading ? 'Signing out...' : 'Logout'} ▼
                </button>
                {showDropdown && (
                    <div className="dropdown-menu">
                        <button onClick={handleLogout} className="dropdown-item">
                            Quick Logout
                        </button>
                        <button onClick={handleLocalLogout} className="dropdown-item" disabled={loading}>
                            Sign out (Current Device)
                        </button>
                        <button onClick={handleGlobalLogout} className="dropdown-item" disabled={loading}>
                            Sign out (All Devices)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDisplay;