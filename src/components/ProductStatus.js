import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

import { theme } from '../constants';
import { svg } from '../svg';

const ProductStatus = ({ status, color }) => {
  const [selectedStatus, setSelectedStatus] = useState(false);

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 50,
      }}
      onPress={() => {
        setSelectedStatus(!selectedStatus);
      }}
    >
      <View
        style={{
          width: 18,
          height: 18,
          borderWidth: 2,
          borderColor: theme.COLORS.lightBlue1,
          borderRadius: 5,
          marginRight: 8,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {selectedStatus == true && <svg.CategoryCheckSvg />}
      </View>
      <View
        style={{
          backgroundColor: color,
          paddingHorizontal: 6,
          paddingVertical: 2,
        }}
      >
        <Text
          style={{
            ...theme.FONTS.Mulish_600SemiBold,
            fontSize: 10,
            textTransform: 'uppercase',
            color: theme.COLORS.white,
          }}
        >
          {status}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProductStatus;
