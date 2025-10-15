import React from 'react';
import { AiOutlineWarning, AiOutlineCloseCircle, AiOutlineInfoCircle } from 'react-icons/ai';

interface ErrorDisplayProps {
  error: string;
  type?: 'error' | 'warning' | 'info';
  onClose?: () => void;
  className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  type = 'error',
  onClose,
  className = ''
}) => {
  if (!error) return null;

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AiOutlineWarning className="w-5 h-5" />;
      case 'info':
        return <AiOutlineInfoCircle className="w-5 h-5" />;
      default:
        return <AiOutlineCloseCircle className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300';
      default:
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300';
    }
  };

  return (
    <div className={`
      flex items-center gap-3 p-4 border rounded-xl transition-all duration-300
      ${getStyles()}
      ${className}
    `}>
      {getIcon()}
      <div className="flex-1">
        <p className="text-sm font-medium">{error}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-current hover:opacity-70 transition-opacity duration-200"
        >
          <AiOutlineCloseCircle className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;