import { HiOutlineInbox } from 'react-icons/hi';

export default function EmptyState({ title, message, icon: Icon }) {
    const DisplayIcon = Icon || HiOutlineInbox;
    return (
        <div className="empty-state">
            <div className="empty-state__icon-wrapper">
                <DisplayIcon className="empty-state__icon" />
            </div>
            <h3 className="empty-state__title">{title || 'No data found'}</h3>
            <p className="empty-state__message">{message || 'Try adjusting your filters or create a new one.'}</p>
        </div>
    );
}
