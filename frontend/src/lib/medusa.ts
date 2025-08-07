/**
 * MedusaJS Client Configuration for Rebbie's Store
 * Handles all backend API communications
 */

import Medusa from "@medusajs/js-sdk";

// Initialize MedusaJS client
const medusaClient = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  // Add API key for server-side requests if needed
  apiKey: process.env.MEDUSA_API_KEY,
});

// Export the client instance
export { medusaClient };

// ===============================
// PRODUCT FUNCTIONS
// ===============================

/**
 * Fetch all products with optional filtering
 */
export const getProducts = async (params?: {
  limit?: number;
  offset?: number;
  category_id?: string[];
  q?: string; // search query
  tags?: string[];
  collection_id?: string[];
  currency_code?: string;
}) => {
  try {
    const { products, count, offset, limit } = await medusaClient.store.product.list({
      limit: params?.limit || 20,
      offset: params?.offset || 0,
      category_id: params?.category_id,
      q: params?.q,
      tags: params?.tags,
      collection_id: params?.collection_id,
      currency_code: params?.currency_code || 'NGN',
    });

    return {
      products,
      count,
      offset,
      limit,
      hasMore: offset + limit < count,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Fetch a single product by handle
 */
export const getProduct = async (handle: string, currency_code: string = 'NGN') => {
  try {
    const { product } = await medusaClient.store.product.retrieve(handle, {
      currency_code,
    });
    return product;
  } catch (error) {
    console.error(`Error fetching product ${handle}:`, error);
    throw error;
  }
};

/**
 * Fetch products by category
 */
export const getProductsByCategory = async (categoryId: string, params?: {
  limit?: number;
  offset?: number;
  currency_code?: string;
}) => {
  try {
    return await getProducts({
      ...params,
      category_id: [categoryId],
    });
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error);
    throw error;
  }
};

// ===============================
// CATEGORY FUNCTIONS
// ===============================

/**
 * Fetch all product categories
 */
export const getCategories = async () => {
  try {
    const { product_categories } = await medusaClient.store.category.list();
    return product_categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Fetch a single category with products
 */
export const getCategory = async (handle: string) => {
  try {
    const { product_category } = await medusaClient.store.category.retrieve(handle, {
      fields: "*products",
    });
    return product_category;
  } catch (error) {
    console.error(`Error fetching category ${handle}:`, error);
    throw error;
  }
};

// ===============================
// CART FUNCTIONS
// ===============================

/**
 * Create a new cart
 */
export const createCart = async (region_id?: string, currency_code: string = 'NGN') => {
  try {
    const { cart } = await medusaClient.store.cart.create({
      region_id,
      currency_code,
    });
    return cart;
  } catch (error) {
    console.error('Error creating cart:', error);
    throw error;
  }
};

/**
 * Get cart by ID
 */
export const getCart = async (cartId: string) => {
  try {
    const { cart } = await medusaClient.store.cart.retrieve(cartId);
    return cart;
  } catch (error) {
    console.error(`Error fetching cart ${cartId}:`, error);
    throw error;
  }
};

/**
 * Add item to cart
 */
export const addToCart = async (cartId: string, item: {
  variant_id: string;
  quantity: number;
  metadata?: Record<string, any>;
}) => {
  try {
    const { cart } = await medusaClient.store.cart.lineItem.create(cartId, item);
    return cart;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (cartId: string, lineId: string, quantity: number) => {
  try {
    const { cart } = await medusaClient.store.cart.lineItem.update(cartId, lineId, {
      quantity,
    });
    return cart;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (cartId: string, lineId: string) => {
  try {
    const { cart } = await medusaClient.store.cart.lineItem.delete(cartId, lineId);
    return cart;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw error;
  }
};

// ===============================
// REGION FUNCTIONS
// ===============================

/**
 * Get all regions
 */
export const getRegions = async () => {
  try {
    const { regions } = await medusaClient.store.region.list();
    return regions;
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }
};

/**
 * Get Nigeria region (primary region)
 */
export const getNigeriaRegion = async () => {
  try {
    const regions = await getRegions();
    return regions.find((region: any) => region.name === 'Nigeria') || regions[0];
  } catch (error) {
    console.error('Error fetching Nigeria region:', error);
    throw error;
  }
};

// ===============================
// UTILITY FUNCTIONS
// ===============================

/**
 * Format price with Nigerian Naira
 */
export const formatPrice = (amount: number, currency: string = 'NGN') => {
  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency.toUpperCase(),
  });
  
  // Convert from kobo to naira (divide by 100)
  return formatter.format(amount / 100);
};

/**
 * Convert currency amounts
 */
export const convertCurrency = async (amount: number, from: string, to: string) => {
  try {
    const response = await fetch('/api/currency/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, from, to }),
    });
    
    const data = await response.json();
    return data.converted_amount;
  } catch (error) {
    console.error('Error converting currency:', error);
    return amount; // Return original amount on error
  }
};

/**
 * Get Nigerian payment methods
 */
export const getNigerianPaymentMethods = async () => {
  try {
    const response = await fetch('/api/store/payment-methods/nigeria');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching Nigerian payment methods:', error);
    throw error;
  }
};

// ===============================
// SEARCH FUNCTIONS
// ===============================

/**
 * Search products
 */
export const searchProducts = async (query: string, params?: {
  limit?: number;
  offset?: number;
  category_id?: string[];
  currency_code?: string;
}) => {
  try {
    return await getProducts({
      ...params,
      q: query,
    });
  } catch (error) {
    console.error(`Error searching products for "${query}":`, error);
    throw error;
  }
};

export default medusaClient;