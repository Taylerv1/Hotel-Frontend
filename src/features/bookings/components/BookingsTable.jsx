import StatusBadge from '../../../components/StatusBadge';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import Pagination from '../../../components/Pagination';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineSortAscending, HiOutlineSortDescending } from 'react-icons/hi';

/**
 * BookingsTable — Renders the bookings data table with sortable headers.
 *
 * Responsibility:
 *   Displays a table of bookings with guest info, room details, dates,
 *   pricing, and status. Handles loading and empty states.
 *   Each row has edit and delete action buttons.
 *
 * Props:
 *   - bookings      → array of booking objects to display
 *   - loading       → whether data is currently being fetched
 *   - params        → current sort field and order (for highlighting active sort column)
 *   - toggleSort    → function(field) to toggle sort on a column
 *   - pagination    → pagination metadata object
 *   - setPage       → function(page) to navigate to a page
 *   - openEdit      → function(booking) to open the edit modal for a booking
 *   - setDeleteTarget → function(booking) to open the delete confirmation for a booking
 */
export default function BookingsTable({ bookings, loading, params, toggleSort, pagination, setPage, openEdit, setDeleteTarget }) {
    // Choose the correct sort icon based on current sort order
    const SortIcon = params.order === 'asc' ? HiOutlineSortAscending : HiOutlineSortDescending;

    // Column definitions for the table header
    const columns = [
        { key: 'user', label: 'Guest', sortable: false },
        { key: 'roomNumber', label: 'Room' },
        { key: 'roomType', label: 'Type' },
        { key: 'checkInDate', label: 'Check-in' },
        { key: 'checkOutDate', label: 'Check-out' },
        { key: 'guests', label: 'Guests' },
        { key: 'totalPrice', label: 'Price' },
        { key: 'status', label: 'Status' },
    ];

    return (
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
                                {columns.map((col) => (
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
    );
}
