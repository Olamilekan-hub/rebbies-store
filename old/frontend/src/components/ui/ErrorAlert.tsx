import React from 'react';
import { XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export interface ErrorAlertProps {
  message: string;
  type: 'error' | 'warning' | 'info';
  action?: string;
  onClose?: () => void;
  className?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  message, 
  type, 
  action, 
  onClose, 
  className 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return <XCircleIcon className="w-5 h-5" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5" />;
      case 'info':
        return <InformationCircleIcon className="w-5 h-5" />;
      default:
        return <XCircleIcon className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'error':
        return {
          container: 'bg-red-50 border-red-200 text-red-800',
          icon: 'text-red-500',
          action: 'text-red-600',
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          icon: 'text-yellow-500',
          action: 'text-yellow-600',
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200 text-blue-800',
          icon: 'text-blue-500',
          action: 'text-blue-600',
        };
      default:
        return {
          container: 'bg-red-50 border-red-200 text-red-800',
          icon: 'text-red-500',
          action: 'text-red-600',
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={clsx(
      'flex items-start gap-3 p-4 border rounded-lg',
      styles.container,
      className
    )}>
      <div className={clsx('flex-shrink-0', styles.icon)}>
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">
          {message}
        </p>
        {action && (
          <p className={clsx('mt-1 text-xs', styles.action)}>
            {action}
          </p>
        )}
      </div>
      
      {onClose && (
        <button
          onClick={onClose}
          className={clsx(
            'flex-shrink-0 p-1 rounded-full transition-colors hover:bg-white/20',
            styles.icon
          )}
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ErrorAlert;