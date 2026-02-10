import { useState, useEffect, useCallback } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../api/usersApi';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import toast, { Toaster } from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineSearch, HiOutlineSortAscending, HiOutlineSortDescending } from 'react-icons/hi';

const INITIAL_FORM = { name: '', email: '', password: '', phone: '', role: 'user' };

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [params, setParams] = useState({ page: 1, limit: 10, sort: 'createdAt', order: 'desc', name: '', email: '', role: '' });

    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form, setForm] = useState(INITIAL_FORM);
    const [saving, setSaving] = useState(false);

    // Delete states
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

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

    const SortIcon = params.order === 'asc' ? HiOutlineSortAscending : HiOutlineSortDescending;

    // Create / Edit
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

    // Delete
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

    return (
        <div>
            <Toaster position="top-right" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-surface-800">Users</h1>
                    <p className="text-surface-400 text-sm mt-1">Manage hotel clients and admins</p>
                </div>
                <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors cursor-pointer">
                    <HiOutlinePlus className="w-4 h-4" /> Add User
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-surface-200 p-4 mb-4">
                <div className="flex flex-wrap gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={params.name}
                            onChange={(e) => handleFilterChange('name', e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by email..."
                        value={params.email}
                        onChange={(e) => handleFilterChange('email', e.target.value)}
                        className="flex-1 min-w-[200px] px-3 py-2 text-sm rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <select
                        value={params.role}
                        onChange={(e) => handleFilterChange('role', e.target.value)}
                        className="px-3 py-2 text-sm rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                    >
                        <option value="">All Roles</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-surface-200 overflow-hidden">
                {loading ? (
                    <LoadingSpinner />
                ) : users.length === 0 ? (
                    <EmptyState title="No users found" message="Try adjusting your filters or add a new user." />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-surface-100 bg-surface-50 text-left">
                                    {[
                                        { key: 'name', label: 'Name' },
                                        { key: 'email', label: 'Email' },
                                        { key: 'phone', label: 'Phone' },
                                        { key: 'role', label: 'Role' },
                                        { key: 'createdAt', label: 'Created' },
                                    ].map((col) => (
                                        <th
                                            key={col.key}
                                            onClick={() => toggleSort(col.key)}
                                            className="px-5 py-3 font-semibold text-surface-500 cursor-pointer hover:text-surface-800 select-none"
                                        >
                                            <span className="inline-flex items-center gap-1">
                                                {col.label}
                                                {params.sort === col.key && <SortIcon className="w-4 h-4 text-primary-500" />}
                                            </span>
                                        </th>
                                    ))}
                                    <th className="px-5 py-3 font-semibold text-surface-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u._id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors">
                                        <td className="px-5 py-3 font-medium text-surface-800">{u.name}</td>
                                        <td className="px-5 py-3 text-surface-600">{u.email}</td>
                                        <td className="px-5 py-3 text-surface-600">{u.phone || '—'}</td>
                                        <td className="px-5 py-3"><StatusBadge status={u.role} /></td>
                                        <td className="px-5 py-3 text-surface-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td className="px-5 py-3 text-right">
                                            <div className="inline-flex gap-1">
                                                <button onClick={() => openEdit(u)} className="rounded-lg p-1.5 text-surface-400 hover:bg-primary-50 hover:text-primary-600 cursor-pointer">
                                                    <HiOutlinePencil className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => setDeleteTarget(u)} className="rounded-lg p-1.5 text-surface-400 hover:bg-red-50 hover:text-red-600 cursor-pointer">
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
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingUser ? 'Edit User' : 'Create User'}>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Name</label>
                        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required minLength={2}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Email</label>
                        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
                            className="w-full px-3 py-2 text-sm rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    {!editingUser && (
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">Password</label>
                            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Phone</label>
                        <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Role</label>
                        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer">
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setModalOpen(false)}
                            className="flex-1 rounded-lg border border-surface-300 px-4 py-2.5 text-sm font-medium text-surface-600 hover:bg-surface-50 cursor-pointer">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving}
                            className="flex-1 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 cursor-pointer">
                            {saving ? 'Saving...' : editingUser ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Dialog */}
            <ConfirmDialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Delete User"
                message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
                loading={deleting}
            />
        </div>
    );
}
