import { HiOutlineExclamation } from 'react-icons/hi';
import Modal from './Modal';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, loading }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title || 'Confirm Action'} size="sm">
            <div className="confirm-dialog">
                <div className="confirm-dialog__icon-wrapper">
                    <HiOutlineExclamation className="confirm-dialog__icon" />
                </div>
                <p className="confirm-dialog__message">{message || 'Are you sure you want to proceed?'}</p>
                <div className="confirm-dialog__actions">
                    <button onClick={onClose} disabled={loading} className="confirm-dialog__cancel-btn">
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={loading} className="confirm-dialog__delete-btn">
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
