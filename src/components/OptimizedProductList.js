import React, { memo, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useResponsiveDimensions } from '../hooks/useResponsiveDimensions';
import { theme } from '../constants';
import OptimizedFlatList from './OptimizedFlatList';
import ResponsiveProductItem from './ResponsiveProductItem';

const OptimizedProductList = memo(({
  data,
  loading = false,
  onEndReached,
  refreshControl,
  emptyMessage = 'No products found',
  numColumns,
}) => {
  const { getResponsiveValue, getScaledSize } = useResponsiveDimensions();

  // Memoized render item
  const renderItem = useCallback(
    ({ item }) => <ResponsiveProductItem item={item} />,
    []
  );

  // Memoized key extractor
  const keyExtractor = useCallback(
    (item) => item?._id?.toString() || item?.id?.toString(),
    []
  );

  // Optimized item layout for better performance
  const getItemLayout = useCallback(
    (data, index) => {
      const itemHeight = getScaledSize(280); // Approximate item height
      return {
        length: itemHeight,
        offset: itemHeight * index,
        index,
      };
    },
    [getScaledSize]
  );

  const styles = useMemo(() => createStyles(getScaledSize), [getScaledSize]);

  const responsiveNumColumns = getResponsiveValue(numColumns || 2, 3);

  if (loading && (!data || data.length === 0)) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <OptimizedFlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={responsiveNumColumns}
      onEndReached={onEndReached}
      refreshControl={refreshControl}
      getItemLayout={getItemLayout}
      contentContainerStyle={styles.listContainer}
    />
  );
});

const createStyles = (getScaledSize) => StyleSheet.create({
  listContainer: {
    paddingBottom: getScaledSize(20),
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: getScaledSize(20),
  },
  loadingText: {
    fontSize: getScaledSize(16),
    color: theme.COLORS.lightGray,
    ...theme.FONTS.Mulish_400Regular,
  },
  emptyText: {
    fontSize: getScaledSize(16),
    color: theme.COLORS.gray1,
    ...theme.FONTS.Mulish_400Regular,
    textAlign: 'center',
  },
});

OptimizedProductList.displayName = 'OptimizedProductList';
export default OptimizedProductList;