import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';

export default function LoginPage() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    if (isAuthenticated) return <Navigate to="/dashboard" replace />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(form.email, form.password);
            toast.success('Login successful!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <Toaster position="top-right" />

            {/* Left Panel */}
            <div className="auth-panel auth-panel--login">
                <div className="auth-panel__content">
                    <div className="auth-panel__logo">
                        <span className="auth-panel__logo-text">H</span>
                    </div>
                    <h1 className="auth-panel__title">Hotel Booking Admin</h1>
                    <p className="auth-panel__subtitle">
                        Manage your hotel bookings, guests, and rooms all in one place.
                    </p>
                </div>
            </div>

            {/* Right Panel */}
            <div className="auth-form-panel">
                <div className="auth-form-container">
                    <div className="auth-mobile-header">
                        <div className="auth-mobile-logo">
                            <span className="auth-mobile-logo-text">H</span>
                        </div>
                        <h1 className="auth-mobile-title">Hotel Booking Admin</h1>
                    </div>

                    <h2 className="auth-heading">Welcome back</h2>
                    <p className="auth-subheading">Enter your credentials to access the dashboard</p>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div>
                            <label className="auth-label">Email</label>
                            <div className="auth-input-wrapper">
                                <HiOutlineMail className="auth-input-icon" />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    required
                                    placeholder="admin@hotel.com"
                                    className="auth-input"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="auth-label">Password</label>
                            <div className="auth-input-wrapper">
                                <HiOutlineLockClosed className="auth-input-icon" />
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
                                    minLength={6}
                                    placeholder="••••••••"
                                    className="auth-input"
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="auth-submit-btn">
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Don&apos;t have an account?{' '}
                        <Link to="/register" className="auth-footer-link">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
