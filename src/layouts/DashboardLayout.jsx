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
        <div className="flex h-screen overflow-hidden bg-surface-50">
            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-surface-900 transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex h-16 items-center gap-3 px-6 border-b border-surface-700">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-600 text-white font-bold text-lg">
                        H
                    </div>
                    <span className="text-lg font-bold text-white tracking-tight">HotelAdmin</span>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                                    : 'text-surface-300 hover:bg-surface-800 hover:text-white'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-3 border-t border-surface-700">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-surface-300 hover:bg-red-600/20 hover:text-red-400 transition-colors cursor-pointer"
                    >
                        <HiOutlineLogout className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="flex h-16 items-center justify-between border-b border-surface-200 bg-white px-4 lg:px-6">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="rounded-lg p-2 text-surface-500 hover:bg-surface-100 lg:hidden cursor-pointer"
                    >
                        <HiOutlineMenu className="w-5 h-5" />
                    </button>

                    <div className="hidden lg:block" />

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-surface-800">{user?.name || 'Admin'}</p>
                            <p className="text-xs text-surface-400">{user?.role || 'user'}</p>
                        </div>
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-100 text-primary-700">
                            <HiOutlineUser className="w-5 h-5" />
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-auto p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
