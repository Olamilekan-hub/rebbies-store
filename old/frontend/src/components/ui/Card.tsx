import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  variant?: 'default' | 'elevated' | 'outline' | 'glass' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  interactive?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  rounded = 'xl',
  shadow = 'md',
  hover = false,
  interactive = false,
  className,
  children,
  onClick,
  ...props
}) => {
  const isClickable = Boolean(onClick) || interactive;

  const cardClasses = clsx(
    // Base styles
    'transition-all duration-300 ease-in-out',
    'overflow-hidden',
    
    // Variant styles
    {
      // Default
      'bg-white border border-neutral-200': variant === 'default',
      
      // Elevated
      'bg-white': variant === 'elevated',
      
      // Outline
      'bg-transparent border-2 border-neutral-300': variant === 'outline',
      
      // Glass morphism
      'glass backdrop-blur-sm': variant === 'glass',
      
      // Gradient
      'bg-gradient-card border border-neutral-100': variant === 'gradient',
    },
    
    // Padding variants
    {
      'p-0': padding === 'none',
      'p-3': padding === 'sm',
      'p-4': padding === 'md',
      'p-6': padding === 'lg',
      'p-8': padding === 'xl',
    },
    
    // Border radius
    {
      'rounded-none': rounded === 'none',
      'rounded-sm': rounded === 'sm',
      'rounded-md': rounded === 'md',
      'rounded-lg': rounded === 'lg',
      'rounded-xl': rounded === 'xl',
      'rounded-2xl': rounded === '2xl',
      'rounded-3xl': rounded === '3xl',
    },
    
    // Shadow variants
    {
      'shadow-none': shadow === 'none',
      'shadow-sm': shadow === 'sm',
      'shadow-md': shadow === 'md',
      'shadow-lg': shadow === 'lg',
      'shadow-xl': shadow === 'xl',
    },
    
    // Interactive styles
    {
      'cursor-pointer': isClickable,
      'focus:outline-none focus:ring-2 focus:ring-rebbie-500 focus:ring-offset-2': isClickable,
    },
    
    // Hover effects
    hover && {
      'hover:shadow-lg hover:-translate-y-1': variant === 'default',
      'hover:shadow-xl hover:-translate-y-1': variant === 'elevated',
      'hover:border-rebbie-600 hover:shadow-rebbie-sm': variant === 'outline',
      'hover:bg-white/20': variant === 'glass',
      'hover:shadow-lg': variant === 'gradient',
    },
    
    className
  );

  const Component = isClickable ? 'button' : 'div';

  return (
    <Component
      className={cardClasses}
      onClick={onClick}
      {...(isClickable && { role: 'button', tabIndex: 0 })}
      {...props}
    >
      {children}
    </Component>
  );
};

// Card Header Component
interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  className,
  children,
}) => {
  if (children) {
    return <div className={clsx('border-b border-neutral-200 pb-4 mb-4', className)}>{children}</div>;
  }

  return (
    <div className={clsx('border-b border-neutral-200 pb-4 mb-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          {title && (
            <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-neutral-600 mt-1">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
};

// Card Body Component
interface CardBodyProps {
  className?: string;
  children: React.ReactNode;
}

const CardBody: React.FC<CardBodyProps> = ({ className, children }) => {
  return <div className={clsx('flex-1', className)}>{children}</div>;
};

// Card Footer Component
interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

const CardFooter: React.FC<CardFooterProps> = ({ className, children }) => {
  return (
    <div className={clsx('border-t border-neutral-200 pt-4 mt-4', className)}>
      {children}
    </div>
  );
};

// Product Card specific variant
interface ProductCardProps {
  image?: string;
  title: string;
  price: string;
  originalPrice?: string;
  badge?: string;
  rating?: number;
  reviews?: number;
  onQuickView?: () => void;
  onAddToCart?: () => void;
  onWishlist?: () => void;
  isWishlisted?: boolean;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  price,
  originalPrice,
  badge,
  rating,
  reviews,
  onQuickView,
  onAddToCart,
  onWishlist,
  isWishlisted = false,
  className,
}) => {
  return (
    <Card
      variant="default"
      padding="none"
      hover
      className={clsx('group relative', className)}
    >
      {/* Product Image */}
      <div className="aspect-square bg-neutral-100 relative overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Badge */}
        {badge && (
          <div className="absolute top-3 left-3">
            <span className="bg-accent-coral text-white text-xs font-medium px-2 py-1 rounded-full">
              {badge}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {onWishlist && (
            <button
              onClick={onWishlist}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-neutral-50 transition-colors"
            >
              <svg
                className={clsx('w-4 h-4', isWishlisted ? 'text-red-500 fill-current' : 'text-neutral-600')}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          )}

          {onQuickView && (
            <button
              onClick={onQuickView}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-neutral-50 transition-colors"
            >
              <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          )}
        </div>

        {/* Add to Cart Overlay */}
        {onAddToCart && (
          <div className="absolute bottom-0 left-0 right-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={onAddToCart}
              className="w-full bg-rebbie-600 text-white py-3 px-4 font-medium hover:bg-rebbie-700 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-medium text-neutral-900 line-clamp-2 mb-2">{title}</h3>
        
        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={clsx('w-4 h-4', i < rating ? 'fill-current' : 'text-neutral-300')}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            {reviews && (
              <span className="text-sm text-neutral-500">({reviews})</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-neutral-900 price-naira">
            {price}
          </span>
          {originalPrice && (
            <span className="text-sm text-neutral-500 line-through price-naira">
              {originalPrice}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

// Export all components
export default Card;
export { CardHeader, CardBody, CardFooter, ProductCard };