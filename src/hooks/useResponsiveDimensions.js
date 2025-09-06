import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

const { width: initialWidth, height: initialHeight } = Dimensions.get('window');

export const useResponsiveDimensions = () => {
  const [dimensions, setDimensions] = useState({
    width: initialWidth,
    height: initialHeight,
    isTablet: initialWidth >= 768,
    isLandscape: initialWidth > initialHeight,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height,
        isTablet: window.width >= 768,
        isLandscape: window.width > window.height,
      });
    });

    return () => subscription?.remove();
  }, []);

  const getResponsiveValue = (mobile, tablet = mobile) => {
    return dimensions.isTablet ? tablet : mobile;
  };

  const getScaledSize = (baseSize) => {
    const scale = Math.min(dimensions.width / 375, 1.2); // Base width 375px
    return Math.round(baseSize * scale);
  };

  return {
    ...dimensions,
    getResponsiveValue,
    getScaledSize,
  };
};