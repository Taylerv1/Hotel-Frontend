import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

export default function Pagination({ pagination, onPageChange }) {
    if (!pagination || pagination.totalPages <= 1) return null;

    const { currentPage, totalPages, totalItems, itemsPerPage } = pagination;
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex items-center justify-between border-t border-surface-200 bg-white px-4 py-3 sm:px-6">
            <div className="text-sm text-surface-500">
                Showing <span className="font-medium text-surface-800">{start}</span> to{' '}
                <span className="font-medium text-surface-800">{end}</span> of{' '}
                <span className="font-medium text-surface-800">{totalItems}</span> results
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="inline-flex items-center gap-1 rounded-lg border border-surface-300 px-3 py-1.5 text-sm font-medium text-surface-600 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                    <HiOutlineChevronLeft className="w-4 h-4" /> Prev
                </button>

                <span className="inline-flex items-center justify-center min-w-[2rem] rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-semibold text-white">
                    {currentPage}
                </span>
                <span className="text-sm text-surface-400">of {totalPages}</span>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="inline-flex items-center gap-1 rounded-lg border border-surface-300 px-3 py-1.5 text-sm font-medium text-surface-600 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                    Next <HiOutlineChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
