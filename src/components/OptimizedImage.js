import React, { memo } from 'react';
import { ActivityIndicator, Image, View, StyleSheet } from 'react-native';
import { useOptimizedImage } from '../hooks/useOptimizedImage';
import { theme } from '../constants';

const OptimizedImage = memo(({
  uri,
  fallbackUri,
  style,
  containerStyle,
  resizeMode = 'cover',
  children,
  showLoader = true,
  loaderSize = 'small',
  loaderColor = theme.COLORS.lightGray,
}) => {
  const { loading, error, source } = useOptimizedImage(uri, fallbackUri);

  if (error && !fallbackUri) {
    return (
      <View style={[styles.container, containerStyle, styles.errorContainer]}>
        <View style={styles.errorPlaceholder} />
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {loading && showLoader && (
        <ActivityIndicator
          size={loaderSize}
          color={loaderColor}
          style={styles.loader}
        />
      )}
      {source && (
        <Image
          source={source}
          style={[styles.image, style]}
          resizeMode={resizeMode}
          onError={() => {
            // Handle error if needed
          }}
        />
      )}
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -10,
    marginTop: -10,
    zIndex: 1,
  },
  errorContainer: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
});

OptimizedImage.displayName = 'OptimizedImage';
export default OptimizedImage;