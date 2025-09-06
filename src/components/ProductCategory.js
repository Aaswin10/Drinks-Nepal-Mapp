import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { theme } from '../constants';
import { svg } from '../svg';

const ProductCategory = ({ title, onPress, containerStyle }) => {
  return (
    <View
      style={{
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        ...containerStyle,
      }}
      className="mb-2"
    >
      <Text style={{ ...theme.FONTS.H4, color: theme.COLORS.black }}>{title}</Text>
      {onPress && (
        <TouchableOpacity onPress={onPress} className="flex flex-row justify-between items-center">
          <View>
            <Text
              style={{
                ...theme.FONTS.Mulish_600SemiBold,
                fontSize: 14,
                color: theme.COLORS.lightBlue1,
              }}
            >
              View All
            </Text>
          </View>
          <View>
            <svg.ArrowRightSvg />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ProductCategory;
