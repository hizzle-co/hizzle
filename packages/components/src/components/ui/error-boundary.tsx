/**
 * External dependencies.
 */
import React, { ErrorInfo, ReactNode } from 'react';

/**
 * WordPress dependencies.
 */
import { __experimentalText as Text, Button } from '@wordpress/components';

/**
 * Props for the ErrorBoundary component.
 */
interface Props {
    /**
     * Child components to be rendered within this error boundary.
     */
    children: ReactNode;

    /**
     * Optional custom fallback component to render when an error occurs.
     * Receives error, errorInfo, and reset function as props.
     */
    fallback?: React.ComponentType<{
        error: Error | null;
        errorInfo: ErrorInfo | null;
        resetErrorBoundary: () => void;
    }>;

    /**
     * Optional callback that will be called when an error is caught.
     */
    onError?: ( error: Error, errorInfo: ErrorInfo ) => void;
}

/**
 * State interface for the ErrorBoundary component.
 */
interface State {
    /**
     * Indicates whether an error has occurred.
     */
    hasError: boolean;
    /**
     * The error object if an error occurred, null otherwise.
     */
    error: Error | null;
    /**
     * Additional information about the error, null if no error.
     */
    errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary component that catches JavaScript errors in its child component tree.
 * It displays a fallback UI instead of crashing the whole application.
 */
export class ErrorBoundary extends React.Component<Props, State> {
    /**
     * Constructor for the ErrorBoundary component.
     * 
     * @param {Props} props - Component props
     */
    constructor( props: Props ) {
        super( props );
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    /**
     * Static method called during rendering when an error is thrown.
     * Used to update the component state.
     * 
     * @param {Error} error - The error that was caught
     * @returns {Partial<State>} Partial state object to update the component
     */
    static getDerivedStateFromError( error: Error ): Partial<State> {
        return { hasError: true, error };
    }

    /**
     * Lifecycle method called after an error has been thrown by a descendant component.
     * Used for logging errors or sending them to an error reporting service.
     * 
     * @param {Error} error - The error that was thrown
     * @param {ErrorInfo} errorInfo - Additional information about the error
     */
    componentDidCatch( error: Error, errorInfo: ErrorInfo ): void {
        this.setState( { error, errorInfo } );

        // Call the onError callback if provided
        if ( this.props.onError ) {
            this.props.onError( error, errorInfo );
        }
    }

    /**
     * Resets the error state to allow re-rendering the children.
     */
    resetErrorBoundary = (): void => {
        this.setState( {
            hasError: false,
            error: null,
            errorInfo: null,
        } );
    };

    /**
     * Renders either the error UI or the children components.
     * 
     * @returns {ReactNode} The rendered component
     */
    render(): ReactNode {
        if ( this.state.hasError ) {
            if ( this.props.fallback ) {
                const FallbackComponent = this.props.fallback;
                return (
                    <FallbackComponent
                        error={ this.state.error }
                        errorInfo={ this.state.errorInfo }
                        resetErrorBoundary={ this.resetErrorBoundary }
                    />
                );
            }

            return (
                <div>
                    <div
                        style={ {
                            backgroundColor: '#FEE2E2',
                            border: '1px solid #F87171',
                            color: '#B91C1C',
                            padding: '0.75rem 1rem',
                            borderRadius: '0.25rem',
                            position: 'relative'
                        } }
                        role="alert"
                    >
                        <Text as="strong" weight={ 500 } color="#B91C1C">
                            Oops! Something went wrong.
                        </Text>&nbsp;
                        <Text color="#B91C1C">
                            This error is being logged.
                        </Text>
                        <details style={ { marginTop: '0.5rem', fontSize: '0.875rem' } }>
                            <summary>Click for error details</summary>
                            <pre style={ {
                                overflow: 'auto',
                                fontSize: '0.875rem',
                                marginTop: '0.5rem'
                            } }>
                                { this.state.error && this.state.error.toString() }
                                <br />
                                { this.state.errorInfo?.componentStack }
                            </pre>
                        </details>

                        <Button
                            onClick={ this.resetErrorBoundary }
                            variant="primary"
                            __next40pxDefaultSize
                        >
                            Try Again
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * HOC to wrap a component with the ErrorBoundary
 * 
 * @param Component - The component to wrap
 * @param errorBoundaryProps - Props to pass to the ErrorBoundary
 */
export const withErrorBoundary = <P extends object>(
    Component: React.ComponentType<P>,
    errorBoundaryProps?: Omit<Props, 'children'>
): React.FC<P> => {
    const Wrapped: React.FC<P> = ( props ) => {
        return (
            <ErrorBoundary { ...errorBoundaryProps }>
                <Component { ...props } />
            </ErrorBoundary>
        );
    };

    // Set display name for better debugging
    const displayName = Component.displayName || Component.name || 'Component';
    Wrapped.displayName = `withErrorBoundary(${ displayName })`;

    return Wrapped;
};
