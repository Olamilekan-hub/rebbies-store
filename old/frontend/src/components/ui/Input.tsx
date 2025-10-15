import React, { useState } from 'react';
import { clsx } from 'clsx';
import { EyeIcon, EyeSlashIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'underline';
  loading?: boolean;
  success?: boolean;
  nigerianPhone?: boolean; 
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  size = 'md',
  variant = 'default',
  loading = false,
  success = false,
  nigerianPhone = false,
  type = 'text',
  className,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === 'password';
  const currentType = isPassword && showPassword ? 'text' : type;
  const hasError = Boolean(error);
  const hasSuccess = success && !hasError;

  // Nigerian phone number formatting
  const formatNigerianPhone = (value: string) => {
    if (!nigerianPhone) return value;
    
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as +234-XXX-XXX-XXXX
    if (digits.length >= 10) {
      return `+234-${digits.slice(-10, -7)}-${digits.slice(-7, -4)}-${digits.slice(-4)}`;
    }
    return digits;
  };

  const inputClasses = clsx(
    // Base styles
    'w-full transition-all duration-200 placeholder-neutral-400',
    'focus:outline-none focus:ring-2 focus:ring-offset-1',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'touch-target', // Nigerian mobile-first
    
    // Size variants
    {
      'px-3 py-2 text-sm': size === 'sm',
      'px-4 py-3 text-base': size === 'md', 
      'px-5 py-4 text-lg': size === 'lg',
    },
    
    // Variant styles
    {
      // Default variant
      'border-2 rounded-lg bg-white': variant === 'default',
      
      // Filled variant
      'border-0 rounded-lg bg-neutral-50': variant === 'filled',
      
      // Underline variant
      'border-0 border-b-2 rounded-none bg-transparent px-0': variant === 'underline',
    },
    
    // State-dependent styles
    {
      // Default variant states
      'border-neutral-300 focus:border-rebbie-600 focus:ring-rebbie-500': 
        variant === 'default' && !hasError && !hasSuccess,
      'border-status-error focus:border-status-error focus:ring-status-error': 
        variant === 'default' && hasError,
      'border-status-success focus:border-status-success focus:ring-status-success': 
        variant === 'default' && hasSuccess,
      
      // Filled variant states
      'focus:bg-white focus:ring-rebbie-500': 
        variant === 'filled' && !hasError && !hasSuccess,
      'bg-red-50 focus:ring-status-error': 
        variant === 'filled' && hasError,
      'bg-green-50 focus:ring-status-success': 
        variant === 'filled' && hasSuccess,
      
      // Underline variant states
      'border-neutral-300 focus:border-rebbie-600': 
        variant === 'underline' && !hasError && !hasSuccess,
      'border-status-error': 
        variant === 'underline' && hasError,
      'border-status-success': 
        variant === 'underline' && hasSuccess,
    },
    
    // Icon padding adjustments
    {
      'pl-10': leftIcon && size === 'sm',
      'pl-11': leftIcon && size === 'md',
      'pl-12': leftIcon && size === 'lg',
      'pr-10': (rightIcon || isPassword) && size === 'sm',
      'pr-11': (rightIcon || isPassword) && size === 'md',
      'pr-12': (rightIcon || isPassword) && size === 'lg',
    },
    
    className
  );

  const containerClasses = clsx(
    'relative',
    props.disabled && 'opacity-60'
  );

  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size];

  return (
    <div className="space-y-1">
      {/* Label */}
      {label && (
        <label className={clsx(
          'block font-medium',
          {
            'text-sm': size === 'sm',
            'text-base': size === 'md',
            'text-lg': size === 'lg',
          },
          hasError ? 'text-status-error' : 'text-neutral-700'
        )}>
          {label}
          {props.required && (
            <span className="text-status-error ml-1">*</span>
          )}
        </label>
      )}

      {/* Input Container */}
      <div className={containerClasses}>
        {/* Left Icon */}
        {leftIcon && (
          <div className={clsx(
            'absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none',
            hasError ? 'text-status-error' : 'text-neutral-400'
          )}>
            <div className={iconSize}>{leftIcon}</div>
          </div>
        )}

        {/* Input Field */}
        <input
          type={currentType}
          className={inputClasses}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => {
            if (nigerianPhone) {
              e.target.value = formatNigerianPhone(e.target.value);
            }
            props.onChange?.(e);
          }}
          {...props}
        />

        {/* Right Icon / Password Toggle / Loading / Success */}
        <div className={clsx(
          'absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1'
        )}>
          {loading && (
            <div className="animate-spin">
              <svg className={iconSize} fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          )}

          {hasError && !loading && (
            <ExclamationCircleIcon className={clsx(iconSize, 'text-status-error')} />
          )}

          {hasSuccess && !loading && !hasError && (
            <svg className={clsx(iconSize, 'text-status-success')} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={clsx(
                'text-neutral-400 hover:text-neutral-600 transition-colors',
                'focus:outline-none focus:text-rebbie-600'
              )}
            >
              {showPassword ? (
                <EyeSlashIcon className={iconSize} />
              ) : (
                <EyeIcon className={iconSize} />
              )}
            </button>
          )}

          {rightIcon && !isPassword && !loading && !hasError && !hasSuccess && (
            <div className="text-neutral-400">
              <div className={iconSize}>{rightIcon}</div>
            </div>
          )}
        </div>

        {/* Focus indicator for underline variant */}
        {variant === 'underline' && isFocused && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rebbie-600 transform scale-x-100 transition-transform duration-200" />
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-status-error flex items-center gap-1">
          <ExclamationCircleIcon className="w-4 h-4" />
          {error}
        </p>
      )}

      {/* Hint */}
      {hint && !error && (
        <p className="text-sm text-neutral-500">{hint}</p>
      )}

      {/* Nigerian phone format hint */}
      {nigerianPhone && !error && !hint && (
        <p className="text-xs text-neutral-400">
          Format: +234-XXX-XXX-XXXX
        </p>
      )}
    </div>
  );
};

export default Input;