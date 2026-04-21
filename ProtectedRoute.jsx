import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children, requiredRoles = [] }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
    return (
      <div style={{
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f8f9fa',
        color: '#333'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <h2 style={{margin: '0 0 20px 0', color: '#dc3545'}}>Access Denied</h2>
          <p style={{margin: '0 0 30px 0', lineHeight: '1.5'}}>
            You don't have permission to access this page. This page requires {requiredRoles.join(' or ')} privileges.
          </p>
          <button
            onClick={() => window.history.back()}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
