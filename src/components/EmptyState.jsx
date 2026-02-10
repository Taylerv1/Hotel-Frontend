import { HiOutlineInbox } from 'react-icons/hi';

export default function EmptyState({ title, message, icon: Icon }) {
    const DisplayIcon = Icon || HiOutlineInbox;
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-surface-100 mb-4">
                <DisplayIcon className="w-8 h-8 text-surface-400" />
            </div>
            <h3 className="text-lg font-semibold text-surface-700 mb-1">{title || 'No data found'}</h3>
            <p className="text-sm text-surface-400">{message || 'Try adjusting your filters or create a new one.'}</p>
        </div>
    );
}
