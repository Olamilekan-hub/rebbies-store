/**
 * Toast Notification System for Rebbie's Store
 * Shows success, error, warning, and info messages
 */

'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// ===============================
// TOAST TYPES
// ===============================

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
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
  clearToasts: () => void;
}

// ===============================
// TOAST CONTEXT
// ===============================

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// ===============================
// TOAST PROVIDER
// ===============================

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 5000,
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearToasts = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
    </ToastContext.Provider>
  );
};

// ===============================
// INDIVIDUAL TOAST COMPONENT
// ===============================

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'error':
        return <ExclamationCircleIcon className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTextColor = () => {
    switch (toast.type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isRemoving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${getBackgroundColor()}
        border rounded-lg shadow-lg p-4 mb-3 max-w-sm w-full
      `}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${getTextColor()}`}>
            {toast.message}
          </p>
          
          {toast.description && (
            <p className={`text-sm mt-1 ${getTextColor()} opacity-75`}>
              {toast.description}
            </p>
          )}

          {toast.action && (
            <div className="mt-2">
              <button
                onClick={toast.action.onClick}
                className={`text-sm font-medium underline hover:no-underline ${getTextColor()}`}
              >
                {toast.action.label}
              </button>
            </div>
          )}
        </div>
        
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={handleRemove}
            className={`rounded-md inline-flex ${getTextColor()} hover:opacity-75 focus:outline-none`}
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ===============================
// TOAST CONTAINER
// ===============================

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    // Listen for toast events from anywhere in the app
    const handleToastEvent = (event: CustomEvent) => {
      const { type, message, description, duration, action } = event.detail;
      
      const id = Math.random().toString(36).substr(2, 9);
      const newToast: Toast = {
        id,
        type: type || 'info',
        message,
        description,
        duration: duration || 5000,
        action,
      };

      setToasts(prev => [...prev, newToast]);

      // Auto remove after duration
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    };

    const removeToast = (id: string) => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    // Add event listeners
    window.addEventListener('showToast', handleToastEvent as EventListener);

    return () => {
      window.removeEventListener('showToast', handleToastEvent as EventListener);
    };
  }, []);

  const handleRemoveToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={handleRemoveToast}
        />
      ))}
    </div>
  );
};

// ===============================
// TOAST UTILITIES
// ===============================

/**
 * Show a toast notification from anywhere in the app
 */
export const showToast = (toast: {
  type?: ToastType;
  message: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}) => {
  const event = new CustomEvent('showToast', {
    detail: toast,
  });
  window.dispatchEvent(event);
};

/**
 * Convenience functions for different toast types
 */
export const toast = {
  success: (message: string, description?: string) => {
    showToast({ type: 'success', message, description });
  },
  
  error: (message: string, description?: string) => {
    showToast({ type: 'error', message, description });
  },
  
  warning: (message: string, description?: string) => {
    showToast({ type: 'warning', message, description });
  },
  
  info: (message: string, description?: string) => {
    showToast({ type: 'info', message, description });
  },

  // Nigerian-specific convenience methods
  cartAdded: (productName: string) => {
    showToast({
      type: 'success',
      message: 'Added to Cart!',
      description: `${productName} has been added to your cart`,
      action: {
        label: 'View Cart',
        onClick: () => window.location.href = '/cart',
      },
    });
  },

  paymentSuccess: (orderNumber?: string) => {
    showToast({
      type: 'success',
      message: 'Payment Successful!',
      description: orderNumber 
        ? `Your order #${orderNumber} has been confirmed`
        : 'Your payment was processed successfully',
      duration: 8000,
    });
  },

  paymentError: (error?: string) => {
    showToast({
      type: 'error',
      message: 'Payment Failed',
      description: error || 'Please try again or contact support',
      duration: 8000,
      action: {
        label: 'Contact Support',
        onClick: () => window.open('https://wa.me/2348065776378', '_blank'),
      },
    });
  },

  shippingInfo: (location: string) => {
    const isLagos = location.toLowerCase().includes('lagos');
    showToast({
      type: 'info',
      message: isLagos ? 'Same-day delivery available!' : 'Shipping available',
      description: isLagos 
        ? 'Order before 3PM for same-day delivery in Lagos'
        : 'Your order will be delivered within 3-7 business days',
      duration: 6000,
    });
  },
};

// ===============================
// REACT HOOK FOR TOAST
// ===============================

/**
 * Hook for using toast notifications (alternative to global functions)
 */
export const useToastNotification = () => {
  const showSuccess = (message: string, description?: string) => {
    toast.success(message, description);
  };

  const showError = (message: string, description?: string) => {
    toast.error(message, description);
  };

  const showWarning = (message: string, description?: string) => {
    toast.warning(message, description);
  };

  const showInfo = (message: string, description?: string) => {
    toast.info(message, description);
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    toast, // Access to all toast utilities
  };
};