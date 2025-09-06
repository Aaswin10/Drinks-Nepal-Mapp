# Welcome to DrinksNepal 👋

## Performance Optimizations Applied

### 🚀 Key Improvements

1. **Image Optimization**
   - Implemented `OptimizedImage` component with preloading and caching
   - Added fallback image support
   - Reduced memory usage with proper image cleanup

2. **Responsive Design**
   - Added `useResponsiveDimensions` hook for dynamic sizing
   - Implemented responsive theme system
   - Support for tablets and different screen orientations

3. **Performance Enhancements**
   - Memoized selectors using Redux Toolkit
   - Optimized FlatList with proper virtualization
   - Reduced unnecessary re-renders with React.memo

4. **Navigation Improvements**
   - Optimized stack navigator with proper cleanup
   - Better memory management for listeners
   - Improved loading states

5. **State Management**
   - Added memoized selectors for better performance
   - Optimized cart calculations
   - Better socket connection management

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

## Performance Features

- **Responsive Design**: Automatically adapts to different screen sizes
- **Optimized Images**: Smart loading with fallbacks and caching
- **Smooth Navigation**: Reduced memory leaks and better transitions
- **Efficient Lists**: Virtualized lists with proper item recycling
- **Smart State Management**: Memoized selectors and optimized updates

## Create a development build for iOS simulators

   ```bash
   eas build --profile development-simulator --platform ios
   ```
