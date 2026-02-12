import { useState, useEffect, useCallback } from 'react';
import { getBookings, createBooking, updateBooking, deleteBooking } from '../api/bookingsApi';
import { getUsers } from '../api/usersApi';
import toast from 'react-hot-toast';

// ─── Constants ──────────────────────────────────────────────
// Available room types and booking statuses used in filters and forms
const ROOM_TYPES = ['single', 'double', 'suite', 'deluxe'];
const STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

// Default form values when creating a new booking
const INITIAL_FORM = {
    user: '', roomNumber: '', roomType: 'single', checkInDate: '', checkOutDate: '', guests: 1, totalPrice: 0, status: 'pending', notes: '',
};

/**
 * useBookings — Custom hook that manages ALL bookings logic.
 *
 * What it controls:
 *   • Fetching bookings from the API (with pagination, filters, and sorting)
 *   • Creating, updating, and deleting bookings (CRUD operations)
 *   • Modal open/close state for the create/edit form
 *   • Delete confirmation dialog state
 *   • Loading a list of users for the "guest" dropdown
 *
 * Returns an object with every piece of state and every handler
 * that BookingsPage needs to render — the page itself stays purely visual.
 */
export default function useBookings() {
    // ── Data State ──────────────────────────────────────────
    // bookings       → array of booking objects returned from the API
    // pagination     → object with { currentPage, totalPages, totalItems, itemsPerPage }
    // loading        → true while the bookings list is being fetched
    // allUsers       → list of all users, used to populate the "Guest" dropdown in the form
    const [bookings, setBookings] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allUsers, setAllUsers] = useState([]);

    // ── Filter & Sort State ─────────────────────────────────
    // params → holds the current page, limit, sort field, sort order,
    //          and any active filters (status, roomType, price range).
    //          Changing any value here triggers a new API fetch.
    const [params, setParams] = useState({
        page: 1, limit: 10, sort: 'createdAt', order: 'desc',
        status: '', roomType: '', minPrice: '', maxPrice: '',
    });

    // ── Modal State (Create / Edit) ─────────────────────────
    // modalOpen       → controls whether the create/edit modal is visible
    // editingBooking  → if set, the modal is in "edit" mode for this booking; null = "create" mode
    // form            → the current values of every field in the booking form
    // saving          → true while the create/update API call is in flight
    const [modalOpen, setModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const [form, setForm] = useState(INITIAL_FORM);
    const [saving, setSaving] = useState(false);

    // ── Delete State ────────────────────────────────────────
    // deleteTarget → the booking object that the user wants to delete (shows confirm dialog)
    // deleting     → true while the delete API call is in flight
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // ── Fetch users for the "Guest" dropdown (runs once on mount) ──
    useEffect(() => {
        getUsers({ limit: 100 }).then((res) => setAllUsers(res.data.users || [])).catch(() => { });
    }, []);

    // ── Fetch bookings whenever params change ───────────────
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

    // ── Filter & Sort Handlers ──────────────────────────────
    // handleFilterChange → updates one filter key and resets to page 1
    const handleFilterChange = (key, value) => {
        setParams((p) => ({ ...p, [key]: value, page: 1 }));
    };

    // toggleSort → toggles the sort direction for a given column
    const toggleSort = (field) => {
        setParams((p) => ({ ...p, sort: field, order: p.sort === field && p.order === 'asc' ? 'desc' : 'asc' }));
    };

    // setPage → navigate to a specific page number (used by the Pagination component)
    const setPage = (page) => {
        setParams((p) => ({ ...p, page }));
    };

    // ── Create / Edit Handlers ──────────────────────────────
    // openCreate → opens the modal with an empty form for a new booking
    const openCreate = () => {
        setEditingBooking(null);
        setForm(INITIAL_FORM);
        setModalOpen(true);
    };

    // openEdit → opens the modal pre-filled with a booking's data
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

    // handleSave → submits the form — creates or updates depending on editingBooking
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

    // ── Delete Handler ──────────────────────────────────────
    // handleDelete → deletes the booking stored in deleteTarget
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

    // ── Return everything the page component needs ──────────
    return {
        // Constants
        ROOM_TYPES,
        STATUSES,
        // Data
        bookings,
        pagination,
        loading,
        allUsers,
        // Filter & Sort
        params,
        handleFilterChange,
        toggleSort,
        setPage,
        // Modal (Create / Edit)
        modalOpen,
        setModalOpen,
        editingBooking,
        form,
        setForm,
        saving,
        openCreate,
        openEdit,
        handleSave,
        // Delete
        deleteTarget,
        setDeleteTarget,
        deleting,
        handleDelete,
    };
}
