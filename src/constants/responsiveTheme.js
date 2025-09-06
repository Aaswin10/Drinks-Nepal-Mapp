import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Base dimensions (iPhone 6/7/8 as reference)
const baseWidth = 375;
const baseHeight = 667;

// Calculate scale factors
const widthScale = screenWidth / baseWidth;
const heightScale = screenHeight / baseHeight;
const scale = Math.min(widthScale, heightScale);

// Responsive scaling function
export const scaleSize = (size) => Math.ceil(size * scale);
export const scaleFont = (size) => Math.ceil(size * scale);

// Responsive spacing system (8px base)
export const spacing = {
  xs: scaleSize(4),
  sm: scaleSize(8),
  md: scaleSize(16),
  lg: scaleSize(24),
  xl: scaleSize(32),
  xxl: scaleSize(48),
};

// Responsive font sizes
export const fontSizes = {
  xs: scaleFont(10),
  sm: scaleFont(12),
  md: scaleFont(14),
  lg: scaleFont(16),
  xl: scaleFont(18),
  xxl: scaleFont(20),
  xxxl: scaleFont(24),
  display: scaleFont(32),
};

// Responsive border radius
export const borderRadius = {
  sm: scaleSize(4),
  md: scaleSize(8),
  lg: scaleSize(12),
  xl: scaleSize(16),
  full: scaleSize(50),
};

// Device type detection
export const deviceType = {
  isSmallDevice: screenWidth < 375,
  isMediumDevice: screenWidth >= 375 && screenWidth < 414,
  isLargeDevice: screenWidth >= 414,
  isTablet: screenWidth >= 768,
};

// Responsive breakpoints
export const breakpoints = {
  sm: 375,
  md: 414,
  lg: 768,
  xl: 1024,
};

// Helper function to get responsive value based on screen size
export const getResponsiveValue = (values) => {
  if (typeof values === 'object') {
    if (screenWidth >= breakpoints.xl) return values.xl || values.lg || values.md || values.sm;
    if (screenWidth >= breakpoints.lg) return values.lg || values.md || values.sm;
    if (screenWidth >= breakpoints.md) return values.md || values.sm;
    return values.sm;
  }
  return values;
};

export const responsiveTheme = {
  spacing,
  fontSizes,
  borderRadius,
  deviceType,
  breakpoints,
  scaleSize,
  scaleFont,
  getResponsiveValue,
};