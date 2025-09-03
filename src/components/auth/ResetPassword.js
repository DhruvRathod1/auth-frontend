import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import authService from '../../services/authService';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        email: '',
        code: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        // Get email from navigation state, search params, or localStorage
        const emailFromState = location.state?.email;
        const emailFromParams = searchParams.get('email');
        const emailFromStorage = localStorage.getItem('resetPasswordEmail');

        if (emailFromState) {
            setFormData(prev => ({ ...prev, email: emailFromState }));
            localStorage.setItem('resetPasswordEmail', emailFromState);
        } else if (emailFromParams) {
            setFormData(prev => ({ ...prev, email: emailFromParams }));
            localStorage.setItem('resetPasswordEmail', emailFromParams);
        } else if (emailFromStorage) {
            setFormData(prev => ({ ...prev, email: emailFromStorage }));
        }

        // Get code from URL params if present
        const codeFromParams = searchParams.get('code');
        if (codeFromParams) {
            setFormData(prev => ({ ...prev, code: codeFromParams }));
        }
    }, [location.state, searchParams]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.email || !formData.code || !formData.newPassword || !formData.confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (formData.code.length !== 6) {
            setError('Verification code must be 6 digits');
            return;
        }

        if (formData.newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log('Resetting password with data:', {
                email: formData.email,
                code: formData.code,
                newPassword: '***hidden***'
            });

            const response = await authService.resetPassword({
                email: formData.email.trim(),
                code: formData.code.trim(),
                newPassword: formData.newPassword
            });

            console.log('Password reset successful:', response);

            // Clear stored email
            localStorage.removeItem('resetPasswordEmail');

            // Show success message
            showSuccessToast('Password reset successfully! Please sign in with your new password.');

            // Redirect to sign in
            setTimeout(() => navigate('/'), 2000);

        } catch (err) {
            console.error('Reset password error:', err);
            const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Password reset failed';
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
            setFormData({ ...formData, code: value });
        }
        if (error) setError('');
    };

    return (
        <div className="auth-container">
            <div className="auth-wrapper">
                <div className="auth-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
                    {/* Header */}
                    <div className="auth-header">
                        <div className="auth-logo">🔐</div>
                        <h1 className="auth-title">Reset Password</h1>
                        <p className="auth-subtitle">Enter the code sent to your email and create a new password</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
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
                                    name="code"
                                    value={formData.code}
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
                            <p style={{ fontSize: '0.8rem', color: '#718096', marginTop: '0.5rem' }}>
                                Check your email for the verification code
                            </p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <div className="input-wrapper password-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="newPassword"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="Enter new password"
                                    required
                                    disabled={loading}
                                    minLength="8"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={loading}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#718096', marginTop: '0.5rem' }}>
                                Must be at least 8 characters long
                            </p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <div className="input-wrapper password-wrapper">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm new password"
                                    required
                                    disabled={loading}
                                    minLength="8"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    disabled={loading}
                                >
                                    {showConfirmPassword ? '🙈' : '👁️'}
                                </button>
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
                            disabled={loading || !formData.email || !formData.code || !formData.newPassword || !formData.confirmPassword}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Resetting Password...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="auth-footer">
                        <button
                            type="button"
                            onClick={() => navigate('/forgot-password')}
                            className="link-primary"
                            style={{
                                background: 'none',
                                border: 'none',
                                textDecoration: 'underline',
                                cursor: 'pointer'
                            }}
                        >
                            ← Back to Forgot Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;