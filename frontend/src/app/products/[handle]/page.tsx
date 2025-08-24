'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { clsx } from 'clsx';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useProduct, useProductRecommendations } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/Toast';
import { formatPrice } from '@/lib/medusa';
import { RebbieProductVariant } from '@/lib/types';
import {
  HeartIcon,
  ShareIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassPlusIcon,
  TruckIcon,
  ShieldCheckIcon,
  CheckIcon,
  ClockIcon,
  PhoneIcon,
  CreditCardIcon,
  ArrowLeftIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

// ===============================
// PRODUCT IMAGE GALLERY
// ===============================

interface ProductGalleryProps {
  images: Array<{ url: string; alt?: string }>;
  productTitle: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productTitle }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
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
      <div className="flex items-center justify-center aspect-square bg-neutral-100 rounded-2xl">
        <div className="text-center text-neutral-400">
          <div className="mb-4 text-8xl">📦</div>
          <p className="text-lg">No Images Available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative">
        <div className="relative overflow-hidden aspect-square bg-neutral-100 rounded-2xl group">
          <Image
            src={images[selectedImage].url}
            alt={images[selectedImage].alt || productTitle}
            fill
            className={clsx(
              'object-cover transition-all duration-500',
              imageLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100',
              'hover:scale-110 cursor-zoom-in'
            )}
            onLoad={() => setImageLoading(false)}
            onClick={() => setIsZoomed(true)}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          {/* Loading overlay */}
          {imageLoading && (
            <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
          )}

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute flex items-center justify-center w-12 h-12 transition-all -translate-y-1/2 rounded-full shadow-lg opacity-0 left-4 top-1/2 bg-white/90 backdrop-blur-sm group-hover:opacity-100 hover:bg-white"
              >
                <ChevronLeftIcon className="w-6 h-6 text-neutral-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute flex items-center justify-center w-12 h-12 transition-all -translate-y-1/2 rounded-full shadow-lg opacity-0 right-4 top-1/2 bg-white/90 backdrop-blur-sm group-hover:opacity-100 hover:bg-white"
              >
                <ChevronRightIcon className="w-6 h-6 text-neutral-700" />
              </button>
            </>
          )}

          {/* Zoom indicator */}
          <div className="absolute transition-opacity opacity-0 top-4 right-4 group-hover:opacity-100">
            <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-white/90 backdrop-blur-sm text-neutral-700">
              <MagnifyingGlassPlusIcon className="w-4 h-4" />
              Click to zoom
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.slice(0, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedImage(index);
                setImageLoading(true);
              }}
              className={clsx(
                'aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105',
                index === selectedImage ? 'border-rebbie-600' : 'border-neutral-200'
              )}
            >
              <Image
                src={image.url}
                alt={`${productTitle} - view ${index + 1}`}
                width={100}
                height={100}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {isZoomed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={images[selectedImage].url}
              alt={images[selectedImage].alt || productTitle}
              width={800}
              height={800}
              className="object-contain max-w-full max-h-full"
            />
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute flex items-center justify-center w-10 h-10 bg-white rounded-full top-4 right-4 hover:bg-neutral-100"
            >
              ✕
            </button>
          </div>
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
          <h4 className="mb-3 font-medium capitalize text-neutral-900">
            {optionType}: <span className="text-rebbie-600">{selectedVariant?.options?.[optionType]}</span>
          </h4>
          <div className="flex flex-wrap gap-3">
            {Array.from(values).map((value) => {
              const isSelected = selectedVariant?.options?.[optionType] === value;
              const variant = variants.find(v => v.options?.[optionType] === value);
              const isAvailable = variant?.inventory_quantity > 0;
              
              return (
                <button
                  key={value}
                  onClick={() => isAvailable && handleOptionChange(optionType, value)}
                  disabled={!isAvailable}
                  className={clsx(
                    'px-4 py-3 border-2 rounded-xl text-sm font-medium transition-all hover:scale-105',
                    isSelected
                      ? 'border-rebbie-600 bg-rebbie-600 text-white shadow-rebbie-sm'
                      : isAvailable
                        ? 'border-neutral-300 bg-white text-neutral-700 hover:border-rebbie-600'
                        : 'border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed',
                    !isAvailable && 'opacity-60'
                  )}
                >
                  {value}
                  {!isAvailable && (
                    <span className="block mt-1 text-xs">Out of stock</span>
                  )}
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
// PRODUCT REVIEWS SECTION
// ===============================

const ProductReviews: React.FC<{ productId: string }> = ({ productId }) => {
  const reviews = [
    {
      id: '1',
      author: 'Adunni O.',
      rating: 5,
      date: '2024-01-15',
      comment: 'Absolutely love this bag! The quality is exceptional and it arrived exactly as described. Same-day delivery in Lagos was perfect.',
      verified: true,
      helpful: 12
    },
    {
      id: '2',
      author: 'Kemi A.',
      rating: 5,
      date: '2024-01-10',
      comment: 'Beautiful piece! The authentication certificate gave me confidence. Will definitely shop again.',
      verified: true,
      helpful: 8
    },
    {
      id: '3',
      author: 'Funmi W.',
      rating: 4,
      date: '2024-01-05',
      comment: 'Great quality and fast shipping to Port Harcourt. Only minor issue was packaging could be better.',
      verified: true,
      helpful: 5
    }
  ];

  const averageRating = 4.8;
  const totalReviews = 24;

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="flex items-center gap-8">
        <div className="text-center">
          <div className="mb-1 text-4xl font-bold text-neutral-900">{averageRating}</div>
          <div className="flex items-center justify-center mb-1">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
          </div>
          <div className="text-sm text-neutral-600">{totalReviews} reviews</div>
        </div>

        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map(stars => (
            <div key={stars} className="flex items-center gap-3">
              <span className="w-8 text-sm">{stars}★</span>
              <div className="flex-1 h-2 rounded-full bg-neutral-200">
                <div 
                  className="h-2 bg-yellow-400 rounded-full"
                  style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : 5}%` }}
                />
              </div>
              <span className="w-8 text-sm text-neutral-600">
                {stars === 5 ? 17 : stars === 4 ? 5 : 2}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-6">
        {reviews.map(review => (
          <div key={review.id} className="pb-6 border-b border-neutral-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 font-bold text-white rounded-full bg-rebbie-600">
                  {review.author.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{review.author}</span>
                    {review.verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i} 
                          className={clsx(
                            'w-4 h-4',
                            i < review.rating ? 'text-yellow-400 fill-current' : 'text-neutral-300'
                          )} 
                        />
                      ))}
                    </div>
                    <span>•</span>
                    <span>{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="mb-3 text-neutral-700">{review.comment}</p>
            
            <div className="flex items-center gap-4 text-sm text-neutral-600">
              <button className="hover:text-rebbie-600">👍 Helpful ({review.helpful})</button>
              <button className="hover:text-rebbie-600">Reply</button>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" fullWidth>
        View All Reviews ({totalReviews})
      </Button>
    </div>
  );
};

// ===============================
// MAIN PRODUCT DETAILS PAGE
// ===============================

export default function ProductDetailsPage() {
  const params = useParams();
  const handle = params.handle as string;
  
  const [selectedVariant, setSelectedVariant] = useState<RebbieProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currency, setCurrency] = useState('NGN');
  const [activeTab, setActiveTab] = useState('description');

  const { product, loading, error: productError } = useProduct(handle, currency);
  const { recommendations } = useProductRecommendations(product?.id || '', 4, currency);
  const { addItem, loading: addingToCart } = useCart();
  const { success, error, warning, info, cartAdded } = useToast();

  // Set default variant when product loads
  useEffect(() => {
    if (product?.variants && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0] as RebbieProductVariant);
    }
  }, [product, selectedVariant]);

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      warning('Please select a variant');
      return;
    }

    try {
      await addItem(selectedVariant, quantity);
      cartAdded(product?.title || 'Product');
    } catch (err) {
      error('Failed to add to cart', 'Please try again');
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    info(
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
        navigator.clipboard.writeText(window.location.href);
        success('Link copied to clipboard');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      success('Link copied to clipboard');
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
        <main className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 rounded-full border-rebbie-600 border-t-transparent animate-spin" />
            <p className="text-neutral-600">Loading product...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (productError || !product) {
    return (
      <>
        <Header />
        <main className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="mb-6 text-8xl">😞</div>
            <h1 className="mb-4 text-3xl font-bold text-neutral-900">Product Not Found</h1>
            <p className="max-w-md mb-8 text-neutral-600">
              The product you're looking for doesn't exist or may have been removed.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/products">
                <Button>Browse Products</Button>
              </Link>
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
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
        <div className="py-4 bg-neutral-50">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-neutral-500">
              <Link href="/" className="hover:text-rebbie-600">Home</Link>
              <span>/</span>
              <Link href="/products" className="hover:text-rebbie-600">Products</Link>
              {product.category_names && product.category_names.length > 0 && (
                <>
                  <span>/</span>
                  <Link href={`/products?category=${product.category_names[0]}`} className="hover:text-rebbie-600">
                    {product.category_names[0]}
                  </Link>
                </>
              )}
              <span>/</span>
              <span className="font-medium text-neutral-900 line-clamp-1">{product.title}</span>
            </nav>
          </div>
        </div>

        {/* Product Detail */}
        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            
            {/* Product Images */}
            <div>
              <ProductGallery images={productImages} productTitle={product.title || ''} />
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              {/* Category */}
              {product.category_names && product.category_names.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.category_names.map(category => (
                    <span key={category} className="px-3 py-1 text-sm font-medium rounded-full bg-rebbie-100 text-rebbie-800">
                      {category}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <div>
                <h1 className="mb-4 text-4xl font-bold text-neutral-900">{product.title}</h1>
                
                {/* Rating */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                    <span className="ml-2 text-neutral-600">(24 reviews)</span>
                  </div>
                  <span className="text-neutral-300">•</span>
                  <span className="text-sm font-medium text-green-600">✓ In Stock</span>
                </div>
              </div>

              {/* Price */}
              <div className="py-6 border-y border-neutral-200">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-neutral-900">
                    {formattedPrice}
                  </span>
                  {/* Original price if on sale */}
                  <span className="text-xl line-through text-neutral-500">
                    ₦580,000
                  </span>
                  <span className="px-2 py-1 text-sm font-medium text-white bg-red-500 rounded-full">
                    Save 22%
                  </span>
                </div>
                
                {product.variants && product.variants.length > 1 && (
                  <p className="mt-2 text-neutral-600">
                    Price varies by selected options
                  </p>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-3">
                {product.is_thrift && (
                  <span className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                    ♻️ Sustainable Choice
                  </span>
                )}
                {product.condition && (
                  <span className="px-4 py-2 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                    Condition: {product.condition}
                  </span>
                )}
                <span className="px-4 py-2 text-sm font-medium rounded-full bg-rebbie-100 text-rebbie-800">
                  🏆 Authenticity Guaranteed
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <div className="prose prose-neutral">
                  <p className="text-lg leading-relaxed text-neutral-700">
                    {product.description}
                  </p>
                </div>
              )}

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
                <label className="block mb-3 text-lg font-medium text-neutral-900">
                  Quantity
                </label>
                <div className="flex items-center">
                  <div className="flex items-center overflow-hidden border-2 border-neutral-300 rounded-xl">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 transition-colors hover:bg-neutral-50"
                    >
                      <MinusIcon className="w-5 h-5" />
                    </button>
                    <span className="px-6 py-3 border-l border-r border-neutral-300 font-medium min-w-[4rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 transition-colors hover:bg-neutral-50"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <span className="ml-4 text-neutral-600">
                    {selectedVariant?.inventory_quantity || 0} available
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || addingToCart}
                  size="xl"
                  fullWidth
                  rightIcon={!addingToCart && <ShoppingBagIcon className="w-6 h-6" />}
                >
                  {addingToCart ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                      Adding to Cart...
                    </div>
                  ) : (
                    <>Add to Cart • {formattedPrice}</>
                  )}
                </Button>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleWishlistToggle}
                    leftIcon={
                      isWishlisted ? (
                        <HeartSolidIcon className="w-5 h-5 text-red-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5" />
                      )
                    }
                  >
                    {isWishlisted ? 'Wishlisted' : 'Save'}
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleShare}
                    leftIcon={<ShareIcon className="w-5 h-5" />}
                  >
                    Share
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div className="p-6 space-y-4 bg-neutral-50 rounded-2xl">
                <div className="flex items-center gap-4 text-neutral-700">
                  <TruckIcon className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="font-medium">Same-day delivery in Lagos</div>
                    <div className="text-sm text-neutral-600">Order before 3PM</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-neutral-700">
                  <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
                  <div>
                    <div className="font-medium">100% authentic guarantee</div>
                    <div className="text-sm text-neutral-600">With authenticity certificate</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-neutral-700">
                  <CreditCardIcon className="w-6 h-6 text-rebbie-600" />
                  <div>
                    <div className="font-medium">Flexible payment options</div>
                    <div className="text-sm text-neutral-600">Paystack, bank transfer, or cash on delivery</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-neutral-700">
                  <PhoneIcon className="w-6 h-6 text-nigeria-whatsapp" />
                  <div>
                    <div className="font-medium">24/7 WhatsApp support</div>
                    <div className="text-sm text-neutral-600">Get instant help via WhatsApp</div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Quick Contact */}
              <div className="p-6 text-white bg-gradient-to-r from-nigeria-whatsapp to-green-600 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20">
                    <PhoneIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 font-semibold">Have questions about this product?</h3>
                    <p className="text-sm text-white/90">Chat with our style consultants on WhatsApp</p>
                  </div>
                  <a
                    href={`https://wa.me/2349023821968?text=Hi! I'm interested in ${product.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="secondary" size="lg">
                      Chat Now
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="py-16 bg-neutral-50">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-12">
              <div className="p-2 bg-white shadow-sm rounded-2xl">
                {[
                  { id: 'description', label: 'Description' },
                  { id: 'reviews', label: 'Reviews (24)' },
                  { id: 'shipping', label: 'Shipping & Returns' },
                  { id: 'authenticity', label: 'Authenticity' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={clsx(
                      'px-6 py-3 rounded-xl font-medium transition-all',
                      activeTab === tab.id
                        ? 'bg-rebbie-600 text-white shadow-rebbie-sm'
                        : 'text-neutral-600 hover:text-rebbie-600'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <Card className="p-8 lg:p-12">
              {activeTab === 'description' && (
                <div className="prose prose-lg max-w-none">
                  <h3 className="mb-6 text-2xl font-bold">Product Details</h3>
                  <p className="mb-6 leading-relaxed text-neutral-700">
                    {product.description || 'Detailed product description would be shown here.'}
                  </p>
                  
                  <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-2">
                    <div>
                      <h4 className="mb-4 font-semibold">Specifications</h4>
                      <ul className="space-y-2 text-neutral-700">
                        <li>• Material: Premium leather</li>
                        <li>• Dimensions: 25cm x 15cm x 8cm</li>
                        <li>• Weight: 0.8kg</li>
                        <li>• Closure: Magnetic snap</li>
                        <li>• Interior: Fabric lining with pockets</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-4 font-semibold">Care Instructions</h4>
                      <ul className="space-y-2 text-neutral-700">
                        <li>• Clean with soft, dry cloth</li>
                        <li>• Avoid exposure to water</li>
                        <li>• Store in dust bag when not in use</li>
                        <li>• Professional cleaning recommended</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h3 className="mb-6 text-2xl font-bold">Customer Reviews</h3>
                  <ProductReviews productId={product.id} />
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="prose prose-lg max-w-none">
                  <h3 className="mb-6 text-2xl font-bold">Shipping & Returns</h3>
                  
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div>
                      <h4 className="mb-4 font-semibold">Shipping Options</h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <ClockIcon className="w-5 h-5 text-green-600" />
                          <div>
                            <div className="font-medium">Same-day (Lagos)</div>
                            <div className="text-sm text-neutral-600">₦2,500 • Order before 3PM</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <TruckIcon className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="font-medium">Standard (Nigeria)</div>
                            <div className="text-sm text-neutral-600">₦1,500 • 2-5 business days</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <TruckIcon className="w-5 h-5 text-purple-600" />
                          <div>
                            <div className="font-medium">International</div>
                            <div className="text-sm text-neutral-600">$25 • 7-14 business days</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="mb-4 font-semibold">Return Policy</h4>
                      <ul className="space-y-2 text-neutral-700">
                        <li>• 30-day return window</li>
                        <li>• Items must be in original condition</li>
                        <li>• Include authenticity certificate</li>
                        <li>• Return shipping cost covered by us</li>
                        <li>• Refund processed within 5-7 days</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'authenticity' && (
                <div className="prose prose-lg max-w-none">
                  <h3 className="mb-6 text-2xl font-bold">Authenticity Guarantee</h3>
                  
                  <div className="p-6 mb-8 border border-green-200 bg-green-50 rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <ShieldCheckIcon className="w-8 h-8 text-green-600" />
                      <div>
                        <h4 className="font-semibold text-green-900">100% Authentic Guarantee</h4>
                        <p className="text-green-700">Every item comes with authenticity verification</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div>
                      <h4 className="mb-4 font-semibold">Our Authentication Process</h4>
                      <ol className="space-y-3 text-neutral-700">
                        <li>1. Expert inspection by certified authenticators</li>
                        <li>2. Serial number and date code verification</li>
                        <li>3. Material and craftsmanship analysis</li>
                        <li>4. Comparison with brand standards</li>
                        <li>5. Digital certificate generation</li>
                      </ol>
                    </div>
                    
                    <div>
                      <h4 className="mb-4 font-semibold">What You Get</h4>
                      <ul className="space-y-2 text-neutral-700">
                        <li>• Official authenticity certificate</li>
                        <li>• Digital verification code</li>
                        <li>• Expert authentication report</li>
                        <li>• Money-back guarantee if not authentic</li>
                        <li>• Lifetime authenticity support</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Related Products */}
        {recommendations.length > 0 && (
          <section className="py-16 bg-white">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <h2 className="mb-8 text-3xl font-bold text-center text-neutral-900">
                You Might Also Like
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {recommendations.map(product => (
                  <Card key={product.id} className="overflow-hidden transition-all duration-300 group hover:shadow-xl">
                    <div className="relative aspect-square bg-neutral-100">
                      <div className="flex items-center justify-center w-full h-full text-neutral-400">
                        <div className="text-center">
                          <div className="mb-2 text-4xl">📦</div>
                          <div className="text-sm">{product.title}</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="mb-2 font-medium line-clamp-2">{product.title}</h3>
                      <div className="text-lg font-bold">
                        {formatPrice(product.variants?.[0]?.prices?.[0]?.amount || 0, 'NGN')}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}