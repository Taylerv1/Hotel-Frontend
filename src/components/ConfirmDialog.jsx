import { HiOutlineExclamation } from 'react-icons/hi';
import Modal from './Modal';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, loading }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title || 'Confirm Action'} size="sm">
            <div className="flex flex-col items-center text-center py-2">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mb-4">
                    <HiOutlineExclamation className="w-7 h-7 text-red-600" />
                </div>
                <p className="text-surface-600 mb-6">{message || 'Are you sure you want to proceed?'}</p>
                <div className="flex gap-3 w-full">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 rounded-lg border border-surface-300 px-4 py-2.5 text-sm font-medium text-surface-600 hover:bg-surface-50 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
