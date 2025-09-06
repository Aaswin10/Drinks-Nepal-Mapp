import React from 'react';
import { Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useResponsiveDimensions } from '../hooks/useResponsiveDimensions';

import { theme } from '../constants';

const Button = ({ 
  title, 
  onPress, 
  containerStyle, 
  color, 
  disabled, 
  className, 
  loading = false,
  size = 'medium' 
}) => {
  const { getScaledSize } = useResponsiveDimensions();
  
  const buttonHeight = size === 'large' ? getScaledSize(56) : getScaledSize(50);
  const fontSize = size === 'large' ? getScaledSize(16) : getScaledSize(14);
  const borderRadius = size === 'large' ? getScaledSize(28) : getScaledSize(25);

  return (
    <View style={{ ...containerStyle, width: '100%' }}>
      <TouchableOpacity
        style={{
          width: '100%',
          height: buttonHeight,
          borderRadius: borderRadius,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: (disabled || loading) ? theme.COLORS.lightGray1 : color || theme.COLORS.lightBlue1,
          opacity: (disabled || loading) ? 0.6 : 1,
        }}
        onPress={onPress}
        disabled={disabled || loading}
        className={className}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator size="small" color={theme.COLORS.white} />
        ) : (
          <Text
            style={{
              color: (disabled || loading) ? theme.COLORS.black : theme.COLORS.white,
              textTransform: 'uppercase',
              ...theme.FONTS.Mulish_600SemiBold,
              fontSize: fontSize,
            }}
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Button;
