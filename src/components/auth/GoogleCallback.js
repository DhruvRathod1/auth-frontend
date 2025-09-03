import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

const GoogleCallback = () => {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Parse URL parameters - tokens come from the redirect
                const urlParams = new URLSearchParams(location.search);
                const accessToken = urlParams.get('token');
                const refreshToken = urlParams.get('refresh');
                const error = urlParams.get('error');

                if (error) {
                    console.error('Google OAuth error:', error);
                    alert(`Authentication failed: ${decodeURIComponent(error)}`);
                    navigate('/');
                    return;
                }

                if (accessToken && refreshToken) {
                    console.log('Google OAuth successful, storing tokens');
                    
                    // Store tokens in localStorage
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                    
                    // Decode the JWT to get user info (optional)
                    try {
                        const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
                        const user = {
                            sub: tokenPayload.sub,
                            email: tokenPayload.email,
                            username: tokenPayload.username
                        };
                        
                        localStorage.setItem('user', JSON.stringify(user));
                        setUser(user);
                    } catch (decodeError) {
                        console.warn('Could not decode token payload:', decodeError);
                        // Set a basic user object
                        const user = { authenticated: true };
                        localStorage.setItem('user', JSON.stringify(user));
                        setUser(user);
                    }
                    
                    console.log('Redirecting to dashboard');
                    navigate('/dashboard');
                } else {
                    console.error('No tokens received from callback');
                    alert('Authentication failed: No tokens received');
                    navigate('/');
                }
            } catch (error) {
                console.error('Google callback error:', error);
                alert('Authentication failed. Please try again.');
                navigate('/');
            }
        };

        handleCallback();
    }, [location, navigate, setUser]);

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Processing Google Sign-In...</h2>
            <p>Please wait while we complete your authentication.</p>
        </div>
    );
};

export default GoogleCallback;