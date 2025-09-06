import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useResponsiveDimensions } from '../hooks/useResponsiveDimensions';

import { theme } from '../constants';
import DiscountTag from './DiscountTag';
import OptimizedImage from './OptimizedImage';
import InCartButton from './InCartButton';
import ProductTag from './ProductTag';

const ProductItem = React.memo(({ item, width }) => {
  const navigation = useNavigation();
  const { getScaledSize } = useResponsiveDimensions();
  const defaultVolume = item?.details?.volume?.find((v) => v.isDefault);
  const defaultPrice =
    defaultVolume?.salePrice !== 0 ? defaultVolume?.salePrice : defaultVolume?.regularPrice;

  const styles = React.useMemo(() => createStyles(getScaledSize, width), [getScaledSize, width]);

  return (
    <TouchableOpacity
      style={[styles.container, width && { width }]}
      onPress={() => {
        navigation.push('Product', {
          product: item,
        });
      }}
      activeOpacity={0.8}
    >
      <OptimizedImage
        uri={item?.images?.[0]}
        containerStyle={styles.imageContainer}
        resizeMode="contain"
        loaderColor={theme.COLORS.lightBlue1}
      >
        <ProductTag item={item} />
        {item.discountTag && <DiscountTag item={item} />}
      </OptimizedImage>
      
      <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
        {item.name}
      </Text>
      
      <View style={styles.detailsRow}>
        <Text style={styles.detailText}>
          {item?.details?.abv}
        </Text>
        <Text style={styles.separator}>| </Text>
        <Text style={styles.detailText}>
          {defaultVolume?.volume}
        </Text>
      </View>
      
      <View style={styles.priceRow}>
        <Text style={styles.price}>
          Rs. {defaultPrice}
        </Text>
        <InCartButton item={{ ...item, price: defaultPrice }} />
      </View>
    </TouchableOpacity>
  );
});

const createStyles = (getScaledSize, customWidth) => StyleSheet.create({
  container: {
    flex: 1,
    margin: getScaledSize(5),
    padding: getScaledSize(8),
    backgroundColor: theme.COLORS.white,
    height: getScaledSize(320),
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderColor: theme.COLORS.lightBlue2,
    borderWidth: 1,
    borderRadius: getScaledSize(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: '60%',
    marginBottom: getScaledSize(8),
    backgroundColor: theme.COLORS.white,
    borderRadius: getScaledSize(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  productName: {
    fontSize: getScaledSize(14),
    textAlign: 'left',
    marginHorizontal: getScaledSize(8),
    marginVertical: getScaledSize(4),
    color: theme.COLORS.black,
    ...theme.FONTS.Mulish_400Regular,
    minHeight: getScaledSize(36),
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: getScaledSize(8),
    marginVertical: getScaledSize(4),
    alignItems: 'center',
  },
  detailText: {
    fontSize: getScaledSize(12),
    color: theme.COLORS.lightGray,
    flex: 1,
    textAlign: 'center',
    ...theme.FONTS.Mulish_400Regular,
  },
  separator: {
    fontSize: getScaledSize(12),
    color: theme.COLORS.lightGray,
    marginHorizontal: getScaledSize(4),
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: getScaledSize(8),
    marginVertical: getScaledSize(4),
    alignItems: 'center',
  },
  price: {
    ...theme.FONTS.H3,
    fontSize: getScaledSize(14),
    color: theme.COLORS.lightBlue1,
    flex: 1,
    textAlign: 'left',
  },
});

ProductItem.displayName = 'ProductItem';
export default ProductItem;

