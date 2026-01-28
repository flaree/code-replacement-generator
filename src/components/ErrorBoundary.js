import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree and displays a fallback UI
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(_error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container-page">
          <div className="card" style={{ maxWidth: 600, margin: '40px auto' }}>
            <div className="card-header">
              <div>
                <div className="card-title" style={{ color: '#ff6b6b' }}>
                  Something went wrong
                </div>
                <div className="card-subtitle">
                  An unexpected error occurred. Please try again.
                </div>
              </div>
            </div>
            <div className="stack-md">
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div style={{ 
                  padding: '12px', 
                  background: '#f5f5f5', 
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  overflow: 'auto'
                }}>
                  <strong>Error:</strong> {this.state.error.toString()}
                  {this.state.errorInfo && (
                    <details style={{ marginTop: '8px' }}>
                      <summary>Stack trace</summary>
                      <pre style={{ fontSize: '11px', marginTop: '8px' }}>
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
              <div className="btn-row">
                <button 
                  className="btn" 
                  onClick={this.handleReset}
                  type="button"
                >
                  Try again
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => window.location.reload()}
                  type="button"
                >
                  Reload page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
