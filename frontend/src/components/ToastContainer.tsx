import React from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface ToastProps {
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ title, description, type, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-white border-l-4 border-green-500 shadow-lg';
      case 'error':
        return 'bg-white border-l-4 border-red-500 shadow-lg';
      case 'warning':
        return 'bg-white border-l-4 border-yellow-500 shadow-lg';
      case 'info':
        return 'bg-white border-l-4 border-blue-500 shadow-lg';
    }
  };

  return (
    <div className={`
      ${getStyles()}
      max-w-sm w-full rounded-lg overflow-hidden
      transform transition-all duration-300 ease-in-out
      hover:shadow-xl hover:scale-105
      animate-in slide-in-from-right-full fade-in
      relative
    `}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 mb-1 leading-tight">
              {title}
            </h4>
            {description && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Progress bar for visual feedback */}
      <div className="h-1 bg-gray-100">
        <div 
          className={`h-full animate-pulse ${
            type === 'success' ? 'bg-green-500' :
            type === 'error' ? 'bg-red-500' :
            type === 'warning' ? 'bg-yellow-500' :
            'bg-blue-500'
          }`}
          style={{
            animation: 'toast-progress 5s linear forwards'
          }}
        />
      </div>
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <>
      {/* Add custom CSS animation */}
      <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        
        .animate-in {
          animation: slideInFromRight 0.3s ease-out;
        }
        
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      
      <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
        <div className="space-y-3 pointer-events-auto">
          {toasts.map((toast, index) => (
            <div
              key={toast.id}
              style={{
                transform: `translateY(${index * 10}px)`,
                zIndex: 50 - index
              }}
            >
              <Toast
                title={toast.title}
                description={toast.description}
                type={toast.type}
                onClose={() => removeToast(toast.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ToastContainer;
