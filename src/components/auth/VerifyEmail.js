import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../../services/authService';

const VerifyEmail = () => {
    const [code, setCode] = useState('');
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

        try {
            await authService.verifyEmail({
                email,
                code: code
            });
            setSuccess('Email verified successfully!');
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="auth-card">
                <h1>Verify Email</h1>

                <p style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#6c757d' }}>
                    Please enter the verification code sent to <strong>{email}</strong>
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

                    {error && <div className="error">{error}</div>}
                    {success && <div className="success">{success}</div>}

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify Email'}
                    </button>
                </form>

                <div className="text-center mt-1">
                    <Link to="/" className="link">Back to Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;