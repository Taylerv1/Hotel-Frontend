import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

export default function Pagination({ pagination, onPageChange }) {
    if (!pagination || pagination.totalPages <= 1) return null;

    const { currentPage, totalPages, totalItems, itemsPerPage } = pagination;
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="pagination">
            <div className="pagination__info">
                Showing <span className="pagination__info-highlight">{start}</span> to{' '}
                <span className="pagination__info-highlight">{end}</span> of{' '}
                <span className="pagination__info-highlight">{totalItems}</span> results
            </div>

            <div className="pagination__controls">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="pagination__btn"
                >
                    <HiOutlineChevronLeft className="pagination__btn-icon" /> Prev
                </button>

                <span className="pagination__current">{currentPage}</span>
                <span className="pagination__total">of {totalPages}</span>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="pagination__btn"
                >
                    Next <HiOutlineChevronRight className="pagination__btn-icon" />
                </button>
            </div>
        </div>
    );
}
