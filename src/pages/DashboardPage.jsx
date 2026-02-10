import { useState, useEffect } from 'react';
import { HiOutlineUsers, HiOutlineCalendar, HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi';
import { getUsers } from '../api/usersApi';
import { getBookings } from '../api/bookingsApi';
import LoadingSpinner from '../components/LoadingSpinner';

export default function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, bookingsRes, confirmedRes, pendingRes] = await Promise.all([
                    getUsers({ page: 1, limit: 1 }),
                    getBookings({ page: 1, limit: 5, sort: 'createdAt', order: 'desc' }),
                    getBookings({ page: 1, limit: 1, status: 'confirmed' }),
                    getBookings({ page: 1, limit: 1, status: 'pending' }),
                ]);

                setStats({
                    totalUsers: usersRes.data.pagination?.totalItems || 0,
                    totalBookings: bookingsRes.data.pagination?.totalItems || 0,
                    confirmed: confirmedRes.data.pagination?.totalItems || 0,
                    pending: pendingRes.data.pagination?.totalItems || 0,
                });
                setRecentBookings(bookingsRes.data.bookings || []);
            } catch (err) {
                console.error('Failed to load dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <LoadingSpinner size="lg" />;

    const cards = [
        { label: 'Total Users', value: stats?.totalUsers, icon: HiOutlineUsers, color: 'bg-blue-500' },
        { label: 'Total Bookings', value: stats?.totalBookings, icon: HiOutlineCalendar, color: 'bg-purple-500' },
        { label: 'Confirmed', value: stats?.confirmed, icon: HiOutlineCheckCircle, color: 'bg-green-500' },
        { label: 'Pending', value: stats?.pending, icon: HiOutlineClock, color: 'bg-yellow-500' },
    ];

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-surface-800">Dashboard</h1>
                <p className="text-surface-400 text-sm mt-1">Overview of your hotel management system</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {cards.map((c) => (
                    <div key={c.label} className="bg-white rounded-xl border border-surface-200 p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-surface-500">{c.label}</span>
                            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${c.color} bg-opacity-10`}>
                                <c.icon className={`w-5 h-5 ${c.color.replace('bg-', 'text-')}`} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-surface-800">{c.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-xl border border-surface-200">
                <div className="px-5 py-4 border-b border-surface-200">
                    <h2 className="text-lg font-semibold text-surface-800">Recent Bookings</h2>
                </div>
                {recentBookings.length === 0 ? (
                    <div className="p-8 text-center text-surface-400">No bookings yet</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-surface-100 text-left">
                                    <th className="px-5 py-3 font-semibold text-surface-500">Guest</th>
                                    <th className="px-5 py-3 font-semibold text-surface-500">Room</th>
                                    <th className="px-5 py-3 font-semibold text-surface-500">Check-in</th>
                                    <th className="px-5 py-3 font-semibold text-surface-500">Status</th>
                                    <th className="px-5 py-3 font-semibold text-surface-500">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentBookings.map((b) => (
                                    <tr key={b._id} className="border-b border-surface-50 hover:bg-surface-50">
                                        <td className="px-5 py-3 font-medium text-surface-800">{b.user?.name || 'N/A'}</td>
                                        <td className="px-5 py-3 text-surface-600">{b.roomNumber} ({b.roomType})</td>
                                        <td className="px-5 py-3 text-surface-600">{new Date(b.checkInDate).toLocaleDateString()}</td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                    b.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        b.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                            'bg-blue-100 text-blue-700'
                                                }`}>{b.status}</span>
                                        </td>
                                        <td className="px-5 py-3 font-semibold text-surface-800">${b.totalPrice}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
