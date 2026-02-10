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
        { label: 'Total Users', value: stats?.totalUsers, icon: HiOutlineUsers, color: 'blue' },
        { label: 'Total Bookings', value: stats?.totalBookings, icon: HiOutlineCalendar, color: 'purple' },
        { label: 'Confirmed', value: stats?.confirmed, icon: HiOutlineCheckCircle, color: 'green' },
        { label: 'Pending', value: stats?.pending, icon: HiOutlineClock, color: 'yellow' },
    ];

    const getStatusClass = (status) => {
        if (status === 'confirmed') return 'recent-bookings__status--confirmed';
        if (status === 'pending') return 'recent-bookings__status--pending';
        if (status === 'cancelled') return 'recent-bookings__status--cancelled';
        return 'recent-bookings__status--default';
    };

    return (
        <div>
            <div className="dashboard-header">
                <h1 className="dashboard-header__title">Dashboard</h1>
                <p className="dashboard-header__subtitle">Overview of your hotel management system</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                {cards.map((c) => (
                    <div key={c.label} className="stat-card">
                        <div className="stat-card__header">
                            <span className="stat-card__label">{c.label}</span>
                            <div className={`stat-card__icon-wrapper stat-card__icon-wrapper--${c.color}`}>
                                <c.icon className={`stat-card__icon stat-card__icon--${c.color}`} />
                            </div>
                        </div>
                        <p className="stat-card__value">{c.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Bookings */}
            <div className="recent-bookings">
                <div className="recent-bookings__header">
                    <h2 className="recent-bookings__title">Recent Bookings</h2>
                </div>
                {recentBookings.length === 0 ? (
                    <div className="recent-bookings__empty">No bookings yet</div>
                ) : (
                    <div className="recent-bookings__table-wrapper">
                        <table className="recent-bookings__table">
                            <thead>
                                <tr>
                                    <th className="recent-bookings__th">Guest</th>
                                    <th className="recent-bookings__th">Room</th>
                                    <th className="recent-bookings__th">Check-in</th>
                                    <th className="recent-bookings__th">Status</th>
                                    <th className="recent-bookings__th">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentBookings.map((b) => (
                                    <tr key={b._id} className="recent-bookings__tr">
                                        <td className="recent-bookings__td recent-bookings__td--name">{b.user?.name || 'N/A'}</td>
                                        <td className="recent-bookings__td">{b.roomNumber} ({b.roomType})</td>
                                        <td className="recent-bookings__td">{new Date(b.checkInDate).toLocaleDateString()}</td>
                                        <td className="recent-bookings__td">
                                            <span className={`recent-bookings__status ${getStatusClass(b.status)}`}>{b.status}</span>
                                        </td>
                                        <td className="recent-bookings__td recent-bookings__td--price">${b.totalPrice}</td>
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
