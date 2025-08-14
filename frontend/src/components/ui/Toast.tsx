'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

// ===============================
// TYPES
// ===============================

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'cart';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string, action?: Toast['action']) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  cartAdded: (productName: string, action?: Toast['action']) => void;
}

// ===============================
// TOAST CONTEXT
// ===============================

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const newToast = { ...toast, id };

    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((title: string, message?: string, action?: Toast['action']) => {
    addToast({ type: 'success', title, message, action });
  }, [addToast]);

  const error = useCallback((title: string, message?: string) => {
    addToast({ type: 'error', title, message });
  }, [addToast]);

  const warning = useCallback((title: string, message?: string) => {
    addToast({ type: 'warning', title, message });
  }, [addToast]);

  const info = useCallback((title: string, message?: string) => {
    addToast({ type: 'info', title, message });
  }, [addToast]);

  const cartAdded = useCallback((productName: string, action?: Toast['action']) => {
    addToast({
      type: 'cart',
      title: 'Added to Cart',
      message: `${productName} has been added to your cart`,
      action: action || {
        label: 'View Cart',
        onClick: () => {
          // This would open the cart drawer
          // The implementation would depend on how you access the cart context
        }
      }
    });
  }, [addToast]);

  const contextValue: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    cartAdded
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// ===============================
// TOAST HOOK
// ===============================

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// ===============================
// TOAST CONTAINER
// ===============================

const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed z-50 space-y-2 top-4 right-4">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

// ===============================
// TOAST ITEM
// ===============================

interface ToastItemProps {
  toast: Toast;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast }) => {
  const { removeToast } = useToast();

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      case 'error':
        return <XCircleIcon className="w-6 h-6 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />;
      case 'info':
        return <InformationCircleIcon className="w-6 h-6 text-blue-500" />;
      case 'cart':
        return <ShoppingBagIcon className="w-6 h-6 text-rebbie-500" />;
      default:
        return <InformationCircleIcon className="w-6 h-6 text-neutral-500" />;
    }
  };

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      case 'cart':
        return 'bg-rebbie-50 border-rebbie-200';
      default:
        return 'bg-neutral-50 border-neutral-200';
    }
  };

  return (
    <div className={clsx(
      'max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 p-4 transition-all duration-300 transform',
      getToastStyles(toast.type)
    )}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {getToastIcon(toast.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-neutral-900">
            {toast.title}
          </h4>
          {toast.message && (
            <p className="mt-1 text-sm text-neutral-600">
              {toast.message}
            </p>
          )}
          
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="mt-2 text-sm font-medium underline text-rebbie-600 hover:text-rebbie-700"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        
        <button
          onClick={() => removeToast(toast.id)}
          className="flex-shrink-0 p-1 transition-colors rounded-lg hover:bg-neutral-100"
        >
          <XMarkIcon className="w-4 h-4 text-neutral-400" />
        </button>
      </div>
    </div>
  );
};
