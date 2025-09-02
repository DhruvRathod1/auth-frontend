import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div>
                <h2>Auth App</h2>
            </div>
            <div>
                <button
                    className="btn btn-secondary"
                    onClick={handleLogout}
                    style={{ width: 'auto', padding: '0.5rem 1rem' }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;