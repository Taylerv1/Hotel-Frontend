import { HiOutlineSearch } from 'react-icons/hi';

/**
 * UserFilters — Renders the filter bar for the users list.
 *
 * Responsibility:
 *   Displays a search-by-name input (with icon), a search-by-email input,
 *   and a role dropdown. When any filter changes, it calls handleFilterChange
 *   (passed via props) which updates query params and triggers a new API fetch.
 *
 * Props:
 *   - params           → current filter values (name, email, role)
 *   - handleFilterChange → function(key, value) to update a single filter
 */
export default function UserFilters({ params, handleFilterChange }) {
    return (
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
    );
}
