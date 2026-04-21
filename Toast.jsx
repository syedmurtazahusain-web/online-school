import { useState, useEffect } from 'react';

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getStyles = () => {
    const baseStyles = {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '15px 20px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: 'bold',
      zIndex: '9999',
      minWidth: '250px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      transition: 'all 0.3s ease',
      transform: 'translateX(0)'
    };

    switch (type) {
      case 'success':
        return { ...baseStyles, background: '#28a745' };
      case 'error':
        return { ...baseStyles, background: '#dc3545' };
      case 'warning':
        return { ...baseStyles, background: '#ffc107', color: '#333' };
      case 'info':
        return { ...baseStyles, background: '#17a2b8' };
      default:
        return { ...baseStyles, background: '#6c757d' };
    }
  };

  return (
    <div style={getStyles()}>
      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
        {type === 'success' && <span>✅</span>}
        {type === 'error' && <span>❌</span>}
        {type === 'warning' && <span>⚠️</span>}
        {type === 'info' && <span>ℹ️</span>}
        <span>{message}</span>
      </div>
    </div>
  );
}

function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    window.showToast = addToast;
    return () => {
      delete window.showToast;
    };
  }, []);

  return (
    <div>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

export default ToastContainer;
