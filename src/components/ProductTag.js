import { View, Text } from 'react-native';
import React from 'react';

import { theme } from '../constants';

const ProductTag = ({ item }) => {
  return (
    <View
      style={{
        position: 'absolute',
        top: 5,
        left: 3,
        borderRadius: 12,
        backgroundColor:
          item?.tag === 'HOT'
            ? theme.COLORS.red
            : item?.tag === 'NEW'
              ? theme.COLORS.lightBlue1
              : item?.tag === 'TRENDING'
                ? theme.COLORS.orange
                : theme.COLORS.transparent,
      }}
    >
      <Text
        style={{
          paddingHorizontal: 6,
          paddingVertical: 1,
          textTransform: 'uppercase',
          ...theme.FONTS.Mulish_700Bold,
          fontSize: 8,
          color: theme.COLORS.white,
          lineHeight: 8 * 1.7,
        }}
      >
        {item?.tag}
      </Text>
    </View>
  );
};

export default ProductTag;
