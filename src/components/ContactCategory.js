import { View, Text } from 'react-native';
import React from 'react';

import { theme } from '../constants';

const ContactCategory = ({ icon, lineOne, lineTwo }) => {
  return (
    <View
      style={{
        width: '100%',
        borderColor: 'rgba(219,227,245, 0.2)',
        borderBottomWidth: 1,
        paddingVertical: 20,
        flexDirection: 'row',
      }}
    >
      <View style={{ marginRight: 8 }}>{icon}</View>
      <View>
        <Text
          style={{
            ...theme.FONTS.Mulish_400Regular,
            fontSize: 14,
            color: '#B3B9C7',
            lineHeight: 14 * 1.7,
          }}
        >
          {lineOne}
        </Text>
        <Text
          style={{
            ...theme.FONTS.Mulish_400Regular,
            fontSize: 14,
            color: '#B3B9C7',
            lineHeight: 14 * 1.7,
          }}
        >
          {lineTwo}
        </Text>
      </View>
    </View>
  );
};

export default ContactCategory;
