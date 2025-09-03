import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.forgotPassword(email);
            console.log('Forgot password successful:', response);

            navigate('/reset-password', {
                state: { email: email }
            });

        } catch (err) {
            console.error('Forgot password error:', err);
            const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Failed to send reset code';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="auth-card">
                <h1>Forgot Password</h1>

                <p style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#6c757d' }}>
                    Enter your email address and we'll send you a code to reset your password.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="error">{error}</div>}

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Code'}
                    </button>
                </form>

                <div className="text-center mt-1">
                    <Link to="/" className="link">Back to Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;