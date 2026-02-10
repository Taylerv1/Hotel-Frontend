import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HiOutlineViewGrid,
    HiOutlineUsers,
    HiOutlineCalendar,
    HiOutlineLogout,
    HiOutlineMenu,
    HiOutlineX,
    HiOutlineUser,
} from 'react-icons/hi';

const navItems = [
    { to: '/dashboard', icon: HiOutlineViewGrid, label: 'Dashboard', end: true },
    { to: '/dashboard/users', icon: HiOutlineUsers, label: 'Users' },
    { to: '/dashboard/bookings', icon: HiOutlineCalendar, label: 'Bookings' },
];

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="layout">
            {/* Overlay */}
            {sidebarOpen && (
                <div className="layout__overlay" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
                <div className="sidebar__brand">
                    <div className="sidebar__logo">H</div>
                    <span className="sidebar__title">HotelAdmin</span>
                </div>

                <nav className="sidebar__nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                            }
                        >
                            <item.icon className="sidebar__link-icon" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar__footer">
                    <button onClick={handleLogout} className="sidebar__logout-btn">
                        <HiOutlineLogout className="sidebar__logout-icon" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="layout__main">
                {/* Top Bar */}
                <header className="topbar">
                    <button onClick={() => setSidebarOpen(true)} className="topbar__menu-btn">
                        <HiOutlineMenu className="topbar__menu-icon" />
                    </button>

                    <div className="topbar__spacer" />

                    <div className="topbar__user">
                        <div className="topbar__user-info">
                            <p className="topbar__user-name">{user?.name || 'Admin'}</p>
                            <p className="topbar__user-role">{user?.role || 'user'}</p>
                        </div>
                        <div className="topbar__avatar">
                            <HiOutlineUser className="topbar__avatar-icon" />
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="layout__content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
