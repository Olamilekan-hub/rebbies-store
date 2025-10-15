/**
 * TypeScript Types for Rebbie's Store
 *  MedusaJS v2 with HttpTypes namespace
 */

import { HttpTypes } from "@medusajs/types";

// ===============================
// CORE MEDUSA TYPES (Extended)
// ===============================

export interface RebbieProduct extends Omit<HttpTypes.StoreProduct, 'variants'> {
  variants?: RebbieProductVariant[];
  category_names?: string[];
  is_thrift?: boolean;
  condition?: 'New' | 'Excellent' | 'Very Good' | 'Good' | 'Fair';
  origin_country: any;
  tags?: ProductTag[];
}

export interface RebbieProductVariant extends HttpTypes.StoreProductVariant {
  inventory_quantity?: number;
  prices_formatted?: {
    [currency: string]: string;
  };
  prices?: {
    [currency: string]: string;
  };
}

export interface ProductTag {
  id: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface RebbieCart extends HttpTypes.StoreCart {
  formatted_total?: string;
  formatted_subtotal?: string;
  formatted_tax_total?: string;
  formatted_shipping_total?: string;
  items_count?: number;
}

export interface RebbieLineItem extends HttpTypes.StoreCartLineItem {
  formatted_total?: string;
  formatted_unit_price?: string;
}

// For regions, shipping options - using Store types
export interface RebbieRegion extends HttpTypes.StoreRegion {}
export interface RebbieShippingOption extends HttpTypes.StoreShippingOption {
  delivery_time?: string;
  zone: 'lagos' | 'southwest' | 'southeast' | 'northcentral' | 'northeast' | 'northwest' | 'southsouth' | 'international';
  same_day_available?: boolean;
}

// ===============================
// NIGERIAN-SPECIFIC TYPES
// ===============================

export interface NigerianAddress {
  id?: string;
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string; // Nigerian state
  postal_code?: string;
  country_code: 'ng' | 'NG';
  phone: string; // Nigerian phone format
  metadata?: {
    lga?: string; // Local Government Area
    landmark?: string;
  };
}

export interface NigerianShippingOption extends RebbieShippingOption {
  delivery_time?: string;
  zone: 'lagos' | 'southwest' | 'southeast' | 'northcentral' | 'northeast' | 'northwest' | 'southsouth' | 'international';
  same_day_available?: boolean;
}

export interface PaystackPaymentData {
  reference: string;
  amount: number;
  currency: string;
  email: string;
  channels: Array<'card' | 'bank' | 'ussd' | 'bank_transfer' | 'mobile_money'>;
  metadata?: {
    order_id?: string;
    customer_id?: string;
    cart_id?: string;
  };
}

// ===============================
// PRODUCT CATEGORY TYPES
// ===============================

export type CategorySlug = 
  | 'fashion-bags'
  | 'thrift-fashion-bags'
  | 'non-thrift-fashion-bags'
  | 'jewelry'
  | 'necklaces'
  | 'earrings'
  | 'rings'
  | 'bracelets'
  | 'african-jewelry'
  | 'fragrances'
  | 'mens-fragrances'
  | 'womens-fragrances';

export interface CategoryInfo {
  name: string;
  slug: CategorySlug;
  description: string;
  parent?: CategorySlug;
  image_url?: string;
  icon?: string;
  is_featured?: boolean;
}

// ===============================
// USER AUTHENTICATION TYPES
// ===============================

export interface RebbieUser extends HttpTypes.StoreCustomer {
  addresses?: NigerianAddress[];
  orders?: RebbieOrder[];
  wishlist?: RebbieProduct[];
  marketing_preferences?: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
}

export interface AuthForm {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  accept_terms?: boolean;
}

export interface PhoneVerification {
  phone: string;
  code: string;
  verified: boolean;
}

// ===============================
// ORDER TYPES
// ===============================

export interface RebbieOrder extends HttpTypes.StoreOrder {
  items: RebbieLineItem[];
  shipping_address: NigerianAddress;
  billing_address?: NigerianAddress;
  shipping_methods: NigerianShippingOption[];
  payments: PaymentInfo[];
  tracking_number?: string;
  estimated_delivery?: string;
}

export interface PaymentInfo {
  id: string;
  amount: number;
  currency: string;
  status: string;
  provider: 'paystack' | 'manual' | 'flutterwave';
  reference?: string;
  created_at: string;
}

// ===============================
// UI COMPONENT TYPES
// ===============================

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  label?: string;
  error?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// ===============================
// FILTER AND SEARCH TYPES
// ===============================

export interface ProductFilters {
  categories?: string[];
  tags?: string[];
  price_range?: {
    min: number;
    max: number;
  };
  condition?: string[];
  is_thrift?: boolean;
  sort_by?: 'created_at' | 'title' | 'price_low_to_high' | 'price_high_to_low';
  currency?: string;
}

export interface SearchParams {
  q?: string;
  category?: string;
  limit?: number;
  offset?: number;
  filters?: ProductFilters;
}

export interface SearchResults {
  products: RebbieProduct[];
  count: number;
  offset: number;
  limit: number;
  hasMore: boolean;
  filters_applied?: ProductFilters;
}

// ===============================
// CURRENCY TYPES
// ===============================

export type SupportedCurrency = 'NGN' | 'USD' | 'EUR';

export interface CurrencyInfo {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  is_default: boolean;
  exchange_rate?: number;
}

export interface CurrencyConversion {
  from: SupportedCurrency;
  to: SupportedCurrency;
  amount: number;
  converted_amount: number;
  exchange_rate: number;
  timestamp: string;
}

// ===============================
// WISHLIST TYPES
// ===============================

export interface WishlistItem {
  id: string;
  product: RebbieProduct;
  variant?: RebbieProductVariant;
  added_at: string;
}

export interface Wishlist {
  id: string;
  user_id: string;
  items: WishlistItem[];
  created_at: string;
  updated_at: string;
}

// ===============================
// ANALYTICS TYPES
// ===============================

export interface TrackingEvent {
  event: string;
  properties: Record<string, any>;
  user_id?: string;
  timestamp?: string;
}

export interface ProductView extends TrackingEvent {
  event: 'product_viewed';
  properties: {
    product_id: string;
    product_name: string;
    category: string;
    price: number;
    currency: string;
  };
}

export interface AddToCart extends TrackingEvent {
  event: 'add_to_cart';
  properties: {
    product_id: string;
    variant_id: string;
    quantity: number;
    price: number;
    currency: string;
  };
}

// ===============================
// API RESPONSE TYPES
// ===============================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    has_more: boolean;
  };
}

export interface ErrorResponse {
  success: false;
  error: string;
  details?: any;
  code?: string;
}

// ===============================
// UTILITY TYPES
// ===============================

export type Nullable<T> = T | null;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// ===============================
// CONSTANTS
// ===============================

export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'FCT (Abuja)', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
  'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
  'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
] as const;

export type NigerianState = typeof NIGERIAN_STATES[number];

export const PRODUCT_CATEGORIES: Record<CategorySlug, CategoryInfo> = {
  'fashion-bags': {
    name: 'Fashion Bags',
    slug: 'fashion-bags',
    description: 'Stylish bags for every occasion',
    icon: '👜',
    is_featured: true,
  },
  'thrift-fashion-bags': {
    name: 'Thrift Fashion Bags',
    slug: 'thrift-fashion-bags',
    description: 'Pre-owned luxury and designer bags',
    parent: 'fashion-bags',
    icon: '♻️',
  },
  'non-thrift-fashion-bags': {
    name: 'Non-Thrift Fashion Bags',
    slug: 'non-thrift-fashion-bags',
    description: 'New designer bags and contemporary styles',
    parent: 'fashion-bags',
    icon: '✨',
  },
  'jewelry': {
    name: 'Jewelry',
    slug: 'jewelry',
    description: 'Beautiful jewelry collection',
    icon: '💎',
    is_featured: true,
  },
  'necklaces': {
    name: 'Necklaces',
    slug: 'necklaces',
    description: 'Elegant necklaces for every occasion',
    parent: 'jewelry',
  },
  'earrings': {
    name: 'Earrings',
    slug: 'earrings',
    description: 'Stunning earrings collection',
    parent: 'jewelry',
  },
  'rings': {
    name: 'Rings',
    slug: 'rings',
    description: 'Beautiful rings collection',
    parent: 'jewelry',
  },
  'bracelets': {
    name: 'Bracelets',
    slug: 'bracelets',
    description: 'Stylish bracelets and bangles',
    parent: 'jewelry',
  },
  'african-jewelry': {
    name: 'African Jewelry',
    slug: 'african-jewelry',
    description: 'Traditional African jewelry pieces',
    parent: 'jewelry',
  },
  'fragrances': {
    name: 'Fragrances',
    slug: 'fragrances',
    description: 'Premium fragrances for men and women',
    icon: '🌸',
    is_featured: true,
  },
  'mens-fragrances': {
    name: "Men's Fragrances",
    slug: 'mens-fragrances',
    description: 'Cologne, eau de toilette, and aftershave for men',
    parent: 'fragrances',
  },
  'womens-fragrances': {
    name: "Women's Fragrances",
    slug: 'womens-fragrances',
    description: 'Perfume, eau de parfum, and body mist for women',
    parent: 'fragrances',
  },
};

// ===============================
// RE-EXPORTS FOR CONVENIENCE
// ===============================

// Re-export commonly used HttpTypes for easy access
export type StoreProduct = HttpTypes.StoreProduct;
export type StoreProductVariant = HttpTypes.StoreProductVariant;
export type StoreCart = HttpTypes.StoreCart;
export type StoreCartLineItem = HttpTypes.StoreCartLineItem;
export type StoreRegion = HttpTypes.StoreRegion;
export type StoreCustomer = HttpTypes.StoreCustomer;
export type StoreOrder = HttpTypes.StoreOrder;
export type StoreShippingOption = HttpTypes.StoreShippingOption;
export type StoreProductCategory = HttpTypes.StoreProductCategory;