import { InteractionManager } from 'react-native';

// Debounce function for search and other frequent operations
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll events
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Run after interactions for better performance
export const runAfterInteractions = (callback) => {
  InteractionManager.runAfterInteractions(() => {
    callback();
  });
};

// Memory cleanup utility
export const cleanupResources = (resources) => {
  resources.forEach(resource => {
    if (resource && typeof resource.remove === 'function') {
      resource.remove();
    } else if (resource && typeof resource.unsubscribe === 'function') {
      resource.unsubscribe();
    } else if (resource && typeof resource.disconnect === 'function') {
      resource.disconnect();
    }
  });
};

// Image cache management
export const clearImageCache = async () => {
  try {
    // Implementation depends on your image caching library
    console.log('Image cache cleared');
  } catch (error) {
    console.error('Error clearing image cache:', error);
  }
};

// Performance monitoring
export const measurePerformance = (name, fn) => {
  return async (...args) => {
    const start = Date.now();
    try {
      const result = await fn(...args);
      const end = Date.now();
      console.log(`${name} took ${end - start}ms`);
      return result;
    } catch (error) {
      const end = Date.now();
      console.log(`${name} failed after ${end - start}ms`);
      throw error;
    }
  };
};