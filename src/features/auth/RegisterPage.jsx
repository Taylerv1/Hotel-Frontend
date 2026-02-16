import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlinePhone } from 'react-icons/hi';

/**
 * RegisterPage — The registration screen for the hotel admin system.
 *
 * Responsibility:
 *   Renders a registration form with name, email, password, and phone fields.
 *   Calls the AuthContext's register() method on submit, then
 *   navigates to /dashboard on success.
 *   If the user is already authenticated, redirects immediately.
 */
export default function RegisterPage() {
    const { register, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
    const [loading, setLoading] = useState(false);

    if (isAuthenticated) return <Navigate to="/dashboard" replace />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(form);
            toast.success('Registration successful!');
            navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.errors?.map(e => e.message).join(', ') || 'Registration failed';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { name: 'name', label: 'Full Name', type: 'text', icon: HiOutlineUser, placeholder: 'John Doe', required: true, min: 2 },
        { name: 'email', label: 'Email', type: 'email', icon: HiOutlineMail, placeholder: 'john@hotel.com', required: true },
        { name: 'password', label: 'Password', type: 'password', icon: HiOutlineLockClosed, placeholder: '••••••••', required: true, min: 6 },
        { name: 'phone', label: 'Phone (optional)', type: 'tel', icon: HiOutlinePhone, placeholder: '0591234567', required: false },
    ];

    return (
        <div className="auth-page">
            <Toaster position="top-right" />

            {/* Left Panel */}
            <div className="auth-panel auth-panel--register">
                <div className="auth-panel__content">
                    <h1 className="auth-panel__title">Join HotelAdmin</h1>
                    <p className="auth-panel__subtitle">
                        Create your account and start managing hotel operations efficiently.
                    </p>
                </div>
            </div>

            {/* Right Panel */}
            <div className="auth-form-panel">
                <div className="auth-form-container">
                    <h2 className="auth-heading">Create Account</h2>
                    <p className="auth-subheading">Fill in your details to get started</p>

                    <form onSubmit={handleSubmit} className="auth-form auth-form--register">
                        {fields.map((f) => (
                            <div key={f.name}>
                                <label className="auth-label">{f.label}</label>
                                <div className="auth-input-wrapper">
                                    <f.icon className="auth-input-icon" />
                                    <input
                                        type={f.type}
                                        value={form[f.name]}
                                        onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                                        required={f.required}
                                        minLength={f.min}
                                        placeholder={f.placeholder}
                                        className="auth-input"
                                    />
                                </div>
                            </div>
                        ))}

                        <button type="submit" disabled={loading} className="auth-submit-btn">
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Already have an account?{' '}
                        <Link to="/login" className="auth-footer-link">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
