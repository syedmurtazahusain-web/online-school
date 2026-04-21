import React from 'react';

function LoadingSpinner({ size = 'medium', text = 'Loading...' }) {
  const sizeMap = {
    small: '20px',
    medium: '40px',
    large: '60px'
  };

  const spinnerStyle = {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    width: sizeMap[size],
    height: sizeMap[size],
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px'
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    fontFamily: 'Arial, sans-serif'
  };

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle}></div>
      <p style={{color: '#666', fontSize: '16px', margin: '0'}}>
        {text}
      </p>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default LoadingSpinner;
