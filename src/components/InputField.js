import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useResponsiveDimensions } from '../hooks/useResponsiveDimensions';

import { theme } from '../constants';
import { svg } from '../svg';

const InputField = ({
  title,
  placeholder,
  icon,
  containerStyle,
  secureTextEntry,
  keyboardType,
  check,
  eyeOffSvg = false,
  value,
  onChangeText,
  disabled,
  error,
  required = false,
}) => {
  const { getScaledSize } = useResponsiveDimensions();
  
  return (
    <View>
      <View
        style={{
          paddingLeft: getScaledSize(30),
          height: getScaledSize(50),
          width: '100%',
          borderWidth: 1,
          borderColor: error ? theme.COLORS.red : theme.COLORS.lightBlue1,
          borderRadius: getScaledSize(25),
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          ...containerStyle,
        }}
      >
        <TextInput
          style={{
            flex: 1,
            height: '100%',
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            ...theme.FONTS.Mulish_400Regular,
            fontSize: getScaledSize(16),
          }}
          keyboardType={keyboardType}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          placeholderTextColor={theme.COLORS.lightGray}
          value={value}
          onChangeText={onChangeText}
          editable={!disabled}
        />
        {title && (
          <View
            style={{
              position: 'absolute',
              top: -getScaledSize(12),
              left: getScaledSize(20),
              paddingHorizontal: getScaledSize(10),
              backgroundColor: theme.COLORS.white,
            }}
          >
            <Text
              style={{
                ...theme.FONTS.Mulish_600SemiBold,
                fontSize: getScaledSize(12),
                textTransform: 'uppercase',
                color: error ? theme.COLORS.red : theme.COLORS.gray1,
                lineHeight: getScaledSize(12) * 1.7,
              }}
            >
              {title}{required && ' *'}
            </Text>
          </View>
        )}
        {check && (
          <View style={{ paddingHorizontal: getScaledSize(20) }}>
            <svg.CheckSvg />
          </View>
        )}
        {eyeOffSvg && (
          <TouchableOpacity style={{ paddingHorizontal: getScaledSize(20) }}>
            <svg.EyeOffSvg />
          </TouchableOpacity>
        )}
        {icon && (
          <TouchableOpacity
            style={{
              paddingHorizontal: getScaledSize(20),
              paddingVertical: getScaledSize(10),
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {icon}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text
          style={{
            color: theme.COLORS.red,
            fontSize: getScaledSize(12),
            marginTop: getScaledSize(4),
            marginLeft: getScaledSize(20),
            ...theme.FONTS.Mulish_400Regular,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

export default InputField;
