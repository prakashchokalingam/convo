import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

/**
 * Standard API error response format
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: any;
  timestamp: string;
}

/**
 * Standard API success response format
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  data?: T;
  message?: string;
  timestamp: string;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Error codes for consistent error handling
 */
export const ErrorCodes = {
  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_TOKEN: 'INVALID_TOKEN',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  MISSING_FIELDS: 'MISSING_FIELDS',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // Resource errors
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  
  // Business logic errors
  PLAN_LIMIT_EXCEEDED: 'PLAN_LIMIT_EXCEEDED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  INVALID_OPERATION: 'INVALID_OPERATION',
  
  // External service errors
  EMAIL_SERVICE_ERROR: 'EMAIL_SERVICE_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
  
  // Generic errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  message: string,
  status: number = 500,
  code?: ErrorCode,
  details?: any
): NextResponse<ApiErrorResponse> {
  const errorResponse: ApiErrorResponse = {
    success: false,
    error: message,
    code,
    details,
    timestamp: new Date().toISOString(),
  };
  
  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', {
      message,
      status,
      code,
      details,
      stack: new Error().stack,
    });
  }
  
  return NextResponse.json(errorResponse, { status });
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse<T>(
  data?: T,
  message?: string,
  status: number = 200
): NextResponse<ApiSuccessResponse<T>> {
  const successResponse: ApiSuccessResponse<T> = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
  
  return NextResponse.json(successResponse, { status });
}

/**
 * Handle common API errors with appropriate responses
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public code?: ErrorCode,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Error handler for API routes
 */
export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  // Handle ApiError instances
  if (error instanceof ApiError) {
    return createErrorResponse(error.message, error.status, error.code, error.details);
  }
  
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const details = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    
    return createErrorResponse(
      'Validation failed',
      400,
      ErrorCodes.VALIDATION_ERROR,
      details
    );
  }
  
  // Handle database errors
  if (error && typeof error === 'object' && 'code' in error) {
    const dbError = error as any;
    
    // PostgreSQL error codes
    switch (dbError.code) {
      case '23505': // Unique violation
        return createErrorResponse(
          'Resource already exists',
          409,
          ErrorCodes.ALREADY_EXISTS
        );
      case '23503': // Foreign key violation
        return createErrorResponse(
          'Referenced resource not found',
          400,
          ErrorCodes.RESOURCE_CONFLICT
        );
      case '23502': // Not null violation
        return createErrorResponse(
          'Required field is missing',
          400,
          ErrorCodes.MISSING_FIELDS
        );
      default:
        return createErrorResponse(
          'Database error occurred',
          500,
          ErrorCodes.DATABASE_ERROR,
          process.env.NODE_ENV === 'development' ? dbError.message : undefined
        );
    }
  }
  
  // Handle standard errors
  if (error instanceof Error) {
    return createErrorResponse(
      process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'Internal server error',
      500,
      ErrorCodes.INTERNAL_ERROR,
      process.env.NODE_ENV === 'development' ? error.stack : undefined
    );
  }
  
  // Handle unknown errors
  return createErrorResponse(
    'An unexpected error occurred',
    500,
    ErrorCodes.INTERNAL_ERROR
  );
}

/**
 * Async wrapper for API route handlers with error handling
 */
export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<NextResponse<ApiResponse<R>>>
) {
  return async (...args: T): Promise<NextResponse<ApiResponse<R>>> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

/**
 * Common error responses
 */
export const CommonErrors = {
  unauthorized: () => createErrorResponse(
    'Authentication required',
    401,
    ErrorCodes.UNAUTHORIZED
  ),
  
  forbidden: (message = 'Access denied') => createErrorResponse(
    message,
    403,
    ErrorCodes.FORBIDDEN
  ),
  
  notFound: (resource = 'Resource') => createErrorResponse(
    `${resource} not found`,
    404,
    ErrorCodes.NOT_FOUND
  ),
  
  badRequest: (message = 'Invalid request') => createErrorResponse(
    message,
    400,
    ErrorCodes.VALIDATION_ERROR
  ),
  
  conflict: (message = 'Resource already exists') => createErrorResponse(
    message,
    409,
    ErrorCodes.ALREADY_EXISTS
  ),
  
  planLimitExceeded: (feature: string) => createErrorResponse(
    `You've reached your plan limit for ${feature}`,
    403,
    ErrorCodes.PLAN_LIMIT_EXCEEDED,
    { feature }
  ),
  
  rateLimit: () => createErrorResponse(
    'Too many requests. Please try again later.',
    429,
    ErrorCodes.RATE_LIMIT_EXCEEDED
  ),
  
  internal: (message = 'Internal server error') => createErrorResponse(
    message,
    500,
    ErrorCodes.INTERNAL_ERROR
  ),
};

/**
 * Validation helper
 */
export function validateRequiredFields(
  data: Record<string, any>,
  requiredFields: string[]
): void {
  const missingFields = requiredFields.filter(
    field => data[field] === undefined || data[field] === null || data[field] === ''
  );
  
  if (missingFields.length > 0) {
    throw new ApiError(
      `Missing required fields: ${missingFields.join(', ')}`,
      400,
      ErrorCodes.MISSING_FIELDS,
      { missingFields }
    );
  }
}

/**
 * Check user authentication
 */
export function requireAuth(userId: string | null): asserts userId is string {
  if (!userId) {
    throw new ApiError(
      'Authentication required',
      401,
      ErrorCodes.UNAUTHORIZED
    );
  }
}

/**
 * Check user permissions
 */
export function requirePermission(hasPermission: boolean, message = 'Insufficient permissions'): void {
  if (!hasPermission) {
    throw new ApiError(
      message,
      403,
      ErrorCodes.INSUFFICIENT_PERMISSIONS
    );
  }
}
