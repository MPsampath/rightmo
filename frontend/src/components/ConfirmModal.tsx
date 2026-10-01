import React from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean; // Changes the confirm button to red if true
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = false,
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl animate-fade-in-up shadow-xl dark:bg-zinc-900">
                <h3 className="mb-2 text-lg font-bold text-zinc-900 dark:text-zinc-50">{title}</h3>
                <p className="mb-6 text-sm text-zinc-700 dark:text-zinc-300">{message}</p>
                
                <div className="flex justify-end space-x-3">
                    <button 
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        {cancelText}
                    </button>
                    <button 
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm font-medium text-white transition-colors rounded-md ${
                            isDestructive 
                                ? 'bg-red-600 hover:bg-red-700' 
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}