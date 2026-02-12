/**
 * BookingForm — Renders the create/edit booking form inside a modal.
 *
 * Responsibility:
 *   Displays all input fields for a booking (guest, room, dates, price, etc.)
 *   plus Cancel and Submit buttons. Does NOT handle the modal wrapper itself —
 *   that is handled by the parent page using the <Modal> component.
 *
 * Props:
 *   - form           → current form field values { user, roomNumber, roomType, ... }
 *   - setForm        → function to update the form state
 *   - handleSave     → form submit handler (creates or updates a booking)
 *   - saving         → true while the API call is in flight (disables submit button)
 *   - editingBooking → the booking being edited, or null if creating a new one
 *   - allUsers       → list of users for the "Guest" dropdown
 *   - ROOM_TYPES     → array of available room type options
 *   - STATUSES       → array of available status options
 *   - onCancel       → function to close the modal
 */
export default function BookingForm({ form, setForm, handleSave, saving, editingBooking, allUsers, ROOM_TYPES, STATUSES, onCancel }) {
    return (
        <form onSubmit={handleSave} className="modal-form">
            <div className="modal-form__grid">
                <div className="modal-form__field--full">
                    <label className="modal-form__label">Guest (User)</label>
                    <select value={form.user} onChange={(e) => setForm({ ...form, user: e.target.value })} required className="modal-form__select">
                        <option value="">Select a guest...</option>
                        {allUsers.map((u) => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                    </select>
                </div>
                <div>
                    <label className="modal-form__label">Room Number</label>
                    <input type="text" value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} required className="modal-form__input" />
                </div>
                <div>
                    <label className="modal-form__label">Room Type</label>
                    <select value={form.roomType} onChange={(e) => setForm({ ...form, roomType: e.target.value })} required className="modal-form__select">
                        {ROOM_TYPES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
                <div>
                    <label className="modal-form__label">Check-in Date</label>
                    <input type="date" value={form.checkInDate} onChange={(e) => setForm({ ...form, checkInDate: e.target.value })} required className="modal-form__input" />
                </div>
                <div>
                    <label className="modal-form__label">Check-out Date</label>
                    <input type="date" value={form.checkOutDate} onChange={(e) => setForm({ ...form, checkOutDate: e.target.value })} required className="modal-form__input" />
                </div>
                <div>
                    <label className="modal-form__label">Guests</label>
                    <input type="number" min="1" value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} required className="modal-form__input" />
                </div>
                <div>
                    <label className="modal-form__label">Total Price ($)</label>
                    <input type="number" min="0" step="0.01" value={form.totalPrice} onChange={(e) => setForm({ ...form, totalPrice: e.target.value })} required className="modal-form__input" />
                </div>
                <div>
                    <label className="modal-form__label">Status</label>
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="modal-form__select">
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="modal-form__field--full">
                    <label className="modal-form__label">Notes</label>
                    <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="modal-form__textarea" />
                </div>
            </div>
            <div className="modal-form__actions">
                <button type="button" onClick={onCancel} className="modal-form__cancel-btn">Cancel</button>
                <button type="submit" disabled={saving} className="modal-form__submit-btn">
                    {saving ? 'Saving...' : editingBooking ? 'Update' : 'Create'}
                </button>
            </div>
        </form>
    );
}
