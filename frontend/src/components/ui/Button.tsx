/**
 * Professional Button Component for Rebbie's Store
 * Supports multiple variants, sizes, and states
 */

import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className,
  children,
  ...props
}) => {
  const baseClasses = clsx(
    // Base styles
    'inline-flex items-center justify-center font-semibold transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    'touch-target', // Nigerian mobile-first
    
    // Full width
    fullWidth && 'w-full',
    
    // Size variants
    {
      'px-3 py-1.5 text-xs rounded-md gap-1': size === 'xs',
      'px-3 py-2 text-sm rounded-md gap-1.5': size === 'sm',
      'px-4 py-2.5 text-sm rounded-lg gap-2': size === 'md',
      'px-6 py-3 text-base rounded-lg gap-2': size === 'lg',
      'px-8 py-4 text-lg rounded-xl gap-3': size === 'xl',
    },
    
    // Color variants
    {
      // Primary (Rebbie's Purple)
      'bg-rebbie-600 text-white shadow-rebbie-sm hover:bg-rebbie-700 hover:shadow-rebbie-md hover:-translate-y-0.5 focus:ring-rebbie-500 active:translate-y-0': 
        variant === 'primary',
      
      // Secondary (Dark)
      'bg-neutral-900 text-white shadow-sm hover:bg-neutral-800 hover:shadow-md hover:-translate-y-0.5 focus:ring-neutral-500 active:translate-y-0': 
        variant === 'secondary',
      
      // Outline
      'border-2 border-rebbie-600 text-rebbie-600 bg-transparent hover:bg-rebbie-600 hover:text-white hover:-translate-y-0.5 focus:ring-rebbie-500': 
        variant === 'outline',
      
      // Ghost
      'text-rebbie-600 bg-transparent hover:bg-rebbie-50 hover:text-rebbie-700 focus:ring-rebbie-500': 
        variant === 'ghost',
      
      // Danger
      'bg-status-error text-white shadow-sm hover:bg-red-700 hover:shadow-md hover:-translate-y-0.5 focus:ring-red-500 active:translate-y-0': 
        variant === 'danger',
      
      // Success
      'bg-status-success text-white shadow-sm hover:bg-emerald-700 hover:shadow-md hover:-translate-y-0.5 focus:ring-emerald-500 active:translate-y-0': 
        variant === 'success',
    }
  );

  return (
    <button
      className={clsx(baseClasses, className)}
      disabled={disabled || loading}
      {...props}
    >
      {/* Loading Spinner */}
      {loading && (
        <div className="animate-spin">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
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
      
      {/* Left Icon */}
      {!loading && leftIcon && (
        <span className="flex-shrink-0">{leftIcon}</span>
      )}
      
      {/* Button Text */}
      <span className={clsx(loading && 'opacity-0')}>{children}</span>
      
      {/* Right Icon */}
      {!loading && rightIcon && (
        <span className="flex-shrink-0">{rightIcon}</span>
      )}
    </button>
  );
};

export default Button;