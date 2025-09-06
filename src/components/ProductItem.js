import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { theme } from '../constants';
import DiscountTag from './DiscountTag';
import ImageItem from './ImageItem';
import InCartButton from './InCartButton';
import ProductTag from './ProductTag';

const ProductItem = React.memo(({ item, width }) => {
  const navigation = useNavigation();
  const defaultVolume = item?.details?.volume?.find((v) => v.isDefault);
  const defaultPrice =
    defaultVolume?.salePrice !== 0 ? defaultVolume?.salePrice : defaultVolume?.regularPrice;

  return (
    <TouchableOpacity
      style={{
        flex: 1,
        margin: 5,
        padding: 8,
        backgroundColor: theme.COLORS.white,
        height: 380,
        width,
        alignItems: 'start',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderColor: theme.COLORS.lightBlue2,
        borderWidth: 1,
        borderRadius: 12,
      }}
      onPress={() => {
        navigation.push('Product', {
          product: item,
        });
      }}
    >
      <ImageItem
        item={item}
        containerStyle={{
          width: '100%',
          height: '65%',
          marginBottom: 10,
          backgroundColor: theme.COLORS.white,
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        borderRadius={16}
        indicatorBorderRadius={16}
        resizeMode="contain"
      >
        <ProductTag item={item} />
        {item.discountTag && <DiscountTag item={item} />}
      </ImageItem>
      <Text
        style={{
          fontSize: 14,
          textAlign: 'left',
          marginHorizontal: 10,
          marginVertical: 5,
          color: theme.COLORS.black,
        }}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {item.name}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 10,
          marginVertical: 5,
        }}
      >
        <Text style={{ fontSize: 12, color: theme.COLORS.lightGray, flex: 1, textAlign: 'left' }}>
          {item?.details?.abv}
        </Text>
        <Text style={{ fontSize: 12, color: theme.COLORS.lightGray, textAlign: 'center' }}>| </Text>
        <Text style={{ fontSize: 12, color: theme.COLORS.lightGray, flex: 1, textAlign: 'right' }}>
          {defaultVolume?.volume}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 10,
          marginVertical: 5,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            ...theme.FONTS.H3,
            fontSize: 14,
            color: theme.COLORS.lightBlue1,
            flex: 1,
            textAlign: 'left',
          }}
        >
          Rs. {defaultPrice}
        </Text>
        <InCartButton item={{ ...item, price: defaultPrice }} />
      </View>
    </TouchableOpacity>
  );
});

ProductItem.displayName = 'ProductItem';
export default ProductItem;

