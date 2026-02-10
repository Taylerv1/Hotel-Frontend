const colorMap = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
    admin: 'bg-purple-100 text-purple-700',
    user: 'bg-surface-100 text-surface-600',
};

export default function StatusBadge({ status }) {
    const cls = colorMap[status] || 'bg-surface-100 text-surface-600';
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${cls}`}>
            {status}
        </span>
    );
}
