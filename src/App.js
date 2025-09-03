import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import UserDisplay from './components/UserDisplay';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import VerifyEmail from './components/auth/VerifyEmail';
import ForgotPassword from './components/auth/Forgotpassword';
import ResetPassword from './components/auth/ResetPassword';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <UserDisplay />
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;