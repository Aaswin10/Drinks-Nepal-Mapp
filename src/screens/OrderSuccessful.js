import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { components } from '../components';
import { theme } from '../constants';
import { svg } from '../svg';

const OrderSuccess = () => {
  const navigation = useNavigation();
  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: theme.SIZES.height * 0.1,
          alignItems: 'center',
        }}
      >
        <svg.SuccessSvg />
        <components.Line containerStyle={{ marginTop: 20, marginBottom: 15 }} />
        <Text
          style={{
            ...theme.FONTS.H2,
            color: theme.COLORS.black,
            lineHeight: 22 * 1.2,
            marginBottom: 14,
            textAlign: 'center',
          }}
        >
          Thank you for your order!
        </Text>
        <Text
          style={{
            ...theme.FONTS.Mulish_400Regular,
            fontSize: 16,
            color: theme.COLORS.gray1,
            textAlign: 'center',
            lineHeight: 16 * 1.7,
            marginBottom: 30,
          }}
        >
          Your order will be delivered on time.{'\n'}Thank you!
        </Text>
        <components.Button
          title="View orders"
          containerStyle={{
            marginBottom: 23,
          }}
          onPress={() => navigation.navigate('OrderHistory')}
        />
        <TouchableOpacity onPress={() => navigation.navigate('MainLayout')}>
          <Text
            style={{
              ...theme.FONTS.Mulish_600SemiBold,
              fontSize: 14,
              textTransform: 'uppercase',
              lineHeight: 14 * 1.7,
            }}
          >
            Continue Shopping
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.white }}>
      {renderContent()}
    </SafeAreaView>
  );
};

export default OrderSuccess;
