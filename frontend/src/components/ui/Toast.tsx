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
    <div className="fixed top-4 right-4 z-50 space-y-2">
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
            <p className="text-sm text-neutral-600 mt-1">
              {toast.message}
            </p>
          )}
          
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="text-sm font-medium text-rebbie-600 hover:text-rebbie-700 mt-2 underline"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        
        <button
          onClick={() => removeToast(toast.id)}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-neutral-100 transition-colors"
        >
          <XMarkIcon className="w-4 h-4 text-neutral-400" />
        </button>
      </div>
    </div>
  );
};

// ===============================
// USAGE EXAMPLES & INTEGRATION
// ===============================

// Update your main layout.tsx to include ToastProvider
/*
'use client';

import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/components/ui/Toast';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            
            <CartDrawer />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
*/

// ===============================
// UPDATED CART CONTEXT WITH TOASTS
// ===============================

// Update the addItem function in CartContext.tsx:
/*
const addItem = async (variant: RebbieProductVariant, quantity: number, product?: RebbieProduct) => {
  dispatch({ type: 'SET_LOADING', payload: true });
  
  try {
    if (!product) {
      throw new Error('Product information is required');
    }

    dispatch({ 
      type: 'ADD_ITEM', 
      payload: { variant, quantity, product }
    });

    // Show success toast
    const toast = useToast(); // You'd need to access this properly
    toast.cartAdded(product.title, {
      label: 'View Cart',
      onClick: () => toggleCart()
    });

  } catch (error) {
    console.error('Error adding item to cart:', error);
    const toast = useToast();
    toast.error('Failed to add to cart', 'Please try again');
    throw error;
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};
*/

// ===============================
// EXAMPLE USAGE IN PRODUCT DETAILS
// ===============================

/*
// In your ProductDetailsPage component:

import { useToast } from '@/components/ui/Toast';

export default function ProductDetailsPage() {
  const toast = useToast();
  const { addItem, loading: addingToCart } = useCart();

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.warning('Please select a variant', 'Choose size, color, or other options');
      return;
    }

    try {
      await addItem(selectedVariant, quantity, product);
      // Toast is automatically shown by the cart context
    } catch (error) {
      toast.error('Failed to add to cart', 'Please try again');
    }
  };

  return (
    // ... your component JSX
  );
}
*/

// ===============================
// CART INTEGRATION SUMMARY
// ===============================

/*
CART SYSTEM COMPONENTS CREATED:

1. **CartContext & Hook** (/context/CartContext.tsx)
   - Global cart state management
   - Add/remove/update items
   - Currency & shipping location switching
   - Local storage persistence
   - Nigerian-specific shipping calculations

2. **CartDrawer** (/components/cart/CartDrawer.tsx)
   - Slide-out cart from right side
   - Item management with quantity controls
   - Shipping calculator
   - Order summary with totals
   - Direct checkout access

3. **CartPage** (/app/cart/page.tsx)
   - Full-page cart view
   - Detailed item management
   - Promo code support
   - Wishlist integration
   - Enhanced order summary

4. **CartIcon & Integration** (/components/cart/CartIcon.tsx)
   - Header cart icon with count badge
   - Mini cart preview on hover
   - Mobile floating cart button
   - Header integration

5. **Toast System** (/components/ui/Toast.tsx)
   - Cart action notifications
   - Success/error/warning toasts
   - Action buttons in toasts
   - Auto-dismiss functionality

FEATURES INCLUDED:
✅ Nigerian currency support (NGN primary)
✅ Shipping cost calculation (Lagos/Nigeria/International)
✅ Free shipping thresholds
✅ Mobile-first responsive design
✅ Cart persistence in localStorage
✅ Real-time cart count updates
✅ Quantity controls with validation
✅ Product variant support
✅ Cart drawer with smooth animations
✅ Mini cart preview on hover
✅ Toast notifications for actions
✅ Promo code support framework
✅ Wishlist integration hooks
✅ Trust badges and payment methods

NEXT STEPS:
- Checkout Process (Multi-step with Nigerian payment methods)
- Authentication System (Firebase with phone/email)
- User Account Dashboard
- Order Management System
*/