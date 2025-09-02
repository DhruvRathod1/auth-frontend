import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../../services/authService';

const ResetPassword = () => {
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await authService.resetPassword({
                email: email,
                code: code,
                newPassword: newPassword
            });
            setSuccess('Password reset successfully!');
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Password reset failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="auth-card">
                <h1>Reset Password</h1>

                <p style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#6c757d' }}>
                    Enter the verification code sent to <strong>{email}</strong> and your new password
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Verification Code</label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Enter 6-digit code"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            required
                        />
                    </div>

                    {error && <div className="error">{error}</div>}
                    {success && <div className="success">{success}</div>}

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <div className="text-center mt-1">
                    <Link to="/" className="link">Back to Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;