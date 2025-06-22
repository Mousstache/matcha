import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove toast after duration (default 5 seconds)
    const duration = toast.duration || 5000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Initialize global toast function for backward compatibility
  useEffect(() => {
    window.__toastAddFunction = (options: {
      title: string;
      description?: string;
      color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
      duration?: number;
    }) => {
      let type: 'success' | 'error' | 'warning' | 'info' = 'info';
      
      switch (options.color) {
        case 'success':
          type = 'success';
          break;
        case 'danger':
          type = 'error';
          break;
        case 'warning':
          type = 'warning';
          break;
        case 'primary':
        case 'secondary':
        case 'default':
        default:
          type = 'info';
          break;
      }

      addToast({
        title: options.title,
        description: options.description,
        type,
        duration: options.duration
      });
    };

    return () => {
      delete window.__toastAddFunction;
    };
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
