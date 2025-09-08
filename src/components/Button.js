import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { theme } from '../constants';

const Button = ({ title, onPress, containerStyle, color, disabled, className }) => {
  return (
    <View style={{ ...containerStyle, width: '100%' }}>
      <TouchableOpacity
        style={{
          width: '100%',
          height: 50,
          borderRadius: 50,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: disabled ? theme.COLORS.lightGray1 : color || theme.COLORS.lightBlue1,
        }}
        onPress={onPress}
        disabled={disabled}
        className={className}
      >
        <Text
          style={{
            color: disabled ? theme.COLORS.black : theme.COLORS.white,
            textTransform: 'uppercase',
            ...theme.FONTS.Mulish_600SemiBold,
            fontSize: 14,
          }}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Button;
