import { Text } from 'react-native';
import React from 'react';

import { theme } from '../constants';

const ProductName = ({ item }) => {
  return (
    <Text
      style={{
        ...theme.FONTS.Mulish_400Regular,
        fontSize: 14,
        color: theme.COLORS.gray1,
        lineHeight: 14 * 1.7,
      }}
      numberOfLines={1}
    >
      {item.name}
    </Text>
  );
};

export default ProductName;
