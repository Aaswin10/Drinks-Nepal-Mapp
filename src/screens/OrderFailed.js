import { Text, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { setScreen } from '../store/tabSlice';
import { useNavigation } from '@react-navigation/native';

import { components } from '../components';
import { theme } from '../constants';
import { svg } from '../svg';

const OrderFailed = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: theme.SIZES.height * 0.1,
          alignItems: 'center',
        }}
      >
        <svg.FailSvg />
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
          Sorry! Your order has failed!
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
          Something went wrong. Please try{'\n'}again to contimue your order.
        </Text>
        <components.Button
          title="try again"
          containerStyle={{
            marginBottom: 23,
          }}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('MainLayout', dispatch(setScreen('Profile')))}
        >
          <Text
            style={{
              ...theme.FONTS.Mulish_600SemiBold,
              fontSize: 14,
              textTransform: 'uppercase',
              lineHeight: 14 * 1.7,
            }}
          >
            go to my profile
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

export default OrderFailed;
