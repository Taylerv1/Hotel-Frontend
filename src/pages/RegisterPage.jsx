import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlinePhone } from 'react-icons/hi';

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
        <div className="flex min-h-screen">
            <Toaster position="top-right" />

            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent-600 via-primary-700 to-surface-900 items-center justify-center p-12">
                <div className="max-w-md text-center">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-2xl bg-white/10 backdrop-blur mb-8">
                        <span className="text-3xl font-bold text-white">H</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">Join HotelAdmin</h1>
                    <p className="text-primary-200 text-lg">
                        Create your account and start managing hotel operations efficiently.
                    </p>
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex flex-1 items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <h2 className="text-2xl font-bold text-surface-800 mb-1">Create Account</h2>
                    <p className="text-surface-400 mb-8">Fill in your details to get started</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {fields.map((f) => (
                            <div key={f.name}>
                                <label className="block text-sm font-medium text-surface-700 mb-1.5">{f.label}</label>
                                <div className="relative">
                                    <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                                    <input
                                        type={f.type}
                                        value={form[f.name]}
                                        onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                                        required={f.required}
                                        minLength={f.min}
                                        placeholder={f.placeholder}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-surface-300 text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 disabled:opacity-50 transition-colors cursor-pointer"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-surface-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
