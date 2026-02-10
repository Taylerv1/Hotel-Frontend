export default function LoadingSpinner({ size = 'md' }) {
    return (
        <div className="loading-spinner">
            <div className={`loading-spinner__circle loading-spinner__circle--${size}`} />
        </div>
    );
}
