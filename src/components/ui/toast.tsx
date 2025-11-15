'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
    id: number;
    type: ToastType;
    message: string;
    title?: string;
    duration: number;
}

interface ToastOptions {
    title?: string;
    duration?: number;
}

interface ToastContextType {
    toast: {
        success: (message: string, options?: ToastOptions) => number;
        error: (message: string, options?: ToastOptions) => number;
        warning: (message: string, options?: ToastOptions) => number;
        info: (message: string, options?: ToastOptions) => number;
    };
    removeToast: (id: number) => void;
}

interface ToastProviderProps {
    children: ReactNode;
}

interface ToastContainerProps {
    toasts: ToastItem[];
    removeToast: (id: number) => void;
}

interface ToastComponentProps {
    toast: ToastItem;
    onRemove: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const addToast = useCallback((toast: Partial<ToastItem> & { message: string }): number => {
        const id = Date.now() + Math.random();
        const newToast: ToastItem = {
            id,
            type: 'info',
            duration: 5000,
            ...toast,
        };

        setToasts((prev) => [...prev, newToast]);

        // Auto remove toast after duration
        setTimeout(() => {
            removeToast(id);
        }, newToast.duration);

        return id;
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const toast = {
        success: (message: string, options: ToastOptions = {}): number => addToast({ type: 'success', message, ...options }),
        error: (message: string, options: ToastOptions = {}): number => addToast({ type: 'error', message, ...options }),
        warning: (message: string, options: ToastOptions = {}): number => addToast({ type: 'warning', message, ...options }),
        info: (message: string, options: ToastOptions = {}): number => addToast({ type: 'info', message, ...options }),
    };

    return (
        <ToastContext.Provider value={{ toast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
            {toasts.map((toast) => (
                <Toast key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
            ))}
        </div>
    );
};

const Toast: React.FC<ToastComponentProps> = ({ toast, onRemove }) => {
    const getIcon = (type: ToastType): React.ReactElement => {
        const iconProps = { className: "h-5 w-5 shrink-0" };
        switch (type) {
            case 'success':
                return <CheckCircle {...iconProps} className="h-5 w-5 shrink-0 text-green-500" />;
            case 'error':
                return <AlertCircle {...iconProps} className="h-5 w-5 shrink-0 text-red-500" />;
            case 'warning':
                return <AlertTriangle {...iconProps} className="h-5 w-5 shrink-0 text-yellow-500" />;
            case 'info':
            default:
                return <Info {...iconProps} className="h-5 w-5 shrink-0 text-blue-500" />;
        }
    };

    const getToastStyles = (type: ToastType): string => {
        switch (type) {
            case 'success':
                return 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200';
            case 'error':
                return 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200';
            case 'warning':
                return 'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
            case 'info':
            default:
                return 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
        }
    };

    return (
        <div
            className={cn(
                "relative flex items-start gap-3 p-4 border rounded-lg shadow-lg animate-in slide-in-from-right-full duration-300",
                getToastStyles(toast.type)
            )}
        >
            {getIcon(toast.type)}
            <div className="flex-1 min-w-0">
                {toast.title != null && (
                    <p className="font-medium text-sm mb-1">{toast.title}</p>
                )}
                <p className="text-sm">{toast.message}</p>
            </div>
            <button
                onClick={onRemove}
                className="shrink-0 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};
