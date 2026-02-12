/**
 * UserForm — Renders the create/edit user form inside a modal.
 *
 * Responsibility:
 *   Displays input fields for name, email, password (create only), phone,
 *   and role. Does NOT handle the modal wrapper — that is handled by
 *   the parent page using the <Modal> component.
 *
 * Props:
 *   - form        → current form field values { name, email, password, phone, role }
 *   - setForm     → function to update the form state
 *   - handleSave  → form submit handler (creates or updates a user)
 *   - saving      → true while the API call is in flight (disables submit button)
 *   - editingUser → the user being edited, or null if creating a new one
 *   - onCancel    → function to close the modal
 */
export default function UserForm({ form, setForm, handleSave, saving, editingUser, onCancel }) {
    return (
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
                <button type="button" onClick={onCancel} className="modal-form__cancel-btn">Cancel</button>
                <button type="submit" disabled={saving} className="modal-form__submit-btn">
                    {saving ? 'Saving...' : editingUser ? 'Update' : 'Create'}
                </button>
            </div>
        </form>
    );
}
