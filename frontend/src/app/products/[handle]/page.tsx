/**
 * Product Detail Page for Rebbie's Store
 * Shows individual product with images, variants, and purchase options
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { ProductGrid } from '@/components/product/ProductCard';
import { useProduct, useProductRecommendations } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { toast } from '@/components/ui/Toast';
import { formatPrice } from '@/lib/medusa';
import { RebbieProductVariant } from '@/lib/types';
import {
  HeartIcon,
  ShareIcon,
  CheckIcon,
  TruckIcon,
  ShieldCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

// ===============================
// PRODUCT IMAGES GALLERY
// ===============================

interface ProductImagesProps {
  images: Array<{ url: string; alt?: string }>;
  productTitle: string;
}

const ProductImages: React.FC<ProductImagesProps> = ({ images, productTitle }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
    setImageLoading(true);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
    setImageLoading(true);
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-6xl mb-4">📦</div>
          <p>No Image Available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
        <Image
          src={images[selectedImage].url}
          alt={images[selectedImage].alt || productTitle}
          fill
          className={`object-cover transition-opacity duration-300 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setImageLoading(false)}
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Loading overlay */}
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image indicator dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedImage(index);
                  setImageLoading(true);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === selectedImage ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.slice(0, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedImage(index);
                setImageLoading(true);
              }}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                index === selectedImage ? 'border-rebbie-purple-600' : 'border-gray-200'
              }`}
            >
              <Image
                src={image.url}
                alt={`${productTitle} - view ${index + 1}`}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ===============================
// VARIANT SELECTOR
// ===============================

interface VariantSelectorProps {
  variants: RebbieProductVariant[];
  selectedVariant: RebbieProductVariant | null;
  onVariantChange: (variant: RebbieProductVariant) => void;
  currency: string;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants,
  selectedVariant,
  onVariantChange,
  currency,
}) => {
  if (!variants || variants.length <= 1) return null;

  // Group variants by option types
  const variantOptions = variants.reduce((acc, variant) => {
    if (variant.options) {
      Object.entries(variant.options).forEach(([key, value]) => {
        if (!acc[key]) acc[key] = new Set();
        acc[key].add(value);
      });
    }
    return acc;
  }, {} as Record<string, Set<string>>);

  const handleOptionChange = (optionType: string, optionValue: string) => {
    const newVariant = variants.find(variant => 
      variant.options?.[optionType] === optionValue
    );
    if (newVariant) {
      onVariantChange(newVariant);
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(variantOptions).map(([optionType, values]) => (
        <div key={optionType}>
          <h4 className="font-medium text-gray-900 mb-3">{optionType}</h4>
          <div className="flex flex-wrap gap-2">
            {Array.from(values).map((value) => {
              const isSelected = selectedVariant?.options?.[optionType] === value;
              return (
                <button
                  key={value}
                  onClick={() => handleOptionChange(optionType, value)}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                    isSelected
                      ? 'border-rebbie-purple-600 bg-rebbie-purple-600 text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-rebbie-purple-600'
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// ===============================
// MAIN PRODUCT DETAIL COMPONENT
// ===============================

export default function ProductDetailPage() {
  const params = useParams();
  const handle = params.handle as string;
  
  const [selectedVariant, setSelectedVariant] = useState<RebbieProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currency, setCurrency] = useState('NGN');

  const { product, loading, error } = useProduct(handle, currency);
  const { recommendations } = useProductRecommendations(product?.id || '', 4, currency);
  const { addItem, loading: addingToCart } = useCart();

  // Set default variant when product loads
  useEffect(() => {
    if (product?.variants && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0] as RebbieProductVariant);
    }
  }, [product, selectedVariant]);

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.warning('Please select a variant');
      return;
    }

    try {
      await addItem(selectedVariant, quantity);
      toast.cartAdded(product?.title || 'Product');
    } catch (error) {
      toast.error('Failed to add to cart', 'Please try again');
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    toast.info(
      isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      product?.title
    );
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: product?.description,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copy link
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  // Get current price
  const getCurrentPrice = () => {
    if (!selectedVariant?.prices) return 0;
    const price = selectedVariant.prices.find(p => 
      p.currency_code?.toLowerCase() === currency.toLowerCase()
    );
    return price?.amount || 0;
  };

  const currentPrice = getCurrentPrice();
  const formattedPrice = formatPrice(currentPrice, currency);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-rebbie-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading product...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
            <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
            <Link href="/products" className="btn-base btn-primary">
              Browse Products
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const productImages = product.images?.map(img => ({ url: img.url, alt: img.alt })) || [];

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="text-sm text-gray-500">
              <Link href="/" className="hover:text-rebbie-purple-600">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/products" className="hover:text-rebbie-purple-600">Products</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{product.title}</span>
            </nav>
          </div>
        </div>

        {/* Product Detail */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <ProductImages images={productImages} productTitle={product.title || ''} />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category */}
              {product.category_names && product.category_names.length > 0 && (
                <p className="text-sm text-rebbie-purple-600 font-medium uppercase tracking-wide">
                  {product.category_names.join(' • ')}
                </p>
              )}

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>

              {/* Rating (placeholder) */}
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(24 reviews)</span>
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-gray-900">
                {formattedPrice}
                {product.variants && product.variants.length > 1 && (
                  <span className="text-base text-gray-500 ml-2">
                    ({product.variants.length} variants)
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="prose prose-sm text-gray-600">
                  <p>{product.description}</p>
                </div>
              )}

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {product.is_thrift && (
                  <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                    ♻️ Thrift Item
                  </span>
                )}
                {product.condition && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                    Condition: {product.condition}
                  </span>
                )}
              </div>

              {/* Variant Selector */}
              {product.variants && (
                <VariantSelector
                  variants={product.variants as RebbieProductVariant[]}
                  selectedVariant={selectedVariant}
                  onVariantChange={setSelectedVariant}
                  currency={currency}
                />
              )}

              {/* Quantity Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg w-32">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center py-2 border-l border-r border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || addingToCart}
                  className="w-full btn-base btn-primary py-4 text-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {addingToCart ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding to Cart...
                    </div>
                  ) : (
                    'Add to Cart'
                  )}
                </button>

                <div className="flex gap-4">
                  <button
                    onClick={handleWishlistToggle}
                    className="flex-1 btn-base btn-outline flex items-center justify-center gap-2"
                  >
                    {isWishlisted ? (
                      <HeartSolidIcon className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5" />
                    )}
                    {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                  </button>

                  <button
                    onClick={handleShare}
                    className="btn-base btn-outline px-6 flex items-center gap-2"
                  >
                    <ShareIcon className="w-5 h-5" />
                    Share
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="border-t pt-6 space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <TruckIcon className="w-5 h-5 text-green-600" />
                  <span>Same-day delivery in Lagos • Nationwide shipping available</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
                  <span>100% authentic products • 30-day return policy</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckIcon className="w-5 h-5 text-purple-600" />
                  <span>Secure payment with Paystack • WhatsApp support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
              <ProductGrid
                products={recommendations}
                className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              />
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}