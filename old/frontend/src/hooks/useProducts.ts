/**
 * Product Data Hooks for Rebbie's Store
 * Manages product fetching, filtering, and state
 */

import { useState, useEffect, useCallback } from 'react';
import { getProducts, getProduct, getProductsByCategory, searchProducts } from '@/lib/medusa';
import { RebbieProduct, SearchResults, ProductFilters, CategorySlug } from '@/lib/types';

// ===============================
// PRODUCTS LIST HOOK
// ===============================

interface UseProductsOptions {
  limit?: number;
  initialLoad?: boolean;
  category?: string;
  filters?: ProductFilters;
  currency?: string;
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const {
    limit = 20,
    initialLoad = true,
    category,
    filters,
    currency = 'NGN'
  } = options;

  const [products, setProducts] = useState<RebbieProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

  // Fetch products function
  const fetchProducts = useCallback(async (reset = false) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const currentOffset = reset ? 0 : offset;
      
      let result;
      if (category) {
        result = await getProductsByCategory(category, {
          limit,
          offset: currentOffset,
          currency_code: currency,
        });
      } else {
        result = await getProducts({
          limit,
          offset: currentOffset,
          currency_code: currency,
          category_id: filters?.categories,
          tags: filters?.tags,
        });
      }

      const newProducts = result.products as RebbieProduct[];
      
      if (reset) {
        setProducts(newProducts);
        setOffset(limit);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
        setOffset(prev => prev + limit);
      }

      setTotal(result.count);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [limit, offset, category, filters, currency, loading]);

  // Load more products
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchProducts(false);
    }
  }, [fetchProducts, loading, hasMore]);

  // Reset and refetch
  const refetch = useCallback(() => {
    setOffset(0);
    fetchProducts(true);
  }, [fetchProducts]);

  // Apply filters
  const applyFilters = useCallback((newFilters: ProductFilters) => {
    setOffset(0);
    // Update filters and refetch
    fetchProducts(true);
  }, [fetchProducts]);

  // Initial load
  useEffect(() => {
    if (initialLoad) {
      fetchProducts(true);
    }
  }, [category, currency]); // Refetch when category or currency changes

  return {
    products,
    loading,
    error,
    hasMore,
    total,
    loadMore,
    refetch,
    applyFilters,
  };
};

// ===============================
// SINGLE PRODUCT HOOK
// ===============================

export const useProduct = (handle: string, currency: string = 'NGN') => {
  const [product, setProduct] = useState<RebbieProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!handle) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getProduct(handle, currency);
      setProduct(result as RebbieProduct);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch product');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  }, [handle, currency]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
};

// ===============================
// FEATURED PRODUCTS HOOK
// ===============================

export const useFeaturedProducts = (limit: number = 8, currency: string = 'NGN') => {
  const [featuredProducts, setFeaturedProducts] = useState<RebbieProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // For now, get recent products. Later, add featured tags or collections
      const result = await getProducts({
        limit,
        currency_code: currency,
        // Add featured tag filter when available
        // tags: ['featured']
      });

      setFeaturedProducts(result.products as RebbieProduct[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch featured products');
      console.error('Error fetching featured products:', err);
    } finally {
      setLoading(false);
    }
  }, [limit, currency]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return {
    featuredProducts,
    loading,
    error,
    refetch: fetchFeaturedProducts,
  };
};

// ===============================
// PRODUCT SEARCH HOOK
// ===============================

export const useProductSearch = () => {
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const search = useCallback(async (
    query: string,
    filters?: ProductFilters,
    options?: { limit?: number; offset?: number; currency?: string }
  ) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    setLoading(true);
    setError(null);
    setSearchQuery(query);

    try {
      const result = await searchProducts(query, {
        limit: options?.limit || 20,
        offset: options?.offset || 0,
        currency_code: options?.currency || 'NGN',
        category_id: filters?.categories,
        tags: filters?.tags,
      });

      const searchResults: SearchResults = {
        ...result,
        products: result.products as RebbieProduct[],
        filters_applied: filters,
      };

      setSearchResults(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      console.error('Error searching products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults(null);
    setSearchQuery('');
    setError(null);
  }, []);

  return {
    searchResults,
    loading,
    error,
    searchQuery,
    search,
    clearSearch,
  };
};

// ===============================
// CATEGORY PRODUCTS HOOK
// ===============================

export const useCategoryProducts = (
  categorySlug: CategorySlug,
  options?: { limit?: number; currency?: string }
) => {
  const [categoryProducts, setCategoryProducts] = useState<RebbieProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const limit = options?.limit || 20;
  const currency = options?.currency || 'NGN';

  const fetchCategoryProducts = useCallback(async (reset = false) => {
    if (loading && !reset) return;

    setLoading(true);
    setError(null);

    try {
      const currentOffset = reset ? 0 : offset;
      
      // Note: You'll need to implement category ID lookup
      // For now, using category name as filter
      const result = await getProducts({
        limit,
        offset: currentOffset,
        currency_code: currency,
        // This would need category ID mapping
        // category_id: [categoryId],
      });

      const newProducts = result.products as RebbieProduct[];
      
      if (reset) {
        setCategoryProducts(newProducts);
        setOffset(limit);
      } else {
        setCategoryProducts(prev => [...prev, ...newProducts]);
        setOffset(prev => prev + limit);
      }

      setHasMore(result.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch category products');
      console.error('Error fetching category products:', err);
    } finally {
      setLoading(false);
    }
  }, [categorySlug, limit, currency, offset, loading]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchCategoryProducts(false);
    }
  }, [fetchCategoryProducts, loading, hasMore]);

  const refetch = useCallback(() => {
    setOffset(0);
    fetchCategoryProducts(true);
  }, [fetchCategoryProducts]);

  useEffect(() => {
    fetchCategoryProducts(true);
  }, [categorySlug, currency]);

  return {
    categoryProducts,
    loading,
    error,
    hasMore,
    loadMore,
    refetch,
  };
};

// ===============================
// PRODUCT RECOMMENDATIONS HOOK
// ===============================

export const useProductRecommendations = (
  productId: string,
  limit: number = 4,
  currency: string = 'NGN'
) => {
  const [recommendations, setRecommendations] = useState<RebbieProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    if (!productId) return;

    setLoading(true);
    setError(null);

    try {
      // For now, get random products from same category
      // Later, implement proper recommendation logic
      const result = await getProducts({
        limit,
        currency_code: currency,
      });

      // Filter out the current product
      const filtered = result.products.filter(p => p.id !== productId);
      setRecommendations(filtered.slice(0, limit) as RebbieProduct[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  }, [productId, limit, currency]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return {
    recommendations,
    loading,
    error,
    refetch: fetchRecommendations,
  };
};