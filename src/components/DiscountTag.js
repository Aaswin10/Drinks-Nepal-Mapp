import { TouchableOpacity, Text } from 'react-native';
import React from 'react';

import { theme } from '../constants';

const DiscountTag = ({ item }) => {
  return (
    <TouchableOpacity
      style={{
        width: 50,
        height: 50,
        padding: 8,
        position: 'absolute',
        right: 2,
        top: 2,
        borderRadius: 25,
        backgroundColor: theme.COLORS.lightBlue1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{ fontSize: 9, color: theme.COLORS.white, textAlign: 'center', fontWeight: 'bold' }}
      >
        {item?.discountTag}
      </Text>
    </TouchableOpacity>
  );
};

export default DiscountTag;
