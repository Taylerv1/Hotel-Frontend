import { useEffect } from 'react';
import { HiOutlineX } from 'react-icons/hi';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative w-full ${sizeClasses[size]} mx-4 bg-white rounded-2xl shadow-2xl animate-in`}>
                <div className="flex items-center justify-between border-b border-surface-200 px-6 py-4">
                    <h2 className="text-lg font-bold text-surface-800">{title}</h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 hover:text-surface-600 cursor-pointer"
                    >
                        <HiOutlineX className="w-5 h-5" />
                    </button>
                </div>
                <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">{children}</div>
            </div>
        </div>
    );
}
