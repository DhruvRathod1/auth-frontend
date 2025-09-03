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
            <div className="auth-wrapper">
                <div className="auth-card" style={{ maxWidth: '450px', margin: '0 auto' }}>
                    <div className="auth-header">
                        <div className="auth-logo">📧</div>
                        <h1 className="auth-title">Verify Your Email</h1>
                        <p className="auth-subtitle">
                            Enter the 6-digit code sent to {email}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    disabled={loading}
                                />
                                <span className="input-icon">📧</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="code">Verification Code</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    id="code"
                                    value={code}
                                    onChange={handleCodeChange}
                                    placeholder="Enter 6-digit code"
                                    required
                                    disabled={loading}
                                    maxLength="6"
                                    style={{
                                        fontSize: '1.2rem',
                                        letterSpacing: '0.2em',
                                        textAlign: 'center'
                                    }}
                                />
                                <span className="input-icon">🔢</span>
                            </div>
                        </div>

                        {error && (
                            <div className="error-message">
                                <span className="error-icon">⚠️</span>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading || !email || !code}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Verifying...
                                </>
                            ) : (
                                'Verify Email'
                            )}
                        </button>
                    </form>
                </div>

                <div className="auth-side-panel">
                    <div className="side-content">
                        <h2>📬 Check Your Email</h2>
                        <p>We've sent you a secure verification code</p>
                        <div className="features-list">
                            <div className="feature-item">
                                <span className="feature-icon">🔒</span>
                                <span>Secure Verification</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">⏱️</span>
                                <span>Quick Process</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">✉️</span>
                                <span>Email Protection</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;