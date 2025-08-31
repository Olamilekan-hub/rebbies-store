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
    const queryParams: any = {
      limit: params?.limit || 20,
      offset: params?.offset || 0,
    };

    // Add optional parameters only if they exist
    if (params?.category_id?.length) {
      queryParams.category_id = params.category_id;
    }
    if (params?.q) {
      queryParams.q = params.q;
    }
    if (params?.tags?.length) {
      queryParams.tags = params.tags;
    }
    if (params?.collection_id?.length) {
      queryParams.collection_id = params.collection_id;
    }

    const { products, count, offset, limit } = await medusaClient.store.product.list(queryParams);

    return {
      products,
      count: count || products.length,
      offset: offset || 0,
      limit: limit || 20,
      hasMore: (offset || 0) + (limit || 20) < (count || products.length),
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Fetch a single product by handle or ID
 */
export const getProduct = async (handleOrId: string, currency_code: string = 'ngn') => {
  try {
    const { product } = await medusaClient.store.product.retrieve(handleOrId, {
      currency_code: currency_code.toLowerCase(),
    });
    return product;
  } catch (error) {
    console.error(`Error fetching product ${handleOrId}:`, error);
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
      limit: params?.limit,
      offset: params?.offset,
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
    return product_categories || [];
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
export const createCart = async (region_id?: string, currency_code: string = 'ngn') => {
  try {
    const cartData: any = {
      currency_code: currency_code.toLowerCase(),
    };
    
    if (region_id) {
      cartData.region_id = region_id;
    }

    const { cart } = await medusaClient.store.cart.create(cartData);
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
    return regions || [];
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
      limit: params?.limit,
      offset: params?.offset,
      category_id: params?.category_id,
      q: query,
    });
  } catch (error) {
    console.error(`Error searching products for "${query}":`, error);
    throw error;
  }
};

// ===============================
// SHIPPING FUNCTIONS
// ===============================

/**
 * Get available shipping options for cart
 */
export const getShippingOptions = async (cartId: string) => {
  try {
    const { shipping_options } = await medusaClient.store.fulfillment.listCartOptions(cartId);
    return shipping_options || [];
  } catch (error) {
    console.error(`Error fetching shipping options for cart ${cartId}:`, error);
    throw error;
  }
};

/**
 * Add shipping method to cart
 */
export const addShippingMethod = async (cartId: string, optionId: string) => {
  try {
    const { cart } = await medusaClient.store.cart.shippingMethod.create(cartId, {
      option_id: optionId,
    });
    return cart;
  } catch (error) {
    console.error('Error adding shipping method:', error);
    throw error;
  }
};

// ===============================
// CHECKOUT & PAYMENT FUNCTIONS
// ===============================

/**
 * Create payment sessions for cart
 */
export const createPaymentSessions = async (cartId: string) => {
  try {
    const { cart } = await medusaClient.store.cart.paymentSession.create(cartId);
    return cart;
  } catch (error) {
    console.error('Error creating payment sessions:', error);
    throw error;
  }
};

/**
 * Set payment session
 */
export const setPaymentSession = async (cartId: string, providerId: string) => {
  try {
    const { cart } = await medusaClient.store.cart.setPaymentSession(cartId, {
      provider_id: providerId,
    });
    return cart;
  } catch (error) {
    console.error('Error setting payment session:', error);
    throw error;
  }
};

/**
 * Update payment session
 */
export const updatePaymentSession = async (cartId: string, providerId: string, data: any) => {
  try {
    const { cart } = await medusaClient.store.cart.paymentSession.update(cartId, providerId, {
      data,
    });
    return cart;
  } catch (error) {
    console.error('Error updating payment session:', error);
    throw error;
  }
};

/**
 * Complete cart and create order
 */
export const completeCart = async (cartId: string) => {
  try {
    const { order } = await medusaClient.store.cart.complete(cartId);
    return order;
  } catch (error) {
    console.error('Error completing cart:', error);
    throw error;
  }
};

// ===============================
// ORDER FUNCTIONS
// ===============================

/**
 * Get order by ID
 */
export const getOrder = async (orderId: string) => {
  try {
    const { order } = await medusaClient.store.order.retrieve(orderId);
    return order;
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Get order by cart ID
 */
export const getOrderByCartId = async (cartId: string) => {
  try {
    const { order } = await medusaClient.store.order.retrieveByCartId(cartId);
    return order;
  } catch (error) {
    console.error(`Error fetching order by cart ${cartId}:`, error);
    throw error;
  }
};

// ===============================
// CUSTOMER AUTHENTICATION FUNCTIONS
// ===============================

/**
 * Customer registration - Medusa v2 compatible
 */
export const registerCustomer = async (customerData: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
}) => {
  try {
    // Step 1: Get registration token
    const { token } = await medusaClient.auth.register("customer", "emailpass", {
      email: customerData.email,
      password: customerData.password,
    });

    // Step 2: Create customer with registration token
    const { customer } = await medusaClient.store.customer.create(customerData, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    return customer;
  } catch (error) {
    console.error('Error registering customer:', error);
    throw error;
  }
};

/**
 * Customer login - Medusa v2 compatible
 */
export const loginCustomer = async (email: string, password: string) => {
  try {
    const { token } = await medusaClient.auth.authenticate("customer", "emailpass", {
      email,
      password,
    });
    
    // Get customer data with the auth token
    const { customer } = await medusaClient.store.customer.retrieve({
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    
    return { customer, token };
  } catch (error) {
    console.error('Error logging in customer:', error);
    throw error;
  }
};

/**
 * Get current customer profile
 */
export const getCurrentCustomer = async () => {
  try {
    const { customer } = await medusaClient.store.customer.retrieve();
    return customer;
  } catch (error) {
    console.error('Error fetching current customer:', error);
    throw error;
  }
};

/**
 * Update customer profile - Medusa v2 compatible
 */
export const updateCustomer = async (customerData: {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  password?: string;
  metadata?: Record<string, any>;
}, authToken?: string) => {
  try {
    const headers = authToken ? { authorization: `Bearer ${authToken}` } : {};
    const { customer } = await medusaClient.store.customer.update(customerData, {
      headers,
    });
    return customer;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

/**
 * Customer logout - Medusa v2 compatible
 */
export const logoutCustomer = async () => {
  try {
    await medusaClient.auth.logout("customer", "emailpass");
    return true;
  } catch (error) {
    console.error('Error logging out customer:', error);
    throw error;
  }
};

/**
 * Request password reset - Medusa v2 compatible
 */
export const requestPasswordReset = async (email: string) => {
  try {
    await medusaClient.auth.resetPassword("customer", "emailpass", {
      identifier: email,
    });
    return true;
  } catch (error) {
    console.error('Error requesting password reset:', error);
    throw error;
  }
};

/**
 * Update password with reset token - Medusa v2 compatible
 */
export const updatePasswordWithToken = async (token: string, newPassword: string) => {
  try {
    await medusaClient.auth.updateProvider("customer", "emailpass", {
      password: newPassword,
    }, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return true;
  } catch (error) {
    console.error('Error updating password with token:', error);
    throw error;
  }
};

/**
 * Get customer orders
 */
export const getCustomerOrders = async (params?: {
  limit?: number;
  offset?: number;
}) => {
  try {
    const { orders, count, offset, limit } = await medusaClient.store.customer.listOrders({
      limit: params?.limit || 10,
      offset: params?.offset || 0,
    });
    return {
      orders: orders || [],
      count: count || 0,
      offset: offset || 0,
      limit: limit || 10,
    };
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    throw error;
  }
};

// ===============================
// PAYSTACK INTEGRATION FUNCTIONS
// ===============================

/**
 * Initialize Paystack payment
 */
export const initializePaystackPayment = async (cartId: string, email: string) => {
  try {
    const response = await fetch('/api/paystack/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        cartId, 
        email,
        currency: 'NGN' 
      }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error initializing Paystack payment:', error);
    throw error;
  }
};

/**
 * Verify Paystack payment
 */
export const verifyPaystackPayment = async (reference: string) => {
  try {
    const response = await fetch(`/api/paystack/verify/${reference}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying Paystack payment:', error);
    throw error;
  }
};

// ===============================
// ADDRESS MANAGEMENT FUNCTIONS
// ===============================

/**
 * Add shipping address to cart
 */
export const addShippingAddress = async (cartId: string, address: {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  postal_code?: string;
  province?: string;
  country_code: string;
  phone?: string;
}) => {
  try {
    const { cart } = await medusaClient.store.cart.update(cartId, {
      shipping_address: address,
    });
    return cart;
  } catch (error) {
    console.error('Error adding shipping address:', error);
    throw error;
  }
};

/**
 * Add billing address to cart
 */
export const addBillingAddress = async (cartId: string, address: {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  postal_code?: string;
  province?: string;
  country_code: string;
  phone?: string;
}) => {
  try {
    const { cart } = await medusaClient.store.cart.update(cartId, {
      billing_address: address,
    });
    return cart;
  } catch (error) {
    console.error('Error adding billing address:', error);
    throw error;
  }
};

/**
 * Add customer email to cart
 */
export const addCustomerEmail = async (cartId: string, email: string) => {
  try {
    const { cart } = await medusaClient.store.cart.update(cartId, {
      email,
    });
    return cart;
  } catch (error) {
    console.error('Error adding customer email:', error);
    throw error;
  }
};

// ===============================
// NIGERIAN SPECIFIC FUNCTIONS
// ===============================

/**
 * Get Nigerian shipping rates based on location
 */
export const getNigerianShippingRates = (state: string, cartTotal: number) => {
  const rates = {
    lagos: { 
      standard: 200000, // ₦2,000 in kobo
      express: 300000,  // ₦3,000 in kobo
      freeThreshold: 5000000 // ₦50,000 in kobo
    },
    nigeria: { 
      standard: 500000, // ₦5,000 in kobo
      express: 800000,  // ₦8,000 in kobo
      freeThreshold: 10000000 // ₦100,000 in kobo
    }
  };

  const isLagos = state.toLowerCase().includes('lagos');
  const zone = isLagos ? rates.lagos : rates.nigeria;
  
  return {
    standard: cartTotal >= zone.freeThreshold ? 0 : zone.standard,
    express: cartTotal >= zone.freeThreshold ? zone.express / 2 : zone.express,
    isFreeShipping: cartTotal >= zone.freeThreshold,
    freeThreshold: zone.freeThreshold,
  };
};

/**
 * Validate Nigerian phone number
 */
export const validateNigerianPhone = (phone: string): boolean => {
  // Nigerian phone patterns: +234, 0, or raw 11 digits
  const patterns = [
    /^\+234[789]\d{9}$/,     // +2348012345678
    /^0[789]\d{9}$/,         // 08012345678
    /^[789]\d{9}$/,          // 8012345678
  ];
  
  return patterns.some(pattern => pattern.test(phone.replace(/\s+/g, '')));
};

export default medusaClient;