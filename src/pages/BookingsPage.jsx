import useBookings from '../hooks/useBookings';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { Toaster } from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineSortAscending, HiOutlineSortDescending } from 'react-icons/hi';

export default function BookingsPage() {
    // All logic is handled by the useBookings hook — this component is purely visual
    const {
        ROOM_TYPES,
        STATUSES,
        bookings,
        pagination,
        loading,
        allUsers,
        params,
        handleFilterChange,
        toggleSort,
        setPage,
        modalOpen,
        setModalOpen,
        editingBooking,
        form,
        setForm,
        saving,
        openCreate,
        openEdit,
        handleSave,
        deleteTarget,
        setDeleteTarget,
        deleting,
        handleDelete,
    } = useBookings();

    const SortIcon = params.order === 'asc' ? HiOutlineSortAscending : HiOutlineSortDescending;

    return (
        <div>
            <Toaster position="top-right" />

            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Bookings</h1>
                    <p className="page-subtitle">Manage hotel room reservations</p>
                </div>
                <button onClick={openCreate} className="btn-primary">
                    <HiOutlinePlus className="btn-primary__icon" /> New Booking
                </button>
            </div>

            {/* Filters */}
            <div className="filter-bar">
                <div className="filter-bar__row">
                    <select value={params.status} onChange={(e) => handleFilterChange('status', e.target.value)} className="filter-select">
                        <option value="">All Statuses</option>
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select value={params.roomType} onChange={(e) => handleFilterChange('roomType', e.target.value)} className="filter-select">
                        <option value="">All Room Types</option>
                        {ROOM_TYPES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <input type="number" placeholder="Min Price" value={params.minPrice} onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className="filter-input filter-input--price" />
                    <input type="number" placeholder="Max Price" value={params.maxPrice} onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className="filter-input filter-input--price" />
                </div>
            </div>

            {/* Table */}
            <div className="table-card">
                {loading ? (
                    <LoadingSpinner />
                ) : bookings.length === 0 ? (
                    <EmptyState title="No bookings found" message="Try adjusting your filters or create a new booking." />
                ) : (
                    <div className="table-card__scroll">
                        <table className="data-table">
                            <thead>
                                <tr>
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
                                            className={`data-table__th ${col.sortable !== false ? 'data-table__th--sortable' : ''}`}>
                                            <span className="data-table__th-content">
                                                {col.label}
                                                {params.sort === col.key && <SortIcon className="data-table__sort-icon" />}
                                            </span>
                                        </th>
                                    ))}
                                    <th className="data-table__th data-table__th--right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((b) => (
                                    <tr key={b._id}>
                                        <td className="data-table__td">
                                            <div>
                                                <div className="data-table__td--name">{b.user?.name || 'N/A'}</div>
                                                <div className="data-table__td--email">{b.user?.email || ''}</div>
                                            </div>
                                        </td>
                                        <td className="data-table__td data-table__td--bold">{b.roomNumber}</td>
                                        <td className="data-table__td data-table__td--capitalize">{b.roomType}</td>
                                        <td className="data-table__td">{new Date(b.checkInDate).toLocaleDateString()}</td>
                                        <td className="data-table__td">{new Date(b.checkOutDate).toLocaleDateString()}</td>
                                        <td className="data-table__td data-table__td--center">{b.guests}</td>
                                        <td className="data-table__td data-table__td--bold">${b.totalPrice}</td>
                                        <td className="data-table__td"><StatusBadge status={b.status} /></td>
                                        <td className="data-table__td data-table__td--right">
                                            <div className="actions-cell">
                                                <button onClick={() => openEdit(b)} className="action-btn action-btn--edit">
                                                    <HiOutlinePencil className="action-btn__icon" />
                                                </button>
                                                <button onClick={() => setDeleteTarget(b)} className="action-btn action-btn--delete">
                                                    <HiOutlineTrash className="action-btn__icon" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <Pagination pagination={pagination} onPageChange={setPage} />
            </div>

            {/* Create/Edit Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingBooking ? 'Edit Booking' : 'New Booking'} size="lg">
                <form onSubmit={handleSave} className="modal-form">
                    <div className="modal-form__grid">
                        <div className="modal-form__field--full">
                            <label className="modal-form__label">Guest (User)</label>
                            <select value={form.user} onChange={(e) => setForm({ ...form, user: e.target.value })} required className="modal-form__select">
                                <option value="">Select a guest...</option>
                                {allUsers.map((u) => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="modal-form__label">Room Number</label>
                            <input type="text" value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} required className="modal-form__input" />
                        </div>
                        <div>
                            <label className="modal-form__label">Room Type</label>
                            <select value={form.roomType} onChange={(e) => setForm({ ...form, roomType: e.target.value })} required className="modal-form__select">
                                {ROOM_TYPES.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="modal-form__label">Check-in Date</label>
                            <input type="date" value={form.checkInDate} onChange={(e) => setForm({ ...form, checkInDate: e.target.value })} required className="modal-form__input" />
                        </div>
                        <div>
                            <label className="modal-form__label">Check-out Date</label>
                            <input type="date" value={form.checkOutDate} onChange={(e) => setForm({ ...form, checkOutDate: e.target.value })} required className="modal-form__input" />
                        </div>
                        <div>
                            <label className="modal-form__label">Guests</label>
                            <input type="number" min="1" value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} required className="modal-form__input" />
                        </div>
                        <div>
                            <label className="modal-form__label">Total Price ($)</label>
                            <input type="number" min="0" step="0.01" value={form.totalPrice} onChange={(e) => setForm({ ...form, totalPrice: e.target.value })} required className="modal-form__input" />
                        </div>
                        <div>
                            <label className="modal-form__label">Status</label>
                            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="modal-form__select">
                                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="modal-form__field--full">
                            <label className="modal-form__label">Notes</label>
                            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="modal-form__textarea" />
                        </div>
                    </div>
                    <div className="modal-form__actions">
                        <button type="button" onClick={() => setModalOpen(false)} className="modal-form__cancel-btn">Cancel</button>
                        <button type="submit" disabled={saving} className="modal-form__submit-btn">
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
