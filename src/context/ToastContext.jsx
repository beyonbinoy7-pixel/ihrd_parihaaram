import React, { createContext, useContext, useState, useCallback } from 'react';
import ToastContainer from '../components/common/ToastContainer.jsx';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newToast = { id, message, type, duration };

    setToasts((prev) => [...prev.slice(-4), newToast]); // Keep max 5 toasts

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, dur) => addToast(msg, 'success', dur),
    error: (msg, dur) => addToast(msg, 'error', dur),
    info: (msg, dur) => addToast(msg, 'info', dur),
    warning: (msg, dur) => addToast(msg, 'warning', dur),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback safe dummy object if rendered outside provider
    return {
      success: console.log,
      error: console.error,
      info: console.log,
      warning: console.warn,
    };
  }
  return context;
}
