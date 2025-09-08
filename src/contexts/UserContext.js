import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('idToken');
    };

    const logoutGlobal = async () => {
        try {
            await authService.signOutGlobal();
            setUser(null);
        } catch (error) {
            console.error('Error during global logout:', error);
            // Still clear local state even if API call fails
            setUser(null);
        }
    };

    const logoutLocal = async () => {
        try {
            await authService.signOutLocal();
            setUser(null);
        } catch (error) {
            console.error('Error during local logout:', error);
            // Still clear local state even if API call fails
            setUser(null);
        }
    };

    return (
        <UserContext.Provider value={{ 
            user, 
            login, 
            logout, 
            logoutGlobal, 
            logoutLocal 
        }}>
            {children}
        </UserContext.Provider>
    );
};

// Export UserContext for direct use
export { UserContext };