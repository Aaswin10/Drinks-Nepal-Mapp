// Performance configuration constants
export const PERFORMANCE_CONFIG = {
  // Image optimization
  IMAGE_CACHE_SIZE: 100, // Number of images to cache
  IMAGE_QUALITY: 0.8, // Image compression quality
  
  // List optimization
  INITIAL_NUM_TO_RENDER: 10,
  MAX_TO_RENDER_PER_BATCH: 5,
  WINDOW_SIZE: 10,
  
  // Network timeouts
  API_TIMEOUT: 10000, // 10 seconds
  IMAGE_TIMEOUT: 5000, // 5 seconds
  
  // Animation durations
  FAST_ANIMATION: 200,
  NORMAL_ANIMATION: 300,
  SLOW_ANIMATION: 500,
  
  // Debounce delays
  SEARCH_DEBOUNCE: 300,
  SCROLL_DEBOUNCE: 100,
  
  // Memory management
  MAX_CACHE_SIZE: 50 * 1024 * 1024, // 50MB
  CLEANUP_INTERVAL: 5 * 60 * 1000, // 5 minutes
};

// Performance monitoring flags
export const PERFORMANCE_FLAGS = {
  ENABLE_PERFORMANCE_MONITORING: __DEV__,
  ENABLE_MEMORY_WARNINGS: __DEV__,
  ENABLE_RENDER_TRACKING: __DEV__,
};

// Error tracking configuration
export const ERROR_CONFIG = {
  MAX_ERROR_LOGS: 100,
  ERROR_REPORT_INTERVAL: 24 * 60 * 60 * 1000, // 24 hours
  CRITICAL_ERROR_THRESHOLD: 5, // Number of errors before showing user warning
};