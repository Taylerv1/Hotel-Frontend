import { useState, useEffect, useCallback } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../../../api/usersApi';
import toast from 'react-hot-toast';

// Default form values when creating a new user
const INITIAL_FORM = { name: '', email: '', password: '', phone: '', role: 'user' };

/**
 * useUsers — Custom hook that manages ALL users logic.
 *
 * What it controls:
 *   • Fetching users from the API (with pagination, filters, and sorting)
 *   • Creating, updating, and deleting users (CRUD operations)
 *   • Modal open/close state for the create/edit form
 *   • Delete confirmation dialog state
 *
 * Returns an object with every piece of state and every handler
 * that UsersPage needs to render — the page itself stays purely visual.
 */
export default function useUsers() {
    // ── Data State ──────────────────────────────────────────
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);

    // ── Filter & Sort State ─────────────────────────────────
    const [params, setParams] = useState({ page: 1, limit: 10, sort: 'createdAt', order: 'desc', name: '', email: '', role: '' });

    // ── Modal State (Create / Edit) ─────────────────────────
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form, setForm] = useState(INITIAL_FORM);
    const [saving, setSaving] = useState(false);

    // ── Delete State ────────────────────────────────────────
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // ── Fetch users whenever params change ──────────────────
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const query = { page: params.page, limit: params.limit, sort: params.sort, order: params.order };
            if (params.name) query.name = params.name;
            if (params.email) query.email = params.email;
            if (params.role) query.role = params.role;
            const res = await getUsers(query);
            setUsers(res.data.users || []);
            setPagination(res.data.pagination || null);
        } catch (err) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleFilterChange = (key, value) => {
        setParams((p) => ({ ...p, [key]: value, page: 1 }));
    };

    const toggleSort = (field) => {
        setParams((p) => ({
            ...p,
            sort: field,
            order: p.sort === field && p.order === 'asc' ? 'desc' : 'asc',
        }));
    };

    const setPage = (page) => {
        setParams((p) => ({ ...p, page }));
    };

    const openCreate = () => {
        setEditingUser(null);
        setForm(INITIAL_FORM);
        setModalOpen(true);
    };

    const openEdit = (user) => {
        setEditingUser(user);
        setForm({ name: user.name, email: user.email, password: '', phone: user.phone || '', role: user.role });
        setModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingUser) {
                const data = { name: form.name, email: form.email, phone: form.phone, role: form.role };
                await updateUser(editingUser._id, data);
                toast.success('User updated');
            } else {
                await createUser(form);
                toast.success('User created');
            }
            setModalOpen(false);
            fetchUsers();
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.errors?.map(e => e.message).join(', ') || 'Operation failed';
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteUser(deleteTarget._id);
            toast.success('User deleted');
            setDeleteTarget(null);
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Delete failed');
        } finally {
            setDeleting(false);
        }
    };

    return {
        users, pagination, loading,
        params, handleFilterChange, toggleSort, setPage,
        modalOpen, setModalOpen, editingUser, form, setForm, saving,
        openCreate, openEdit, handleSave,
        deleteTarget, setDeleteTarget, deleting, handleDelete,
    };
}
