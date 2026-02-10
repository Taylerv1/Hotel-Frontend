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
        <div className="flex min-h-screen">
            <Toaster position="top-right" />

            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-700 via-primary-800 to-surface-900 items-center justify-center p-12">
                <div className="max-w-md text-center">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-2xl bg-white/10 backdrop-blur mb-8">
                        <span className="text-3xl font-bold text-white">H</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">Hotel Booking Admin</h1>
                    <p className="text-primary-200 text-lg">
                        Manage your hotel bookings, guests, and rooms all in one place.
                    </p>
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex flex-1 items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <div className="lg:hidden mb-8 text-center">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-xl bg-primary-600 mb-4">
                            <span className="text-xl font-bold text-white">H</span>
                        </div>
                        <h1 className="text-2xl font-bold text-surface-800">Hotel Booking Admin</h1>
                    </div>

                    <h2 className="text-2xl font-bold text-surface-800 mb-1">Welcome back</h2>
                    <p className="text-surface-400 mb-8">Enter your credentials to access the dashboard</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1.5">Email</label>
                            <div className="relative">
                                <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    required
                                    placeholder="admin@hotel.com"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-surface-300 text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1.5">Password</label>
                            <div className="relative">
                                <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
                                    minLength={6}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-surface-300 text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 disabled:opacity-50 transition-colors cursor-pointer"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-surface-400">
                        Don&apos;t have an account?{' '}
                        <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
