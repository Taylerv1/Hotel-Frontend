import { useState, useEffect, useCallback } from 'react';
import { getBookings, createBooking, updateBooking, deleteBooking } from '../api/bookingsApi';
import { getUsers } from '../api/usersApi';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import toast, { Toaster } from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineSortAscending, HiOutlineSortDescending } from 'react-icons/hi';

const ROOM_TYPES = ['single', 'double', 'suite', 'deluxe'];
const STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];
const INITIAL_FORM = {
    user: '', roomNumber: '', roomType: 'single', checkInDate: '', checkOutDate: '', guests: 1, totalPrice: 0, status: 'pending', notes: '',
};

export default function BookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allUsers, setAllUsers] = useState([]);
    const [params, setParams] = useState({
        page: 1, limit: 10, sort: 'createdAt', order: 'desc',
        status: '', roomType: '', minPrice: '', maxPrice: '',
    });

    // Modal
    const [modalOpen, setModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const [form, setForm] = useState(INITIAL_FORM);
    const [saving, setSaving] = useState(false);

    // Delete
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Fetch users for dropdown
    useEffect(() => {
        getUsers({ limit: 100 }).then((res) => setAllUsers(res.data.users || [])).catch(() => { });
    }, []);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const query = { page: params.page, limit: params.limit, sort: params.sort, order: params.order };
            if (params.status) query.status = params.status;
            if (params.roomType) query.roomType = params.roomType;
            if (params.minPrice) query.minPrice = params.minPrice;
            if (params.maxPrice) query.maxPrice = params.maxPrice;
            const res = await getBookings(query);
            setBookings(res.data.bookings || []);
            setPagination(res.data.pagination || null);
        } catch (err) {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => { fetchBookings(); }, [fetchBookings]);

    const handleFilterChange = (key, value) => {
        setParams((p) => ({ ...p, [key]: value, page: 1 }));
    };

    const toggleSort = (field) => {
        setParams((p) => ({ ...p, sort: field, order: p.sort === field && p.order === 'asc' ? 'desc' : 'asc' }));
    };

    const SortIcon = params.order === 'asc' ? HiOutlineSortAscending : HiOutlineSortDescending;

    // Create
    const openCreate = () => {
        setEditingBooking(null);
        setForm(INITIAL_FORM);
        setModalOpen(true);
    };

    // Edit
    const openEdit = (b) => {
        setEditingBooking(b);
        setForm({
            user: b.user?._id || b.user || '',
            roomNumber: b.roomNumber,
            roomType: b.roomType,
            checkInDate: b.checkInDate ? b.checkInDate.substring(0, 10) : '',
            checkOutDate: b.checkOutDate ? b.checkOutDate.substring(0, 10) : '',
            guests: b.guests,
            totalPrice: b.totalPrice,
            status: b.status,
            notes: b.notes || '',
        });
        setModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = { ...form, guests: Number(form.guests), totalPrice: Number(form.totalPrice) };
            if (editingBooking) {
                await updateBooking(editingBooking._id, data);
                toast.success('Booking updated');
            } else {
                await createBooking(data);
                toast.success('Booking created');
            }
            setModalOpen(false);
            fetchBookings();
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.errors?.map(e => e.message).join(', ') || 'Operation failed';
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    // Delete
    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteBooking(deleteTarget._id);
            toast.success('Booking deleted');
            setDeleteTarget(null);
            fetchBookings();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Delete failed');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div>
            <Toaster position="top-right" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-surface-800">Bookings</h1>
                    <p className="text-surface-400 text-sm mt-1">Manage hotel room reservations</p>
                </div>
                <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors cursor-pointer">
                    <HiOutlinePlus className="w-4 h-4" /> New Booking
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-surface-200 p-4 mb-4">
                <div className="flex flex-wrap gap-3">
                    <select value={params.status} onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="px-3 py-2 text-sm rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer">
                        <option value="">All Statuses</option>
                        {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                    </select>
                    <select value={params.roomType} onChange={(e) => handleFilterChange('roomType', e.target.value)}
                        className="px-3 py-2 text-sm rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer">
                        <option value="">All Room Types</option>
                        {ROOM_TYPES.map((r) => <option key={r} value={r} className="capitalize">{r}</option>)}
                    </select>
                    <input type="number" placeholder="Min Price" value={params.minPrice} onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className="w-28 px-3 py-2 text-sm rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    <input type="number" placeholder="Max Price" value={params.maxPrice} onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className="w-28 px-3 py-2 text-sm rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-surface-200 overflow-hidden">
                {loading ? (
                    <LoadingSpinner />
                ) : bookings.length === 0 ? (
                    <EmptyState title="No bookings found" message="Try adjusting your filters or create a new booking." />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-surface-100 bg-surface-50 text-left">
                                    {[
                                        { key: 'user', label: 'Guest', sortable: false },
                                        { key: 'roomNumber', label: 'Room' },
                                        { key: 'roomType', label: 'Type' },
                                        { key: 'checkInDate', label: 'Check-in' },
                                        { key: 'checkOutDate', label: 'Check-out' },
                                        { key: 'guests', label: 'Guests' },
                                        { key: 'totalPrice', label: 'Price' },
                                        { key: 'status', label: 'Status' },
                                    ].map((col) => (
                                        <th key={col.key}
                                            onClick={col.sortable !== false ? () => toggleSort(col.key) : undefined}
                                            className={`px-4 py-3 font-semibold text-surface-500 select-none ${col.sortable !== false ? 'cursor-pointer hover:text-surface-800' : ''}`}>
                                            <span className="inline-flex items-center gap-1">
                                                {col.label}
                                                {params.sort === col.key && <SortIcon className="w-4 h-4 text-primary-500" />}
                                            </span>
                                        </th>
                                    ))}
                                    <th className="px-4 py-3 font-semibold text-surface-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((b) => (
                                    <tr key={b._id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div>
                                                <div className="font-medium text-surface-800">{b.user?.name || 'N/A'}</div>
                                                <div className="text-xs text-surface-400">{b.user?.email || ''}</div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-surface-800">{b.roomNumber}</td>
                                        <td className="px-4 py-3 capitalize text-surface-600">{b.roomType}</td>
                                        <td className="px-4 py-3 text-surface-600">{new Date(b.checkInDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 text-surface-600">{new Date(b.checkOutDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 text-center text-surface-600">{b.guests}</td>
                                        <td className="px-4 py-3 font-semibold text-surface-800">${b.totalPrice}</td>
                                        <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="inline-flex gap-1">
                                                <button onClick={() => openEdit(b)} className="rounded-lg p-1.5 text-surface-400 hover:bg-primary-50 hover:text-primary-600 cursor-pointer">
                                                    <HiOutlinePencil className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => setDeleteTarget(b)} className="rounded-lg p-1.5 text-surface-400 hover:bg-red-50 hover:text-red-600 cursor-pointer">
                                                    <HiOutlineTrash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <Pagination pagination={pagination} onPageChange={(p) => setParams((prev) => ({ ...prev, page: p }))} />
            </div>

            {/* Create/Edit Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingBooking ? 'Edit Booking' : 'New Booking'} size="lg">
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-surface-700 mb-1">Guest (User)</label>
                            <select value={form.user} onChange={(e) => setForm({ ...form, user: e.target.value })} required
                                className="w-full px-3 py-2 text-sm rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer">
                                <option value="">Select a guest...</option>
                                {allUsers.map((u) => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">Room Number</label>
                            <input type="text" value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} required
                                className="w-full px-3 py-2 text-sm rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">Room Type</label>
                            <select value={form.roomType} onChange={(e) => setForm({ ...form, roomType: e.target.value })} required
                                className="w-full px-3 py-2 text-sm rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer">
                                {ROOM_TYPES.map((r) => <option key={r} value={r} className="capitalize">{r}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">Check-in Date</label>
                            <input type="date" value={form.checkInDate} onChange={(e) => setForm({ ...form, checkInDate: e.target.value })} required
                                className="w-full px-3 py-2 text-sm rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">Check-out Date</label>
                            <input type="date" value={form.checkOutDate} onChange={(e) => setForm({ ...form, checkOutDate: e.target.value })} required
                                className="w-full px-3 py-2 text-sm rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">Guests</label>
                            <input type="number" min="1" value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} required
                                className="w-full px-3 py-2 text-sm rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">Total Price ($)</label>
                            <input type="number" min="0" step="0.01" value={form.totalPrice} onChange={(e) => setForm({ ...form, totalPrice: e.target.value })} required
                                className="w-full px-3 py-2 text-sm rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">Status</label>
                            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer">
                                {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-surface-700 mb-1">Notes</label>
                            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setModalOpen(false)}
                            className="flex-1 rounded-lg border border-surface-300 px-4 py-2.5 text-sm font-medium text-surface-600 hover:bg-surface-50 cursor-pointer">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving}
                            className="flex-1 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 cursor-pointer">
                            {saving ? 'Saving...' : editingBooking ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Dialog */}
            <ConfirmDialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Delete Booking"
                message={`Are you sure you want to delete the booking for room ${deleteTarget?.roomNumber}?`}
                loading={deleting}
            />
        </div>
    );
}
