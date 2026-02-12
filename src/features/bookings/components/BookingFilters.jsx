/**
 * BookingFilters — Renders the filter bar for the bookings list.
 *
 * Responsibility:
 *   Displays dropdown selects for status and room type,
 *   plus min/max price inputs. When any filter changes,
 *   it calls handleFilterChange (passed from the parent via props)
 *   which updates the query params and triggers a new API fetch.
 *
 * Props:
 *   - params           → current filter/sort values (status, roomType, minPrice, maxPrice)
 *   - handleFilterChange → function(key, value) to update a single filter
 *   - STATUSES          → array of available status options
 *   - ROOM_TYPES        → array of available room type options
 */
export default function BookingFilters({ params, handleFilterChange, STATUSES, ROOM_TYPES }) {
    return (
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
    );
}
