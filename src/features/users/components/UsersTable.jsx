import StatusBadge from '../../../components/StatusBadge';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import Pagination from '../../../components/Pagination';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineSortAscending, HiOutlineSortDescending } from 'react-icons/hi';

/**
 * UsersTable — Renders the users data table with sortable headers.
 *
 * Responsibility:
 *   Displays a table of users with name, email, phone, role, and created date.
 *   Handles loading and empty states. Each row has edit and delete action buttons.
 *
 * Props:
 *   - users          → array of user objects to display
 *   - loading        → whether data is currently being fetched
 *   - params         → current sort field and order
 *   - toggleSort     → function(field) to toggle sort on a column
 *   - pagination     → pagination metadata object
 *   - setPage        → function(page) to navigate to a page
 *   - openEdit       → function(user) to open the edit modal for a user
 *   - setDeleteTarget → function(user) to open the delete confirmation for a user
 */
export default function UsersTable({ users, loading, params, toggleSort, pagination, setPage, openEdit, setDeleteTarget }) {
    const SortIcon = params.order === 'asc' ? HiOutlineSortAscending : HiOutlineSortDescending;

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'role', label: 'Role' },
        { key: 'createdAt', label: 'Created' },
    ];

    return (
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
                                {columns.map((col) => (
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

            <Pagination pagination={pagination} onPageChange={setPage} />
        </div>
    );
}
