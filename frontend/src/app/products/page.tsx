'use client';

import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { ProductGrid, ProductCardSkeleton } from '@/components/product/ProductCard';
import { useProducts, useProductSearch } from '@/hooks/useProducts';
import { RebbieProduct, ProductFilters, PRODUCT_CATEGORIES } from '@/lib/types';
import { MagnifyingGlassIcon, FunnelIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';

// ===============================
// FILTER SIDEBAR COMPONENT
// ===============================

interface FilterSidebarProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  isOpen: boolean;
  onClose: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFiltersChange,
  isOpen,
  onClose,
}) => {
  const categories = Object.values(PRODUCT_CATEGORIES);
  const mainCategories = categories.filter(cat => !cat.parent);

  const updateFilter = (key: keyof ProductFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className={`
      fixed lg:relative top-0 left-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 shadow-lg lg:shadow-none
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* Mobile Close Button */}
      <div className="lg:hidden flex justify-between items-center p-4 border-b">
        <h3 className="font-semibold">Filters</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <div className="p-6 overflow-y-auto h-full">
        <h3 className="hidden lg:block font-semibold mb-6">Filter Products</h3>

        {/* Categories Filter */}
        <div className="mb-8">
          <h4 className="font-medium mb-4">Categories</h4>
          <div className="space-y-2">
            {mainCategories.map(category => (
              <label key={category.slug} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.categories?.includes(category.slug) || false}
                  onChange={(e) => {
                    const currentCategories = filters.categories || [];
                    const newCategories = e.target.checked
                      ? [...currentCategories, category.slug]
                      : currentCategories.filter(c => c !== category.slug);
                    updateFilter('categories', newCategories);
                  }}
                  className="rounded border-gray-300 text-rebbie-purple-600 focus:ring-rebbie-purple-500"
                />
                <span className="ml-2 text-sm">{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="mb-8">
          <h4 className="font-medium mb-4">Price Range (NGN)</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Min Price</label>
              <input
                type="number"
                placeholder="0"
                value={filters.price_range?.min || ''}
                onChange={(e) => updateFilter('price_range', {
                  ...filters.price_range,
                  min: Number(e.target.value),
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rebbie-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Max Price</label>
              <input
                type="number"
                placeholder="1000000"
                value={filters.price_range?.max || ''}
                onChange={(e) => updateFilter('price_range', {
                  ...filters.price_range,
                  max: Number(e.target.value),
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rebbie-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Condition Filter */}
        <div className="mb-8">
          <h4 className="font-medium mb-4">Condition</h4>
          <div className="space-y-2">
            {['New', 'Excellent', 'Very Good', 'Good'].map(condition => (
              <label key={condition} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.condition?.includes(condition) || false}
                  onChange={(e) => {
                    const currentConditions = filters.condition || [];
                    const newConditions = e.target.checked
                      ? [...currentConditions, condition]
                      : currentConditions.filter(c => c !== condition);
                    updateFilter('condition', newConditions);
                  }}
                  className="rounded border-gray-300 text-rebbie-purple-600 focus:ring-rebbie-purple-500"
                />
                <span className="ml-2 text-sm">{condition}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Thrift Toggle */}
        <div className="mb-8">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.is_thrift || false}
              onChange={(e) => updateFilter('is_thrift', e.target.checked)}
              className="rounded border-gray-300 text-rebbie-purple-600 focus:ring-rebbie-purple-500"
            />
            <span className="ml-2 text-sm font-medium">Thrift Items Only</span>
          </label>
        </div>

        {/* Clear Filters */}
        <button
          onClick={() => onFiltersChange({})}
          className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

// ===============================
// PRODUCTS PAGE CONTENT
// ===============================

const ProductsPageContent = () => {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<ProductFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Initialize from URL params
  useEffect(() => {
    const category = searchParams.get('category');
    const q = searchParams.get('q');
    
    if (category) {
      setFilters(prev => ({
        ...prev,
        categories: [category],
      }));
    }
    
    if (q) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Use products hook
  const {
    products,
    loading,
    error,
    hasMore,
    total,
    loadMore,
    applyFilters,
  } = useProducts({
    filters: {
      ...filters,
      sort_by: sortBy as any,
    },
    limit: 20,
  });

  // Use search hook
  const {
    searchResults,
    loading: searchLoading,
    search,
    clearSearch,
  } = useProductSearch();

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      search(query, filters);
    } else {
      clearSearch();
    }
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  // Get current products to display
  const currentProducts = searchResults ? searchResults.products : products;
  const isLoading = searchResults ? searchLoading : loading;
  const showingResults = searchResults ? searchResults.count : total;

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-purple text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">
                Shop Our Collection
              </h1>
              <p className="text-xl text-purple-100 mb-8">
                Discover amazing fashion bags, jewelry, and fragrances
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:border-transparent"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <FilterSidebar
                filters={filters}
                onFiltersChange={handleFiltersChange}
                isOpen={true}
                onClose={() => {}}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setFiltersOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <FunnelIcon className="w-4 h-4" />
                    Filters
                  </button>
                  
                  <div className="text-sm text-gray-600">
                    {isLoading ? 'Loading...' : `${showingResults} products found`}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rebbie-purple-500"
                  >
                    <option value="created_at">Newest First</option>
                    <option value="title">Name A-Z</option>
                    <option value="price_low_to_high">Price: Low to High</option>
                    <option value="price_high_to_low">Price: High to Low</option>
                  </select>

                  {/* View Mode Toggle */}
                  <div className="flex border border-gray-300 rounded-md overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-rebbie-purple-600 text-white' : 'text-gray-600'}`}
                    >
                      <Squares2X2Icon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-rebbie-purple-600 text-white' : 'text-gray-600'}`}
                    >
                      <ListBulletIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              {/* Products Grid */}
              <ProductGrid
                products={currentProducts}
                loading={isLoading}
                className={viewMode === 'grid' ? '' : 'grid-cols-1 gap-4'}
              />

              {/* Load More Button */}
              {hasMore && !searchResults && (
                <div className="text-center mt-12">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="btn-base btn-outline px-8 py-3"
                  >
                    {loading ? 'Loading...' : 'Load More Products'}
                  </button>
                </div>
              )}

              {/* No Results */}
              {!isLoading && currentProducts.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Products Found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search terms or filters
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({});
                      clearSearch();
                    }}
                    className="btn-base btn-primary"
                  >
                    Clear Search & Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Sidebar */}
        {filtersOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black bg-opacity-50" onClick={() => setFiltersOpen(false)} />
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              isOpen={filtersOpen}
              onClose={() => setFiltersOpen(false)}
            />
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

// ===============================
// MAIN PRODUCTS PAGE
// ===============================

export default function ProductsPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-rebbie-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}