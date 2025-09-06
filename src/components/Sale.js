import { View, Text } from 'react-native';
import React from 'react';

import { theme } from '../constants';

const Sale = () => {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#69864D',
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
        sale
      </Text>
    </View>
  );
};

export default Sale;
