'use client' 

/**
 * Shopping Cart Hook for Rebbie's Store
 * Manages cart state, persistence, and operations
 */

import React, { useState, useEffect, useCallback, useContext, createContext } from 'react';
import {
  createCart,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  formatPrice,
  getNigeriaRegion,
} from '@/lib/medusa';
import { RebbieCart, RebbieLineItem, RebbieProductVariant } from '@/lib/types';

// ===============================
// CART CONTEXT
// ===============================

interface CartContextType {
  cart: RebbieCart | null;
  loading: boolean;
  error: string | null;
  itemsCount: number;
  formattedTotal: string;
  addItem: (variant: RebbieProductVariant, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// ===============================
// CART HOOK
// ===============================

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// ===============================
// CART PROVIDER COMPONENT
// ===============================

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<RebbieCart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get cart ID from localStorage
  const getStoredCartId = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('rebbie_cart_id');
    }
    return null;
  };

  // Store cart ID in localStorage
  const storeCartId = (cartId: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rebbie_cart_id', cartId);
    }
  };

  // Remove cart ID from localStorage
  const removeStoredCartId = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rebbie_cart_id');
    }
  };

  // Initialize or fetch cart
  const initializeCart = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const storedCartId = getStoredCartId();
      
      if (storedCartId) {
        // Try to fetch existing cart
        try {
          const existingCart = await getCart(storedCartId);
          const formattedCart = await formatCartData(existingCart);
          setCart(formattedCart);
          return;
        } catch (err) {
          // Cart doesn't exist, remove from storage and create new
          removeStoredCartId();
        }
      }

      // Create new cart
      const nigeriaRegion = await getNigeriaRegion();
      const newCart = await createCart(nigeriaRegion?.id, 'NGN');
      const formattedCart = await formatCartData(newCart);
      
      setCart(formattedCart);
      storeCartId(newCart.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize cart');
      console.error('Error initializing cart:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Format cart data with Nigerian formatting
  const formatCartData = async (cartData: any): Promise<RebbieCart> => {
    const currency = cartData.currency_code || 'NGN';
    
    const formattedCart: RebbieCart = {
      ...cartData,
      formatted_total: formatPrice(cartData.total || 0, currency),
      formatted_subtotal: formatPrice(cartData.subtotal || 0, currency),
      formatted_tax_total: formatPrice(cartData.tax_total || 0, currency),
      formatted_shipping_total: formatPrice(cartData.shipping_total || 0, currency),
      items_count: cartData.items?.reduce((total: number, item: any) => total + item.quantity, 0) || 0,
    };

    return formattedCart;
  };

  // Add item to cart
  const addItem = useCallback(async (variant: RebbieProductVariant, quantity: number = 1) => {
    if (!cart) {
      await initializeCart();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedCart = await addToCart(cart.id, {
        variant_id: variant.id,
        quantity,
        metadata: {
          product_title: variant.product?.title,
          variant_title: variant.title,
        },
      });

      const formattedCart = await formatCartData(updatedCart);
      setCart(formattedCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item to cart');
      console.error('Error adding item to cart:', err);
    } finally {
      setLoading(false);
    }
  }, [cart, initializeCart]);

  // Update item quantity
  const updateItem = useCallback(async (lineId: string, quantity: number) => {
    if (!cart) return;

    setLoading(true);
    setError(null);

    try {
      if (quantity <= 0) {
        await removeItem(lineId);
        return;
      }

      const updatedCart = await updateCartItem(cart.id, lineId, quantity);
      const formattedCart = await formatCartData(updatedCart);
      setCart(formattedCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
      console.error('Error updating cart item:', err);
    } finally {
      setLoading(false);
    }
  }, [cart]);

  // Remove item from cart
  const removeItem = useCallback(async (lineId: string) => {
    if (!cart) return;

    setLoading(true);
    setError(null);

    try {
      const updatedCart = await removeFromCart(cart.id, lineId);
      const formattedCart = await formatCartData(updatedCart);
      setCart(formattedCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item');
      console.error('Error removing cart item:', err);
    } finally {
      setLoading(false);
    }
  }, [cart]);

  // Clear entire cart
  const clearCart = useCallback(async () => {
    setCart(null);
    removeStoredCartId();
    await initializeCart();
  }, [initializeCart]);

  // Refetch cart data
  const refetchCart = useCallback(async () => {
    if (!cart) return;

    try {
      const updatedCart = await getCart(cart.id);
      const formattedCart = await formatCartData(updatedCart);
      setCart(formattedCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh cart');
      console.error('Error refetching cart:', err);
    }
  }, [cart]);

  // Initialize cart on mount
  useEffect(() => {
    initializeCart();
  }, [initializeCart]);

  // Computed values
  const itemsCount = cart?.items_count || 0;
  const formattedTotal = cart?.formatted_total || formatPrice(0, 'NGN');

  const value: CartContextType = {
    cart,
    loading,
    error,
    itemsCount,
    formattedTotal,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    refetchCart,
  };

  return React.createElement(
    CartContext.Provider,
    { value },
    children
  );
};

// ===============================
// STANDALONE CART HOOKS
// ===============================

/**
 * Hook for cart operations without context (for components outside provider)
 */
export const useCartOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quickAddToCart = useCallback(async (
    variant: RebbieProductVariant,
    quantity: number = 1
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Get or create cart
      let cartId = localStorage.getItem('rebbie_cart_id');
      
      if (!cartId) {
        const nigeriaRegion = await getNigeriaRegion();
        const newCart = await createCart(nigeriaRegion?.id, 'NGN');
        cartId = newCart.id;
        localStorage.setItem('rebbie_cart_id', cartId);
      }

      // Add item to cart
      await addToCart(cartId, {
        variant_id: variant.id,
        quantity,
      });

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart');
      console.error('Error in quick add to cart:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    quickAddToCart,
    loading,
    error,
  };
};

/**
 * Hook for cart summary (for mini cart, header, etc.)
 */
export const useCartSummary = () => {
  const [cartSummary, setCartSummary] = useState({
    itemsCount: 0,
    total: 0,
    formattedTotal: formatPrice(0, 'NGN'),
  });
  const [loading, setLoading] = useState(true);

  const fetchCartSummary = useCallback(async () => {
    try {
      const cartId = localStorage.getItem('rebbie_cart_id');
      if (!cartId) {
        setLoading(false);
        return;
      }

      const cart = await getCart(cartId);
      const itemsCount = cart.items?.reduce((total, item) => total + item.quantity, 0) || 0;
      
      setCartSummary({
        itemsCount,
        total: cart.total || 0,
        formattedTotal: formatPrice(cart.total || 0, cart.currency_code || 'NGN'),
      });
    } catch (err) {
      console.error('Error fetching cart summary:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCartSummary();

    // Listen for cart updates
    const handleCartUpdate = () => fetchCartSummary();
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [fetchCartSummary]);

  return {
    ...cartSummary,
    loading,
    refetch: fetchCartSummary,
  };
};

/**
 * Trigger cart update event
 */
export const triggerCartUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cartUpdated'));
  }
};