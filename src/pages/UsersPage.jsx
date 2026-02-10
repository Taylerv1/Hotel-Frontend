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
            <div className="page-header">
                <div>
                    <h1 className="page-title">Users</h1>
                    <p className="page-subtitle">Manage hotel clients and admins</p>
                </div>
                <button onClick={openCreate} className="btn-primary">
                    <HiOutlinePlus className="btn-primary__icon" /> Add User
                </button>
            </div>

            {/* Filters */}
            <div className="filter-bar">
                <div className="filter-bar__row">
                    <div className="filter-search">
                        <HiOutlineSearch className="filter-search__icon" />
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={params.name}
                            onChange={(e) => handleFilterChange('name', e.target.value)}
                            className="filter-search__input"
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by email..."
                        value={params.email}
                        onChange={(e) => handleFilterChange('email', e.target.value)}
                        className="filter-email-input"
                    />
                    <select
                        value={params.role}
                        onChange={(e) => handleFilterChange('role', e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Roles</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="table-card">
                {loading ? (
                    <LoadingSpinner />
                ) : users.length === 0 ? (
                    <EmptyState title="No users found" message="Try adjusting your filters or add a new user." />
                ) : (
                    <div className="table-card__scroll">
                        <table className="data-table">
                            <thead>
                                <tr>
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
                                            className="data-table__th data-table__th--sortable"
                                        >
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
                                {users.map((u) => (
                                    <tr key={u._id}>
                                        <td className="data-table__td data-table__td--name">{u.name}</td>
                                        <td className="data-table__td">{u.email}</td>
                                        <td className="data-table__td">{u.phone || '—'}</td>
                                        <td className="data-table__td"><StatusBadge status={u.role} /></td>
                                        <td className="data-table__td">{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td className="data-table__td data-table__td--right">
                                            <div className="actions-cell">
                                                <button onClick={() => openEdit(u)} className="action-btn action-btn--edit">
                                                    <HiOutlinePencil className="action-btn__icon" />
                                                </button>
                                                <button onClick={() => setDeleteTarget(u)} className="action-btn action-btn--delete">
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

                <Pagination pagination={pagination} onPageChange={(p) => setParams((prev) => ({ ...prev, page: p }))} />
            </div>

            {/* Create/Edit Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingUser ? 'Edit User' : 'Create User'}>
                <form onSubmit={handleSave} className="modal-form">
                    <div>
                        <label className="modal-form__label">Name</label>
                        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required minLength={2} className="modal-form__input" />
                    </div>
                    <div>
                        <label className="modal-form__label">Email</label>
                        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="modal-form__input" />
                    </div>
                    {!editingUser && (
                        <div>
                            <label className="modal-form__label">Password</label>
                            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} className="modal-form__input" />
                        </div>
                    )}
                    <div>
                        <label className="modal-form__label">Phone</label>
                        <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="modal-form__input" />
                    </div>
                    <div>
                        <label className="modal-form__label">Role</label>
                        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="modal-form__select">
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="modal-form__actions">
                        <button type="button" onClick={() => setModalOpen(false)} className="modal-form__cancel-btn">Cancel</button>
                        <button type="submit" disabled={saving} className="modal-form__submit-btn">
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
