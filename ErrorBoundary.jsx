import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          fontFamily: 'Arial, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '40px',
            borderRadius: '15px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            maxWidth: '500px',
            width: '100%'
          }}>
            <div style={{fontSize: '60px', marginBottom: '20px'}}>⚠️</div>
            <h1 style={{margin: '0 0 20px 0', fontSize: '28px'}}>Oops! Something went wrong</h1>
            <p style={{margin: '0 0 30px 0', fontSize: '16px', lineHeight: '1.5', opacity: '0.9'}}>
              We encountered an unexpected error. This has been logged and our team will look into it.
            </p>
            
            {process.env.NODE_ENV === 'development' && (
              <details style={{
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '30px',
                textAlign: 'left',
                fontSize: '12px'
              }}>
                <summary style={{cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px'}}>
                  Error Details (Development Only)
                </summary>
                <pre style={{margin: '10px 0 0 0', whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
                  {this.state.error && this.state.error.toString()}
                  <br /><br />
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            
            <div style={{display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap'}}>
              <button
                onClick={this.handleReload}
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#218838';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#28a745';
                }}
              >
                🔄 Reload Page
              </button>
              
              <button
                onClick={this.handleGoHome}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#0056b3';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#007bff';
                }}
              >
                🏠 Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
