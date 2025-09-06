import React, { memo, useCallback, useMemo } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { useResponsiveDimensions } from '../hooks/useResponsiveDimensions';

const OptimizedFlatList = memo(({
  data,
  renderItem,
  numColumns = 2,
  horizontal = false,
  keyExtractor,
  onEndReached,
  onEndReachedThreshold = 0.5,
  contentContainerStyle,
  showsVerticalScrollIndicator = false,
  showsHorizontalScrollIndicator = false,
  initialNumToRender = 10,
  maxToRenderPerBatch = 5,
  windowSize = 10,
  removeClippedSubviews = true,
  getItemLayout,
  ...props
}) => {
  const { getResponsiveValue } = useResponsiveDimensions();

  // Optimize numColumns for different screen sizes
  const responsiveNumColumns = useMemo(() => {
    if (horizontal) return 1;
    return getResponsiveValue(numColumns, Math.min(numColumns + 1, 4));
  }, [horizontal, numColumns, getResponsiveValue]);

  // Memoized render item to prevent unnecessary re-renders
  const memoizedRenderItem = useCallback(
    (itemData) => renderItem(itemData),
    [renderItem]
  );

  // Optimized key extractor
  const optimizedKeyExtractor = useCallback(
    (item, index) => {
      if (keyExtractor) return keyExtractor(item, index);
      return item?.id?.toString() || item?._id?.toString() || index.toString();
    },
    [keyExtractor]
  );

  // Optimized onEndReached with debouncing
  const debouncedOnEndReached = useCallback(() => {
    if (onEndReached) {
      onEndReached();
    }
  }, [onEndReached]);

  const styles = useMemo(() => createStyles(), []);

  return (
    <FlatList
      data={data}
      renderItem={memoizedRenderItem}
      keyExtractor={optimizedKeyExtractor}
      numColumns={responsiveNumColumns}
      horizontal={horizontal}
      onEndReached={debouncedOnEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      contentContainerStyle={[styles.container, contentContainerStyle]}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      initialNumToRender={initialNumToRender}
      maxToRenderPerBatch={maxToRenderPerBatch}
      windowSize={windowSize}
      removeClippedSubviews={removeClippedSubviews}
      getItemLayout={getItemLayout}
      {...props}
    />
  );
});

const createStyles = () => StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

OptimizedFlatList.displayName = 'OptimizedFlatList';
export default OptimizedFlatList;