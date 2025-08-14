'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { RebbieProductVariant, RebbieProduct } from '@/lib/types';

// ===============================
// TYPES
// ===============================

export interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  quantity: number;
  variant: RebbieProductVariant;
  product: RebbieProduct;
  addedAt: string;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  loading: boolean;
  currency: 'NGN' | 'USD' | 'EUR';
  shippingLocation: 'lagos' | 'nigeria' | 'international';
}

export interface CartContextType {
  state: CartState;
  addItem: (variant: RebbieProductVariant, quantity: number, product?: RebbieProduct) => Promise<void>;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
  openCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  getShippingCost: () => number;
  changeCurrency: (currency: 'NGN' | 'USD' | 'EUR') => void;
  changeShippingLocation: (location: 'lagos' | 'nigeria' | 'international') => void;
}

// ===============================
// CART REDUCER
// ===============================

type CartAction = 
  | { type: 'ADD_ITEM'; payload: { variant: RebbieProductVariant; quantity: number; product: RebbieProduct } }
  | { type: 'REMOVE_ITEM'; payload: { itemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CHANGE_CURRENCY'; payload: 'NGN' | 'USD' | 'EUR' }
  | { type: 'CHANGE_SHIPPING_LOCATION'; payload: 'lagos' | 'nigeria' | 'international' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { variant, quantity, product } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.variantId === variant.id
      );

      if (existingItemIndex > -1) {
        // Update existing item quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += quantity;
        return {
          ...state,
          items: updatedItems,
          isOpen: true
        };
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          variantId: variant.id,
          productId: variant.product_id || product.id,
          quantity,
          variant,
          product,
          addedAt: new Date().toISOString()
        };

        return {
          ...state,
          items: [...state.items, newItem],
          isOpen: true
        };
      }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.itemId)
      };

    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== itemId)
        };
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.id === itemId
            ? { ...item, quantity }
            : item
        )
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      };

    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true
      };

    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    case 'CHANGE_CURRENCY':
      return {
        ...state,
        currency: action.payload
      };

    case 'CHANGE_SHIPPING_LOCATION':
      return {
        ...state,
        shippingLocation: action.payload
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload
      };

    default:
      return state;
  }
};

// ===============================
// INITIAL STATE
// ===============================

const initialState: CartState = {
  items: [],
  isOpen: false,
  loading: false,
  currency: 'NGN',
  shippingLocation: 'lagos'
};

// ===============================
// CART CONTEXT
// ===============================

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('rebbie-cart');
    const savedCurrency = localStorage.getItem('rebbie-currency') as 'NGN' | 'USD' | 'EUR';
    const savedShippingLocation = localStorage.getItem('rebbie-shipping-location') as 'lagos' | 'nigeria' | 'international';

    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }

    if (savedCurrency) {
      dispatch({ type: 'CHANGE_CURRENCY', payload: savedCurrency });
    }

    if (savedShippingLocation) {
      dispatch({ type: 'CHANGE_SHIPPING_LOCATION', payload: savedShippingLocation });
    }
  }, []);

  // Save cart to localStorage when items change
  useEffect(() => {
    localStorage.setItem('rebbie-cart', JSON.stringify(state.items));
  }, [state.items]);

  // Save currency to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('rebbie-currency', state.currency);
  }, [state.currency]);

  // Save shipping location to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('rebbie-shipping-location', state.shippingLocation);
  }, [state.shippingLocation]);

  // ===============================
  // CART FUNCTIONS
  // ===============================

  const addItem = async (variant: RebbieProductVariant, quantity: number, product?: RebbieProduct) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // If product is not provided, we might need to fetch it
      // For now, we'll assume it's always provided from the product details page
      if (!product) {
        throw new Error('Product information is required');
      }

      dispatch({ 
        type: 'ADD_ITEM', 
        payload: { variant, quantity, product }
      });

      // Optional: Add analytics tracking
      // Analytics.track('Add to Cart', {
      //   product_id: product.id,
      //   variant_id: variant.id,
      //   quantity,
      //   price: variant.prices?.[0]?.amount,
      //   currency: state.currency
      // });

    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const removeItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { itemId } });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  // Calculate total price
  const getCartTotal = (): number => {
    return state.items.reduce((total, item) => {
      const price = item.variant.prices?.find(p => p.currency_code === state.currency)?.amount || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  // Get total item count
  const getCartCount = (): number => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  // Calculate shipping cost based on location and cart total
  const getShippingCost = (): number => {
    const cartTotal = getCartTotal();
    
    // Free shipping thresholds (in NGN equivalent)
    const freeShippingThresholds = {
      lagos: 50000, // ₦50,000
      nigeria: 100000, // ₦100,000
      international: 200000 // ₦200,000
    };

    // Shipping costs (in NGN equivalent)
    const shippingCosts = {
      lagos: 2000, // ₦2,000
      nigeria: 5000, // ₦5,000
      international: 15000 // ₦15,000
    };

    const threshold = freeShippingThresholds[state.shippingLocation];
    const cost = shippingCosts[state.shippingLocation];

    // Convert cart total to NGN for comparison if needed
    let cartTotalInNGN = cartTotal;
    if (state.currency === 'USD') {
      cartTotalInNGN = cartTotal * 1500; // Approximate USD to NGN
    } else if (state.currency === 'EUR') {
      cartTotalInNGN = cartTotal * 1650; // Approximate EUR to NGN
    }

    return cartTotalInNGN >= threshold ? 0 : cost;
  };

  const changeCurrency = (currency: 'NGN' | 'USD' | 'EUR') => {
    dispatch({ type: 'CHANGE_CURRENCY', payload: currency });
  };

  const changeShippingLocation = (location: 'lagos' | 'nigeria' | 'international') => {
    dispatch({ type: 'CHANGE_SHIPPING_LOCATION', payload: location });
  };

  const contextValue: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    closeCart,
    openCart,
    getCartTotal,
    getCartCount,
    getShippingCost,
    changeCurrency,
    changeShippingLocation
  };

  return React.createElement(
    CartContext.Provider,
    { value: contextValue },
    children
  );
};

// ===============================
// CUSTOM HOOK
// ===============================

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// ===============================
// EXPORT CART UTILITIES
// ===============================

export const formatPrice = (amount: number, currency: string): string => {
  const formatters = {
    NGN: new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }),
    USD: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }),
    EUR: new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  };

  const formatter = formatters[currency as keyof typeof formatters];
  return formatter ? formatter.format(amount / 100) : `${currency} ${(amount / 100).toFixed(2)}`;
};

export default CartProvider;



// 'use client' 

// /**
//  * Shopping Cart Hook for Rebbie's Store
//  * Manages cart state, persistence, and operations
//  */

// import React, { useState, useEffect, useCallback, useContext, createContext } from 'react';
// import {
//   createCart,
//   getCart,
//   addToCart,
//   updateCartItem,
//   removeFromCart,
//   formatPrice,
//   getNigeriaRegion,
// } from '@/lib/medusa';
// import { RebbieCart, RebbieLineItem, RebbieProductVariant } from '@/lib/types';

// // ===============================
// // CART CONTEXT
// // ===============================

// interface CartContextType {
//   cart: RebbieCart | null;
//   loading: boolean;
//   error: string | null;
//   itemsCount: number;
//   formattedTotal: string;
//   addItem: (variant: RebbieProductVariant, quantity?: number) => Promise<void>;
//   updateItem: (lineId: string, quantity: number) => Promise<void>;
//   removeItem: (lineId: string) => Promise<void>;
//   clearCart: () => Promise<void>;
//   refetchCart: () => Promise<void>;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// // ===============================
// // CART HOOK
// // ===============================

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// // ===============================
// // CART PROVIDER COMPONENT
// // ===============================

// interface CartProviderProps {
//   children: React.ReactNode;
// }

// export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
//   const [cart, setCart] = useState<RebbieCart | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Get cart ID from localStorage
//   const getStoredCartId = (): string | null => {
//     if (typeof window !== 'undefined') {
//       return localStorage.getItem('rebbie_cart_id');
//     }
//     return null;
//   };

//   // Store cart ID in localStorage
//   const storeCartId = (cartId: string) => {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem('rebbie_cart_id', cartId);
//     }
//   };

//   // Remove cart ID from localStorage
//   const removeStoredCartId = () => {
//     if (typeof window !== 'undefined') {
//       localStorage.removeItem('rebbie_cart_id');
//     }
//   };

//   // Initialize or fetch cart
//   const initializeCart = useCallback(async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const storedCartId = getStoredCartId();
      
//       if (storedCartId) {
//         // Try to fetch existing cart
//         try {
//           const existingCart = await getCart(storedCartId);
//           const formattedCart = await formatCartData(existingCart);
//           setCart(formattedCart);
//           return;
//         } catch (err) {
//           // Cart doesn't exist, remove from storage and create new
//           removeStoredCartId();
//         }
//       }

//       // Create new cart
//       const nigeriaRegion = await getNigeriaRegion();
//       const newCart = await createCart(nigeriaRegion?.id, 'NGN');
//       const formattedCart = await formatCartData(newCart);
      
//       setCart(formattedCart);
//       storeCartId(newCart.id);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to initialize cart');
//       console.error('Error initializing cart:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Format cart data with Nigerian formatting
//   const formatCartData = async (cartData: any): Promise<RebbieCart> => {
//     const currency = cartData.currency_code || 'NGN';
    
//     const formattedCart: RebbieCart = {
//       ...cartData,
//       formatted_total: formatPrice(cartData.total || 0, currency),
//       formatted_subtotal: formatPrice(cartData.subtotal || 0, currency),
//       formatted_tax_total: formatPrice(cartData.tax_total || 0, currency),
//       formatted_shipping_total: formatPrice(cartData.shipping_total || 0, currency),
//       items_count: cartData.items?.reduce((total: number, item: any) => total + item.quantity, 0) || 0,
//     };

//     return formattedCart;
//   };

//   // Add item to cart
//   const addItem = useCallback(async (variant: RebbieProductVariant, quantity: number = 1) => {
//     if (!cart) {
//       await initializeCart();
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const updatedCart = await addToCart(cart.id, {
//         variant_id: variant.id,
//         quantity,
//         metadata: {
//           product_title: variant.product?.title,
//           variant_title: variant.title,
//         },
//       });

//       const formattedCart = await formatCartData(updatedCart);
//       setCart(formattedCart);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to add item to cart');
//       console.error('Error adding item to cart:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, [cart, initializeCart]);

//   // Update item quantity
//   const updateItem = useCallback(async (lineId: string, quantity: number) => {
//     if (!cart) return;

//     setLoading(true);
//     setError(null);

//     try {
//       if (quantity <= 0) {
//         await removeItem(lineId);
//         return;
//       }

//       const updatedCart = await updateCartItem(cart.id, lineId, quantity);
//       const formattedCart = await formatCartData(updatedCart);
//       setCart(formattedCart);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to update item');
//       console.error('Error updating cart item:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, [cart]);

//   // Remove item from cart
//   const removeItem = useCallback(async (lineId: string) => {
//     if (!cart) return;

//     setLoading(true);
//     setError(null);

//     try {
//       const updatedCart = await removeFromCart(cart.id, lineId);
//       const formattedCart = await formatCartData(updatedCart);
//       setCart(formattedCart);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to remove item');
//       console.error('Error removing cart item:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, [cart]);

//   // Clear entire cart
//   const clearCart = useCallback(async () => {
//     setCart(null);
//     removeStoredCartId();
//     await initializeCart();
//   }, [initializeCart]);

//   // Refetch cart data
//   const refetchCart = useCallback(async () => {
//     if (!cart) return;

//     try {
//       const updatedCart = await getCart(cart.id);
//       const formattedCart = await formatCartData(updatedCart);
//       setCart(formattedCart);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to refresh cart');
//       console.error('Error refetching cart:', err);
//     }
//   }, [cart]);

//   // Initialize cart on mount
//   useEffect(() => {
//     initializeCart();
//   }, [initializeCart]);

//   // Computed values
//   const itemsCount = cart?.items_count || 0;
//   const formattedTotal = cart?.formatted_total || formatPrice(0, 'NGN');

//   const value: CartContextType = {
//     cart,
//     loading,
//     error,
//     itemsCount,
//     formattedTotal,
//     addItem,
//     updateItem,
//     removeItem,
//     clearCart,
//     refetchCart,
//   };

//   return React.createElement(
//     CartContext.Provider,
//     { value },
//     children
//   );
// };

// // ===============================
// // STANDALONE CART HOOKS
// // ===============================

// /**
//  * Hook for cart operations without context (for components outside provider)
//  */
// export const useCartOperations = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const quickAddToCart = useCallback(async (
//     variant: RebbieProductVariant,
//     quantity: number = 1
//   ) => {
//     setLoading(true);
//     setError(null);

//     try {
//       // Get or create cart
//       let cartId = localStorage.getItem('rebbie_cart_id');
      
//       if (!cartId) {
//         const nigeriaRegion = await getNigeriaRegion();
//         const newCart = await createCart(nigeriaRegion?.id, 'NGN');
//         cartId = newCart.id;
//         localStorage.setItem('rebbie_cart_id', cartId);
//       }

//       // Add item to cart
//       await addToCart(cartId, {
//         variant_id: variant.id,
//         quantity,
//       });

//       return true;
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to add to cart');
//       console.error('Error in quick add to cart:', err);
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   return {
//     quickAddToCart,
//     loading,
//     error,
//   };
// };

// /**
//  * Hook for cart summary (for mini cart, header, etc.)
//  */
// export const useCartSummary = () => {
//   const [cartSummary, setCartSummary] = useState({
//     itemsCount: 0,
//     total: 0,
//     formattedTotal: formatPrice(0, 'NGN'),
//   });
//   const [loading, setLoading] = useState(true);

//   const fetchCartSummary = useCallback(async () => {
//     try {
//       const cartId = localStorage.getItem('rebbie_cart_id');
//       if (!cartId) {
//         setLoading(false);
//         return;
//       }

//       const cart = await getCart(cartId);
//       const itemsCount = cart.items?.reduce((total, item) => total + item.quantity, 0) || 0;
      
//       setCartSummary({
//         itemsCount,
//         total: cart.total || 0,
//         formattedTotal: formatPrice(cart.total || 0, cart.currency_code || 'NGN'),
//       });
//     } catch (err) {
//       console.error('Error fetching cart summary:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchCartSummary();

//     // Listen for cart updates
//     const handleCartUpdate = () => fetchCartSummary();
//     window.addEventListener('cartUpdated', handleCartUpdate);

//     return () => {
//       window.removeEventListener('cartUpdated', handleCartUpdate);
//     };
//   }, [fetchCartSummary]);

//   return {
//     ...cartSummary,
//     loading,
//     refetch: fetchCartSummary,
//   };
// };

// /**
//  * Trigger cart update event
//  */
// export const triggerCartUpdate = () => {
//   if (typeof window !== 'undefined') {
//     window.dispatchEvent(new Event('cartUpdated'));
//   }
// };