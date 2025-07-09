'use client';

import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shared/ui/card';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

/**
 * Default error fallback component
 */
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className='min-h-[400px] flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100'>
            <AlertTriangle className='h-6 w-6 text-red-600' />
          </div>
          <CardTitle className='text-red-900'>Something went wrong</CardTitle>
          <CardDescription>
            An unexpected error occurred. Don't worry, this has been reported to our team.
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          {isDevelopment && (
            <div className='rounded bg-red-50 p-3'>
              <p className='text-sm font-medium text-red-800'>Development Error:</p>
              <p className='text-sm text-red-700 font-mono'>{error.message}</p>
            </div>
          )}

          <div className='flex gap-2'>
            <Button onClick={resetError} variant='outline' className='flex-1'>
              <RefreshCw className='h-4 w-4 mr-2' />
              Try Again
            </Button>
            <Button onClick={() => (window.location.href = '/')} className='flex-1'>
              <Home className='h-4 w-4 mr-2' />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * Error boundary component for catching React errors
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call the onError callback if provided
    this.props.onError?.(error, errorInfo);

    // In production, you might want to log this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;

      return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

/**
 * Hook for error boundary functionality in functional components
 */
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    console.error('Error captured:', error);
    setError(error);
  }, []);

  // Throw the error to be caught by error boundary
  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
};

/**
 * Wrapper component for easier use
 */
export const WithErrorBoundary: React.FC<{
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}> = ({ children, fallback }) => {
  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;
};

/**
 * Page-level error boundary for route errors
 */
export const PageErrorBoundary: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
      <Card className='w-full max-w-lg'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100'>
            <AlertTriangle className='h-8 w-8 text-red-600' />
          </div>
          <CardTitle className='text-xl text-red-900'>Page Error</CardTitle>
          <CardDescription>
            This page encountered an error and couldn't load properly.
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          {process.env.NODE_ENV === 'development' && (
            <div className='rounded bg-red-50 p-4'>
              <p className='text-sm font-medium text-red-800 mb-2'>Error Details:</p>
              <pre className='text-xs text-red-700 font-mono whitespace-pre-wrap'>
                {error.message}
                {error.stack && `\n${error.stack}`}
              </pre>
            </div>
          )}

          <div className='flex gap-2'>
            <Button onClick={resetError} variant='outline' className='flex-1'>
              <RefreshCw className='h-4 w-4 mr-2' />
              Reload Page
            </Button>
            <Button onClick={() => (window.location.href = '/')} className='flex-1'>
              <Home className='h-4 w-4 mr-2' />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
