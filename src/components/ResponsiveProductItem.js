import { useNavigation } from '@react-navigation/native';
import React, { memo } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useResponsiveDimensions } from '../hooks/useResponsiveDimensions';
import { theme } from '../constants';
import DiscountTag from './DiscountTag';
import OptimizedImage from './OptimizedImage';
import InCartButton from './InCartButton';
import ProductTag from './ProductTag';

const ResponsiveProductItem = memo(({ item, width: customWidth }) => {
  const navigation = useNavigation();
  const { width: screenWidth, getResponsiveValue, getScaledSize } = useResponsiveDimensions();
  
  const defaultVolume = item?.details?.volume?.find((v) => v.isDefault) || { volume: '750ml', salePrice: 0, regularPrice: item.price || 0 };
  const defaultPrice =
    defaultVolume?.salePrice !== 0 ? defaultVolume?.salePrice : (defaultVolume?.regularPrice || item.price || 0);

  // Calculate responsive dimensions
  const itemWidth = customWidth || getResponsiveValue(
    (screenWidth - 40) / 2, // Mobile: 2 columns with padding
    (screenWidth - 60) / 3  // Tablet: 3 columns with padding
  );

  const styles = createStyles(getScaledSize, itemWidth);

  const handlePress = () => {
    navigation.push('Product', { product: item });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.imageContainer}>
        <OptimizedImage
          uri={item?.images?.[0]}
          containerStyle={styles.imageWrapper}
          style={styles.image}
          resizeMode="contain"
          loaderColor={theme.COLORS.lightBlue1}
        >
          <ProductTag item={item} />
          {item.discountTag && <DiscountTag item={item} />}
        </OptimizedImage>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
          {item.name}
        </Text>

        <View style={styles.detailsRow}>
          <Text style={styles.detailText}>{item?.details?.abv}</Text>
          <Text style={styles.separator}>|</Text>
          <Text style={styles.detailText}>{defaultVolume?.volume}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>Rs. {defaultPrice}</Text>
          <InCartButton item={{ ...item, price: defaultPrice }} />
        </View>
      </View>
    </TouchableOpacity>
  );
});

const createStyles = (getScaledSize, itemWidth) => StyleSheet.create({
  container: {
    width: itemWidth,
    backgroundColor: theme.COLORS.white,
    borderRadius: getScaledSize(12),
    borderWidth: 1,
    borderColor: theme.COLORS.lightBlue2,
    margin: getScaledSize(5),
    overflow: 'hidden',
  },
  imageContainer: {
    height: getScaledSize(200),
    backgroundColor: theme.COLORS.white,
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: getScaledSize(12),
    borderTopRightRadius: getScaledSize(12),
  },
  image: {
    borderTopLeftRadius: getScaledSize(12),
    borderTopRightRadius: getScaledSize(12),
  },
  contentContainer: {
    padding: getScaledSize(12),
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: getScaledSize(14),
    color: theme.COLORS.black,
    ...theme.FONTS.Mulish_400Regular,
    marginBottom: getScaledSize(8),
    minHeight: getScaledSize(36), // Ensure consistent height
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getScaledSize(8),
  },
  detailText: {
    fontSize: getScaledSize(12),
    color: theme.COLORS.lightGray,
    flex: 1,
    textAlign: 'center',
  },
  separator: {
    fontSize: getScaledSize(12),
    color: theme.COLORS.lightGray,
    marginHorizontal: getScaledSize(4),
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: getScaledSize(14),
    color: theme.COLORS.lightBlue1,
    ...theme.FONTS.H3,
    flex: 1,
  },
});

ResponsiveProductItem.displayName = 'ResponsiveProductItem';
export default ResponsiveProductItem;