import React, { Component, ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(_error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div style={{ maxWidth: 620, margin: '48px auto', padding: '0 20px' }}>
          <section className="panel">
            <div className="panel-head">
              <h1 className="panel-title">This page stopped</h1>
              <span className="tag tag-signal">Error</span>
            </div>
            <div className="panel-body stack">
              <p className="muted">
                Nothing you had entered was sent anywhere, but it is gone from the screen.
                Try again, and reload the page if it happens twice.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details>
                  <summary className="field-label" style={{ cursor: 'pointer' }}>
                    Developer detail
                  </summary>
                  <pre className="file-preview" style={{ marginTop: 8, maxHeight: 260 }}>
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>
            <div className="panel-foot">
              <button className="btn" onClick={this.handleReset} type="button">
                Try again
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => window.location.reload()}
                type="button"
              >
                Reload the page
              </button>
            </div>
          </section>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
