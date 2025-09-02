import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import VerifyEmail from './components/auth/VerifyEmail';
import ForgotPassword from './components/auth/Forgotpassword';
import ResetPassword from './components/auth/ResetPassword';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import authService from './services/authService';
import './styles/global.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return authService.isAuthenticated() ? (
    <>
      <Navbar />
      {children}
    </>
  ) : (
    <Navigate to="/" />
  );
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  return authService.isAuthenticated() ? (
    <Navigate to="/dashboard" />
  ) : (
    children
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />
          <Route
            path="/verify-email"
            element={
              <PublicRoute>
                <VerifyEmail />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;