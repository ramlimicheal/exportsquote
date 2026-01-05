import React, { useState, useEffect } from 'react';

export interface ToastMessage {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
}

interface ToastProps {
    toasts: ToastMessage[];
    onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toasts, onRemove }) => {
    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
};

const ToastItem: React.FC<{ toast: ToastMessage; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onRemove(toast.id);
        }, toast.duration || 3000);
        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, onRemove]);

    const icons: Record<string, string> = {
        success: 'check_circle',
        error: 'error',
        warning: 'warning',
        info: 'info'
    };

    const colors: Record<string, string> = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };

    return (
        <div
            className={`${colors[toast.type]} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[280px] max-w-[400px] animate-in slide-in-from-right-5`}
            role="alert"
        >
            <span className="material-icons-outlined">{icons[toast.type]}</span>
            <div className="flex-1">
                <p className="font-semibold text-sm">{toast.title}</p>
                {toast.message && <p className="text-xs opacity-90">{toast.message}</p>}
            </div>
            <button
                onClick={() => onRemove(toast.id)}
                className="opacity-70 hover:opacity-100"
                aria-label="Close notification"
            >
                <span className="material-icons-outlined text-sm">close</span>
            </button>
        </div>
    );
};

export default Toast;
