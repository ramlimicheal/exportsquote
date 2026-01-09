import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.setState({ errorInfo });
        
        // Log error to console in development
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        
        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // In production, you might want to send this to an error tracking service
        // logErrorToService(error, errorInfo);
    }

    handleRetry = (): void => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    handleReload = (): void => {
        window.location.reload();
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="flex items-center justify-center min-h-[400px] p-8">
                    <div className="max-w-md w-full bg-white dark:bg-surface-dark rounded-2xl shadow-xl p-8 text-center">
                        {/* Error Icon */}
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <span className="material-icons-outlined text-3xl text-red-500">error_outline</span>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                            Something went wrong
                        </h2>

                        {/* Description */}
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            We encountered an unexpected error. Don't worry, your data is safe.
                        </p>

                        {/* Error Details (collapsible) */}
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mb-6 text-left bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                                <summary className="cursor-pointer text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                    Error Details (Dev Only)
                                </summary>
                                <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto max-h-32 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-center gap-3">
                            <button
                                onClick={this.handleRetry}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                <span className="material-icons-outlined text-sm">refresh</span>
                                Try Again
                            </button>
                            <button
                                onClick={this.handleReload}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <span className="material-icons-outlined text-sm">restart_alt</span>
                                Reload Page
                            </button>
                        </div>

                        {/* Support Link */}
                        <p className="mt-6 text-xs text-gray-500">
                            If this keeps happening,{' '}
                            <a href="#" className="text-primary hover:underline">contact support</a>
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

// Functional wrapper for easier use with hooks
export function withErrorBoundary<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    fallback?: ReactNode
): React.FC<P> {
    return function WithErrorBoundaryWrapper(props: P) {
        return (
            <ErrorBoundary fallback={fallback}>
                <WrappedComponent {...props} />
            </ErrorBoundary>
        );
    };
}

// Page-level error fallback
export const PageErrorFallback: React.FC<{ pageName?: string }> = ({ pageName = 'page' }) => (
    <div className="flex-1 flex items-center justify-center bg-background-light dark:bg-background-dark p-8">
        <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg">
                <span className="material-icons-outlined text-4xl text-white">warning</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                Unable to load {pageName}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                There was a problem loading this content. Please try again or navigate to a different section.
            </p>
            <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
            >
                Refresh Page
            </button>
        </div>
    </div>
);

// Empty state component (for when there's no data)
export const EmptyState: React.FC<{
    icon?: string;
    title: string;
    description?: string;
    action?: { label: string; onClick: () => void };
}> = ({ icon = 'inbox', title, description, action }) => (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <div className="w-16 h-16 mb-6 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <span className="material-icons-outlined text-3xl text-gray-400">{icon}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{title}</h3>
        {description && (
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">{description}</p>
        )}
        {action && (
            <button
                onClick={action.onClick}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
                <span className="material-icons-outlined text-sm">add</span>
                {action.label}
            </button>
        )}
    </div>
);

// Loading skeleton component
export const LoadingSkeleton: React.FC<{
    variant?: 'card' | 'list' | 'table' | 'text';
    count?: number;
}> = ({ variant = 'card', count = 3 }) => {
    const renderSkeleton = () => {
        switch (variant) {
            case 'card':
                return (
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                    </div>
                );
            case 'list':
                return (
                    <div className="flex items-center gap-4 p-4 animate-pulse">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                        <div className="flex-1">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                        </div>
                    </div>
                );
            case 'table':
                return (
                    <div className="flex gap-4 p-4 animate-pulse border-b border-gray-100 dark:border-gray-800">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                    </div>
                );
            case 'text':
            default:
                return (
                    <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
                    </div>
                );
        }
    };

    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i}>{renderSkeleton()}</div>
            ))}
        </div>
    );
};
