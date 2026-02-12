import useBookings from './hooks/useBookings';
import BookingFilters from './components/BookingFilters';
import BookingsTable from './components/BookingsTable';
import BookingForm from './components/BookingForm';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Toaster } from 'react-hot-toast';
import { HiOutlinePlus } from 'react-icons/hi';

/**
 * BookingsPage — The main bookings page.
 *
 * This is a thin "orchestrator" component. It:
 *   1. Calls the useBookings() hook to get all state and handlers.
 *   2. Passes the relevant data as props to each sub-component.
 *   3. Does NOT contain any business logic or large JSX blocks itself.
 *
 * Sub-components:
 *   - BookingFilters → filter bar (status, room type, price range)
 *   - BookingsTable  → data table with sorting, pagination, and row actions
 *   - BookingForm    → create/edit form rendered inside a Modal
 *   - ConfirmDialog  → delete confirmation dialog (shared component)
 */
export default function BookingsPage() {
    const {
        ROOM_TYPES, STATUSES,
        bookings, pagination, loading, allUsers, params,
        handleFilterChange, toggleSort, setPage,
        modalOpen, setModalOpen, editingBooking, form, setForm, saving,
        openCreate, openEdit, handleSave,
        deleteTarget, setDeleteTarget, deleting, handleDelete,
    } = useBookings();

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
            <BookingFilters
                params={params}
                handleFilterChange={handleFilterChange}
                STATUSES={STATUSES}
                ROOM_TYPES={ROOM_TYPES}
            />

            {/* Table */}
            <BookingsTable
                bookings={bookings}
                loading={loading}
                params={params}
                toggleSort={toggleSort}
                pagination={pagination}
                setPage={setPage}
                openEdit={openEdit}
                setDeleteTarget={setDeleteTarget}
            />

            {/* Create/Edit Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingBooking ? 'Edit Booking' : 'New Booking'} size="lg">
                <BookingForm
                    form={form}
                    setForm={setForm}
                    handleSave={handleSave}
                    saving={saving}
                    editingBooking={editingBooking}
                    allUsers={allUsers}
                    ROOM_TYPES={ROOM_TYPES}
                    STATUSES={STATUSES}
                    onCancel={() => setModalOpen(false)}
                />
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
