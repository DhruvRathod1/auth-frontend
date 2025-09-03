import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import authService from '../../services/authService';

const VerifyEmail = () => {
    const [code, setCode] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useUser();

    useEffect(() => {
        // Get email from navigation state or localStorage
        const emailFromState = location.state?.email;
        const emailFromStorage = localStorage.getItem('pendingVerificationEmail');

        if (emailFromState) {
            setEmail(emailFromState);
            localStorage.setItem('pendingVerificationEmail', emailFromState);
        } else if (emailFromStorage) {
            setEmail(emailFromStorage);
        } else {
            // If no email found, redirect to signup
            navigate('/signup');
        }
    }, [location.state, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !code) {
            setError('Email and verification code are required');
            return;
        }

        if (code.length !== 6) {
            setError('Verification code must be 6 digits');
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log('Verifying with data:', { email, code });

            const response = await authService.verifyEmail(email, code);
            console.log('Verification successful:', response);

            // Clear pending email from storage
            localStorage.removeItem('pendingVerificationEmail');

            // If verification includes user data, log them in
            if (response.user) {
                login(response.user);
                showSuccessToast('Email verified successfully! Welcome!');
                setTimeout(() => navigate('/dashboard'), 1500);
            } else {
                showSuccessToast('Email verified successfully! Please sign in.');
                setTimeout(() => navigate('/'), 2000);
            }

        } catch (err) {
            console.error('Verification error:', err);
            const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Verification failed';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const showSuccessToast = (message) => {
        const toast = document.createElement('div');
        toast.className = 'welcome-toast';
        toast.style.background = '#28a745';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    };

    const handleCodeChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Only digits
        if (value.length <= 6) {
            setCode(value);
        }
        if (error) setError('');
    };

    return (
        <div className="auth-container">
            <div className="verify-email-wrapper">
                <div className="verify-email-card">
                    {/* Header Section */}
                    <div className="verify-header">
                        <div className="verify-icon-container">
                            <div className="verify-icon">📧</div>
                        </div>
                        <h1 className="verify-title">Verify Your Email</h1>
                        <p className="verify-subtitle">
                            We've sent a 6-digit verification code to
                        </p>
                        <div className="email-display">
                            {email}
                        </div>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleSubmit} className="verify-form">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <div className="input-container">
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    disabled={loading}
                                    className="form-input"
                                />
                                <span className="input-icon">📧</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="code" className="form-label">Verification Code</label>
                            <div className="input-container">
                                <input
                                    type="text"
                                    id="code"
                                    value={code}
                                    onChange={handleCodeChange}
                                    placeholder="000000"
                                    required
                                    disabled={loading}
                                    maxLength="6"
                                    className="form-input code-input"
                                />
                                <span className="input-icon">🔢</span>
                            </div>
                            <p className="input-hint">
                                Enter the 6-digit code from your email
                            </p>
                        </div>

                        {error && (
                            <div className="error-container">
                                <span className="error-icon">⚠️</span>
                                <span className="error-text">{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="verify-button"
                            disabled={loading || !email || !code}
                        >
                            {loading ? (
                                <>
                                    <span className="button-spinner"></span>
                                    Verifying...
                                </>
                            ) : (
                                'Verify Email'
                            )}
                        </button>
                    </form>

                    {/* Footer Section */}
                    <div className="verify-footer">
                        <p className="footer-text">
                            Didn't receive the code? Check your spam folder
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate('/signup')}
                            className="back-button"
                            disabled={loading}
                        >
                            ← Back to Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;