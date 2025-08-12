'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { clsx } from 'clsx';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { useProducts, useProductSearch } from '@/hooks/useProducts';
import { RebbieProduct, ProductFilters, PRODUCT_CATEGORIES } from '@/lib/types';
import { formatPrice } from '@/lib/medusa';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  XMarkIcon,
  ChevronDownIcon,
  StarIcon,
  HeartIcon,
  ShoppingBagIcon,
  EyeIcon,
  AdjustmentsHorizontalIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

// ===============================
// ADVANCED FILTER SIDEBAR
// ===============================

interface FilterSidebarProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFiltersChange,
  isOpen,
  onClose,
  className,
}) => {
  const [priceRange, setPriceRange] = useState({
    min: filters.price_range?.min || '',
    max: filters.price_range?.max || ''
  });

  const categories = Object.values(PRODUCT_CATEGORIES);
  const mainCategories = categories.filter(cat => !cat.parent);

  const updateFilter = (key: keyof ProductFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handlePriceRangeChange = (type: 'min' | 'max', value: string) => {
    const newRange = { ...priceRange, [type]: value };
    setPriceRange(newRange);
    
    updateFilter('price_range', {
      min: Number(newRange.min) || 0,
      max: Number(newRange.max) || 1000000,
    });
  };

  const clearFilters = () => {
    setPriceRange({ min: '', max: '' });
    onFiltersChange({});
  };

  const filterSections = [
    {
      title: 'Categories',
      content: (
        <div className="space-y-3">
          {mainCategories.map(category => (
            <label key={category.slug} className="flex items-center group cursor-pointer">
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
                className="rounded border-neutral-300 text-rebbie-600 focus:ring-rebbie-500"
              />
              <span className="ml-3 text-sm text-neutral-700 group-hover:text-rebbie-600 transition-colors">
                {category.name}
              </span>
              <span className="ml-auto text-xs text-neutral-400">
                {/* In production, show actual count */}
                42
              </span>
            </label>
          ))}
        </div>
      )
    },
    {
      title: 'Price Range (NGN)',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => handlePriceRangeChange('min', e.target.value)}
              size="sm"
            />
            <Input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => handlePriceRangeChange('max', e.target.value)}
              size="sm"
            />
          </div>
          
          {/* Quick price filters */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Under ₦50K', max: 50000 },
              { label: '₦50K - ₦100K', min: 50000, max: 100000 },
              { label: '₦100K - ₦300K', min: 100000, max: 300000 },
              { label: 'Over ₦300K', min: 300000 },
            ].map((range, index) => (
              <button
                key={index}
                onClick={() => {
                  setPriceRange({ 
                    min: range.min?.toString() || '', 
                    max: range.max?.toString() || '' 
                  });
                  updateFilter('price_range', range);
                }}
                className="text-xs px-3 py-2 border border-neutral-200 rounded-md hover:border-rebbie-600 hover:text-rebbie-600 transition-colors"
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Condition',
      content: (
        <div className="space-y-3">
          {['New', 'Excellent', 'Very Good', 'Good'].map(condition => (
            <label key={condition} className="flex items-center group cursor-pointer">
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
                className="rounded border-neutral-300 text-rebbie-600 focus:ring-rebbie-500"
              />
              <span className="ml-3 text-sm text-neutral-700 group-hover:text-rebbie-600 transition-colors">
                {condition}
              </span>
            </label>
          ))}
        </div>
      )
    },
    {
      title: 'Special Offers',
      content: (
        <div className="space-y-3">
          <label className="flex items-center group cursor-pointer">
            <input
              type="checkbox"
              checked={filters.is_thrift || false}
              onChange={(e) => updateFilter('is_thrift', e.target.checked)}
              className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="ml-3 text-sm text-neutral-700 group-hover:text-emerald-600 transition-colors">
              ♻️ Thrift Items Only
            </span>
          </label>
          
          <label className="flex items-center group cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-neutral-300 text-red-600 focus:ring-red-500"
            />
            <span className="ml-3 text-sm text-neutral-700 group-hover:text-red-600 transition-colors">
              🏷️ On Sale
            </span>
          </label>
          
          <label className="flex items-center group cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-3 text-sm text-neutral-700 group-hover:text-blue-600 transition-colors">
              ⚡ New Arrivals
            </span>
          </label>
        </div>
      )
    },
    {
      title: 'Rating',
      content: (
        <div className="space-y-3">
          {[5, 4, 3].map(rating => (
            <label key={rating} className="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-neutral-300 text-rebbie-600 focus:ring-rebbie-500"
              />
              <div className="ml-3 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={clsx(
                      'w-4 h-4',
                      i < rating ? 'text-yellow-400 fill-current' : 'text-neutral-300'
                    )}
                  />
                ))}
                <span className="ml-1 text-sm text-neutral-600">& Up</span>
              </div>
            </label>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className={clsx(
      'fixed lg:relative top-0 left-0 h-full w-80 bg-white z-40 transform transition-transform duration-300 shadow-xl lg:shadow-none border-r border-neutral-200',
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      className
    )}>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-neutral-200">
        <h3 className="font-semibold text-neutral-900">Filters</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Content */}
      <div className="h-full overflow-y-auto p-6">
        {/* Header */}
        <div className="hidden lg:flex items-center justify-between mb-6">
          <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
            <FunnelIcon className="w-5 h-5" />
            Filters
          </h3>
          <button
            onClick={clearFilters}
            className="text-sm text-rebbie-600 hover:text-rebbie-700 font-medium"
          >
            Clear All
          </button>
        </div>

        {/* Filter Sections */}
        <div className="space-y-8">
          {filterSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-medium text-neutral-900 mb-4 flex items-center gap-2">
                {section.title}
                <ChevronDownIcon className="w-4 h-4" />
              </h4>
              {section.content}
            </div>
          ))}
        </div>

        {/* Apply Filters Button (Mobile) */}
        <div className="lg:hidden mt-8 pt-6 border-t border-neutral-200">
          <Button fullWidth onClick={onClose}>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

// ===============================
// ENHANCED PRODUCT CARD
// ===============================

interface EnhancedProductCardProps {
  product: RebbieProduct;
  viewMode: 'grid' | 'list';
  onQuickView?: () => void;
  onWishlistToggle?: () => void;
  isWishlisted?: boolean;
}

const EnhancedProductCard: React.FC<EnhancedProductCardProps> = ({
  product,
  viewMode,
  onQuickView,
  onWishlistToggle,
  isWishlisted = false,
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = product.images || [];
  const primaryImage = images[currentImageIndex]?.url;
  const price = product.variants?.[0]?.prices?.[0]?.amount || 0;
  const formattedPrice = formatPrice(price, 'NGN');

  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="flex gap-6 p-6">
          {/* Product Image */}
          <div className="w-32 h-32 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0 relative group">
            {primaryImage ? (
              <img
                src={primaryImage}
                alt={product.title || 'Product'}
                className="w-full h-full object-cover"
                onLoad={() => setImageLoading(false)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400">
                <div className="text-center">
                  <div className="text-2xl mb-1">📦</div>
                  <div className="text-xs">No Image</div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={onWishlistToggle}
                className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md"
              >
                {isWishlisted ? (
                  <HeartSolidIcon className="w-3 h-3 text-red-500" />
                ) : (
                  <HeartIcon className="w-3 h-3 text-neutral-600" />
                )}
              </button>
              <button
                onClick={onQuickView}
                className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md"
              >
                <EyeIcon className="w-3 h-3 text-neutral-600" />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                {product.category_names && (
                  <p className="text-xs text-rebbie-600 font-medium uppercase tracking-wide mb-1">
                    {product.category_names[0]}
                  </p>
                )}
                <h3 className="font-semibold text-neutral-900 line-clamp-2 text-lg">
                  {product.title}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-neutral-900">
                  {formattedPrice}
                </div>
              </div>
            </div>

            <p className="text-neutral-600 text-sm line-clamp-2 mb-3">
              {product.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-sm text-neutral-500">(24)</span>
                </div>
              </div>

              <Button size="sm" rightIcon={<ShoppingBagIcon className="w-4 h-4" />}>
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Product Image */}
      <div className="aspect-square bg-neutral-100 relative overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.title || 'Product'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onLoad={() => setImageLoading(false)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            <div className="text-center">
              <div className="text-4xl mb-2">📦</div>
              <div className="text-sm">No Image</div>
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.is_thrift && (
            <span className="bg-emerald-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              ♻️ Thrift
            </span>
          )}
          {product.condition && product.condition !== 'New' && (
            <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {product.condition}
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={onWishlistToggle}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-neutral-50"
          >
            {isWishlisted ? (
              <HeartSolidIcon className="w-4 h-4 text-red-500" />
            ) : (
              <HeartIcon className="w-4 h-4 text-neutral-600" />
            )}
          </button>
          <button
            onClick={onQuickView}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-neutral-50"
          >
            <EyeIcon className="w-4 h-4 text-neutral-600" />
          </button>
        </div>

        {/* Add to Cart Overlay */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button className="w-full bg-rebbie-600 text-white py-3 px-4 font-medium hover:bg-rebbie-700 transition-colors flex items-center justify-center gap-2">
            <ShoppingBagIcon className="w-4 h-4" />
            Add to Cart
          </button>
        </div>

        {/* Image Navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {images.slice(0, 3).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={clsx(
                  'w-2 h-2 rounded-full transition-colors',
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {product.category_names && (
          <p className="text-xs text-rebbie-600 font-medium uppercase tracking-wide mb-1">
            {product.category_names[0]}
          </p>
        )}
        
        <h3 className="font-semibold text-neutral-900 line-clamp-2 mb-2 group-hover:text-rebbie-600 transition-colors">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className="w-3 h-3 text-yellow-400 fill-current" />
          ))}
          <span className="text-xs text-neutral-500 ml-1">(24)</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-neutral-900">
              {formattedPrice}
            </span>
          </div>

          <div className="w-8 h-8 bg-rebbie-100 text-rebbie-600 rounded-full flex items-center justify-center hover:bg-rebbie-600 hover:text-white transition-colors">
            <ShoppingBagIcon className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Card>
  );
};

// ===============================
// MAIN CATALOG COMPONENT
// ===============================

const ProductCatalogContent = () => {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<ProductFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [wishlistedItems, setWishlistedItems] = useState<string[]>([]);

  // Initialize from URL params
  useEffect(() => {
    const category = searchParams.get('category');
    const q = searchParams.get('q');
    
    if (category) {
      setFilters(prev => ({ ...prev, categories: [category] }));
    }
    if (q) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const {
    products,
    loading,
    error,
    hasMore,
    total,
    loadMore,
    applyFilters,
  } = useProducts({
    filters: { ...filters, sort_by: sortBy as any },
    limit: 20,
  });

  const {
    searchResults,
    loading: searchLoading,
    search,
    clearSearch,
  } = useProductSearch();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      search(query, filters);
    } else {
      clearSearch();
    }
  };

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleWishlistToggle = (productId: string) => {
    setWishlistedItems(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const currentProducts = searchResults ? searchResults.products : products;
  const isLoading = searchResults ? searchLoading : loading;
  const showingResults = searchResults ? searchResults.count : total;

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-neutral-50">
        {/* Page Header */}
        <div className="bg-white border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">
                  Product Catalog
                </h1>
                <p className="text-neutral-600 mt-2">
                  Discover our complete collection of luxury fashion items
                </p>
              </div>
              
              {/* Search Bar */}
              <div className="w-full lg:w-96">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
                  size="lg"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            
            {/* Filters Sidebar */}
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              isOpen={filtersOpen}
              onClose={() => setFiltersOpen(false)}
              className="hidden lg:block w-80 flex-shrink-0"
            />

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              
              {/* Toolbar */}
              <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-neutral-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setFiltersOpen(true)}
                      className="lg:hidden btn btn-outline btn-sm"
                    >
                      <AdjustmentsHorizontalIcon className="w-4 h-4 mr-2" />
                      Filters
                    </button>
                    
                    <div className="text-sm text-neutral-600">
                      {isLoading ? 'Loading...' : `${showingResults} products found`}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2">
                      <ArrowsUpDownIcon className="w-4 h-4 text-neutral-500" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="text-sm border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rebbie-500 focus:border-transparent"
                      >
                        <option value="created_at">Latest</option>
                        <option value="title">Name A-Z</option>
                        <option value="price_low_to_high">Price: Low to High</option>
                        <option value="price_high_to_low">Price: High to Low</option>
                        <option value="rating">Top Rated</option>
                      </select>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex border border-neutral-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={clsx(
                          'p-2 transition-colors',
                          viewMode === 'grid' 
                            ? 'bg-rebbie-600 text-white' 
                            : 'text-neutral-600 hover:bg-neutral-100'
                        )}
                      >
                        <Squares2X2Icon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={clsx(
                          'p-2 transition-colors',
                          viewMode === 'list' 
                            ? 'bg-rebbie-600 text-white' 
                            : 'text-neutral-600 hover:bg-neutral-100'
                        )}
                      >
                        <ListBulletIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error State */}
              {error && (
                <Card className="p-8 text-center">
                  <div className="text-red-600 mb-4">
                    <div className="text-4xl mb-2">⚠️</div>
                    <p className="font-medium">{error}</p>
                  </div>
                  <Button onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </Card>
              )}

              {/* Products Grid/List */}
              <div className={clsx(
                'grid gap-6',
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              )}>
                {currentProducts.map((product) => (
                  <EnhancedProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    isWishlisted={wishlistedItems.includes(product.id)}
                    onWishlistToggle={() => handleWishlistToggle(product.id)}
                  />
                ))}

                {/* Loading Skeletons */}
                {isLoading && (
                  Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="aspect-square bg-neutral-200" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-neutral-200 rounded w-3/4" />
                        <div className="h-3 bg-neutral-200 rounded w-1/2" />
                        <div className="h-4 bg-neutral-200 rounded w-1/3" />
                      </div>
                    </Card>
                  ))
                )}
              </div>

              {/* Load More */}
              {hasMore && !searchResults && (
                <div className="text-center mt-12">
                  <Button
                    onClick={loadMore}
                    disabled={loading}
                    size="lg"
                    variant="outline"
                  >
                    {loading ? 'Loading...' : 'Load More Products'}
                  </Button>
                </div>
              )}

              {/* No Results */}
              {!isLoading && currentProducts.length === 0 && (
                <Card className="p-16 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                    No Products Found
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    Try adjusting your search terms or filters
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({});
                      clearSearch();
                    }}
                  >
                    Clear Search & Filters
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Overlay */}
        {filtersOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div 
              className="flex-1 bg-black bg-opacity-50" 
              onClick={() => setFiltersOpen(false)} 
            />
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
// MAIN EXPORT WITH SUSPENSE
// ===============================

export default function ProductCatalogPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-rebbie-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-neutral-600">Loading catalog...</p>
          </div>
        </div>
      }
    >
      <ProductCatalogContent />
    </Suspense>
  );
}