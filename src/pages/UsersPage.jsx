import useUsers from '../hooks/useUsers';
import UserFilters from '../components/UserFilters';
import UsersTable from '../components/UsersTable';
import UserForm from '../components/UserForm';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { Toaster } from 'react-hot-toast';
import { HiOutlinePlus } from 'react-icons/hi';

/**
 * UsersPage — The main users page.
 *
 * This is now a thin "orchestrator" component. It:
 *   1. Calls the useUsers() hook to get all state and handlers.
 *   2. Passes the relevant data as props to each sub-component.
 *   3. Does NOT contain any business logic or large JSX blocks itself.
 *
 * Sub-components:
 *   - UserFilters  → filter bar (name search, email search, role dropdown)
 *   - UsersTable   → data table with sorting, pagination, and row actions
 *   - UserForm     → create/edit form rendered inside a Modal
 *   - ConfirmDialog → delete confirmation dialog
 */
export default function UsersPage() {
    const {
        users, pagination, loading, params,
        handleFilterChange, toggleSort, setPage,
        modalOpen, setModalOpen, editingUser, form, setForm, saving,
        openCreate, openEdit, handleSave,
        deleteTarget, setDeleteTarget, deleting, handleDelete,
    } = useUsers();

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
            <UserFilters
                params={params}
                handleFilterChange={handleFilterChange}
            />

            {/* Table */}
            <UsersTable
                users={users}
                loading={loading}
                params={params}
                toggleSort={toggleSort}
                pagination={pagination}
                setPage={setPage}
                openEdit={openEdit}
                setDeleteTarget={setDeleteTarget}
            />

            {/* Create/Edit Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingUser ? 'Edit User' : 'Create User'}>
                <UserForm
                    form={form}
                    setForm={setForm}
                    handleSave={handleSave}
                    saving={saving}
                    editingUser={editingUser}
                    onCancel={() => setModalOpen(false)}
                />
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
