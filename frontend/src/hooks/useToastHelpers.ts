import { useToast } from '@/context/ToastContext';

// Helper function for backward compatibility with existing addToast calls
export const createToastHelper = () => {
  const { addToast: addToastOriginal } = useToast();

  const addToast = (options: {
    title: string;
    description?: string;
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    duration?: number;
  }) => {
    // Map HeroUI colors to our toast types
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

    addToastOriginal({
      title: options.title,
      description: options.description,
      type,
      duration: options.duration
    });
  };

  return { addToast };
};

// Export specific toast functions for easy use
export const useToastHelpers = () => {
  const { addToast } = useToast();

  return {
    success: (title: string, description?: string) => 
      addToast({ title, description, type: 'success' }),
    
    error: (title: string, description?: string) => 
      addToast({ title, description, type: 'error' }),
    
    warning: (title: string, description?: string) => 
      addToast({ title, description, type: 'warning' }),
    
    info: (title: string, description?: string) => 
      addToast({ title, description, type: 'info' }),
      
    // Backward compatibility function
    addToast: (options: {
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
    }
  };
};
