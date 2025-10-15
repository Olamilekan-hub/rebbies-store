/**
 * User-friendly error handling utilities
 * Converts technical API errors into clear, actionable messages for users
 */

export interface UserFriendlyError {
  message: string;
  type: 'error' | 'warning' | 'info';
  action?: string; // Optional action suggestion
}

/**
 * Maps common error patterns to user-friendly messages
 */
const errorMessageMap: Record<string, UserFriendlyError> = {
  // Authentication errors
  'invalid_credentials': {
    message: 'Incorrect email or password. Please check your credentials and try again.',
    type: 'error',
    action: 'Try again or reset your password'
  },
  'unauthorized': {
    message: 'You need to log in to access this feature.',
    type: 'warning',
    action: 'Please log in to continue'
  },
  'token_expired': {
    message: 'Your session has expired. Please log in again.',
    type: 'warning',
    action: 'Log in again'
  },
  'email_already_exists': {
    message: 'An account with this email already exists.',
    type: 'error',
    action: 'Try logging in or use a different email'
  },
  'weak_password': {
    message: 'Password is too weak. Use at least 8 characters with letters and numbers.',
    type: 'error',
    action: 'Create a stronger password'
  },
  'invalid_email': {
    message: 'Please enter a valid email address.',
    type: 'error',
    action: 'Check your email format'
  },
  
  // Network errors
  'network_error': {
    message: 'Connection problem. Please check your internet and try again.',
    type: 'error',
    action: 'Check your connection'
  },
  'server_error': {
    message: 'Something went wrong on our end. Please try again in a moment.',
    type: 'error',
    action: 'Try again later'
  },
  'timeout': {
    message: 'Request timed out. Please try again.',
    type: 'error',
    action: 'Try again'
  },
  
  // Validation errors
  'required_field': {
    message: 'Please fill in all required fields.',
    type: 'error',
    action: 'Complete the form'
  },
  'invalid_phone': {
    message: 'Please enter a valid Nigerian phone number (e.g., +234 or 0).',
    type: 'error',
    action: 'Check your phone number format'
  },
  
  // Account errors
  'account_locked': {
    message: 'Your account has been temporarily locked for security reasons.',
    type: 'warning',
    action: 'Contact support for assistance'
  },
  'account_not_verified': {
    message: 'Please verify your email address to continue.',
    type: 'info',
    action: 'Check your email for verification link'
  },
  
  // Password reset errors
  'reset_link_expired': {
    message: 'Password reset link has expired. Request a new one.',
    type: 'warning',
    action: 'Request new reset link'
  },
  'reset_link_invalid': {
    message: 'Invalid password reset link. Please request a new one.',
    type: 'error',
    action: 'Request new reset link'
  },
  
  // General fallback
  'unknown_error': {
    message: 'Something unexpected happened. Please try again.',
    type: 'error',
    action: 'Try again or contact support'
  }
};

/**
 * Analyzes an error and returns user-friendly message
 */
export function handleAuthError(error: any): UserFriendlyError {
  // Handle different error structures
  const errorMessage = getErrorMessage(error);
  const statusCode = getStatusCode(error);
  
  // Check for specific error patterns
  if (statusCode === 401) {
    if (errorMessage.toLowerCase().includes('invalid') || 
        errorMessage.toLowerCase().includes('incorrect') ||
        errorMessage.toLowerCase().includes('wrong')) {
      return errorMessageMap.invalid_credentials;
    }
    return errorMessageMap.unauthorized;
  }
  
  if (statusCode === 400) {
    if (errorMessage.toLowerCase().includes('email') && 
        errorMessage.toLowerCase().includes('exists')) {
      return errorMessageMap.email_already_exists;
    }
    
    if (errorMessage.toLowerCase().includes('password') && 
        (errorMessage.toLowerCase().includes('weak') || 
         errorMessage.toLowerCase().includes('invalid'))) {
      return errorMessageMap.weak_password;
    }
    
    if (errorMessage.toLowerCase().includes('email') && 
        errorMessage.toLowerCase().includes('invalid')) {
      return errorMessageMap.invalid_email;
    }
    
    if (errorMessage.toLowerCase().includes('unrecognized')) {
      return errorMessageMap.required_field;
    }
  }
  
  if (statusCode === 422) {
    return errorMessageMap.required_field;
  }
  
  if (statusCode === 403) {
    return errorMessageMap.account_locked;
  }
  
  if (statusCode >= 500) {
    return errorMessageMap.server_error;
  }
  
  // Network/connection errors
  if (error.name === 'NetworkError' || 
      error.message?.toLowerCase().includes('network') ||
      error.message?.toLowerCase().includes('fetch')) {
    return errorMessageMap.network_error;
  }
  
  if (error.name === 'TimeoutError' || 
      error.message?.toLowerCase().includes('timeout')) {
    return errorMessageMap.timeout;
  }
  
  // Check for specific MedusaJS error patterns
  if (errorMessage.toLowerCase().includes('customer already exists')) {
    return errorMessageMap.email_already_exists;
  }
  
  if (errorMessage.toLowerCase().includes('invalid credentials')) {
    return errorMessageMap.invalid_credentials;
  }
  
  // Fallback to generic error
  return errorMessageMap.unknown_error;
}

/**
 * Extract error message from various error structures
 */
function getErrorMessage(error: any): string {
  if (typeof error === 'string') return error;
  
  // Check common error message locations
  return error?.message || 
         error?.data?.message || 
         error?.response?.data?.message ||
         error?.error?.message ||
         error?.details ||
         'Unknown error occurred';
}

/**
 * Extract status code from error
 */
function getStatusCode(error: any): number {
  return error?.status || 
         error?.statusCode ||
         error?.response?.status ||
         error?.response?.statusCode ||
         0;
}

/**
 * Handle form validation errors
 */
export function handleValidationError(fieldName: string, error: any): UserFriendlyError {
  const message = getErrorMessage(error);
  
  if (fieldName === 'email') {
    if (message.toLowerCase().includes('invalid') || 
        message.toLowerCase().includes('format')) {
      return errorMessageMap.invalid_email;
    }
  }
  
  if (fieldName === 'password') {
    if (message.toLowerCase().includes('weak') || 
        message.toLowerCase().includes('short') ||
        message.toLowerCase().includes('minimum')) {
      return errorMessageMap.weak_password;
    }
  }
  
  if (fieldName === 'phone') {
    return errorMessageMap.invalid_phone;
  }
  
  return {
    message: `Please check the ${fieldName} field and try again.`,
    type: 'error',
    action: 'Correct the field'
  };
}

/**
 * Quick helper to get just the user-friendly message
 */
export function getUserFriendlyMessage(error: any): string {
  return handleAuthError(error).message;
}