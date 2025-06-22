// Compatibility layer for the old @heroui/toast API
// This allows existing code to keep working with our new toast system

export const addToast = (options: {
  title: string;
  description?: string;
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  duration?: number;
}) => {
  // This function will be dynamically bound to the actual toast context
  // when the component is mounted. We use a global variable approach here.
  if (window.__toastAddFunction) {
    window.__toastAddFunction(options);
  } else {
    console.warn('Toast system not initialized. Make sure ToastProvider is wrapping your app.');
  }
};

// Global type declaration for the window object
declare global {
  interface Window {
    __toastAddFunction?: (options: {
      title: string;
      description?: string;
      color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
      duration?: number;
    }) => void;
  }
}
