export interface AppError {
  type: 'auth' | 'database' | 'network' | 'validation';
  message: string;
  details?: any;
  recoverable: boolean;
}

export class ErrorHandler {
  static createError(type: AppError['type'], message: string, details?: any, recoverable = true): AppError {
    return { type, message, details, recoverable };
  }

  static handleAuthError(error: any): AppError {
    if (error?.message?.includes('Invalid login credentials')) {
      return this.createError('auth', 'Invalid email or password', error);
    }
    
    if (error?.message?.includes('Email not confirmed')) {
      return this.createError('auth', 'Please check your email and click the confirmation link', error);
    }
    
    if (error?.message?.includes('Too many requests')) {
      return this.createError('auth', 'Too many login attempts. Please try again later', error, false);
    }
    
    return this.createError('auth', 'Authentication failed. Please try again', error);
  }

  static handleDatabaseError(error: any): AppError {
    if (error?.code === 'PGRST116') {
      return this.createError('database', 'No data found', error);
    }
    
    if (error?.code === 'PGRST301') {
      return this.createError('database', 'Access denied', error, false);
    }
    
    if (error?.message?.includes('connection')) {
      return this.createError('network', 'Database connection failed', error);
    }
    
    return this.createError('database', 'Database operation failed', error);
  }

  static handleNetworkError(error: any): AppError {
    if (error?.message?.includes('fetch')) {
      return this.createError('network', 'Network request failed', error);
    }
    
    if (error?.code === 'NETWORK_ERROR') {
      return this.createError('network', 'Please check your internet connection', error);
    }
    
    return this.createError('network', 'Network error occurred', error);
  }

  static getErrorMessage(error: any): string {
    if (error?.message) {
      return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    return 'An unexpected error occurred';
  }

  static shouldRetry(error: AppError): boolean {
    return error.recoverable && ['network', 'database'].includes(error.type);
  }
}