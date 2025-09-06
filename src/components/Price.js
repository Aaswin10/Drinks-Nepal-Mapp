import React from 'react';
import { Text, View } from 'react-native';

import { theme } from '../constants';

const Price = ({ item, containerStyle, displayOldPrice = true }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        ...containerStyle,
      }}
    >
      {item?.old_price && displayOldPrice && (
        <Text
          style={{
            color: theme.COLORS.gray1,
            marginRight: 4,
            ...theme.FONTS.Mulish_400Regular,
            fontSize: 12,
            lineHeight: 12 * 1.5,
            textDecorationLine: 'line-through',
          }}
        >
          Rs. {item?.old_price}
        </Text>
      )}
      <Text
        style={{
          ...theme.FONTS.Mulish_700Bold,
          fontSize: 14,
          lineHeight: 14 * 1.5,
          color: theme.COLORS.black,
        }}
      >
        Rs. {item?.price}
      </Text>
    </View>
  );
};

export default Price;
