import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { UserProvider, useUser } from './contexts/UserContext';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import VerifyEmail from './components/auth/VerifyEmail';
import ForgotPassword from './components/auth/Forgotpassword';
import ResetPassword from './components/auth/ResetPassword';
import GoogleCallback from './components/auth/GoogleCallback';
import Dashboard from './components/Dashboard';
import './App.css';

// Component to handle tokens in URL
const TokenHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, user } = useUser();

  useEffect(() => {
    // Only process tokens if user is not already logged in and we're on the home page
    if (!user && location.pathname === '/') {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get('token');
      const refreshToken = urlParams.get('refresh');
      const error = urlParams.get('error');

      if (error) {
        console.error('Google OAuth error from URL:', error);
        // Clear error from URL
        navigate('/', { replace: true });
        return;
      }

      if (token && refreshToken) {
        console.log('Found tokens in main URL, processing...');

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

          console.log('Auto-login from URL tokens:', user);
          login(user);

          // Show welcome toast
          const toast = document.createElement('div');
          toast.className = 'welcome-toast';
          toast.textContent = `Welcome, ${user.name}! 👋`;
          document.body.appendChild(toast);

          setTimeout(() => {
            toast.remove();
          }, 3000);

          // Clear URL and navigate to dashboard
          navigate('/dashboard', { replace: true });

        } catch (err) {
          console.error('Error decoding token from URL:', err);
          // Clear invalid tokens from URL
          navigate('/', { replace: true });
        }
      }
    }
  }, [location.search, login, navigate, user, location.pathname]);

  return null;
};

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <TokenHandler />
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;