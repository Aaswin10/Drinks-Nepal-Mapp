import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { screens } from '..';
import { theme } from '../../constants';
import { setScreen } from '../../store/tabSlice';
import { svg } from '../../svg';

const DeliveryLayout = () => {
  const dispatch = useDispatch();

  const currentScreen = useSelector((state) => state.tab.screen);

  const tabs = [
    {
      id: '1',
      screen: 'Home',
      icon: (
        <svg.OrderSvg
          iconColor={currentScreen === 'Home' ? theme.COLORS.lightBlue1 : theme.COLORS.lightGray}
          bgColor={theme.COLORS.transparent}
        />
      ),
      color: currentScreen === 'Home' ? theme.COLORS.lightBlue1 : theme.COLORS.lightGray,
    },
    {
      id: '2',
      screen: 'Profile',
      icon: (
        <svg.UserSvg
          iconColor={currentScreen === 'Profile' ? theme.COLORS.lightBlue1 : theme.COLORS.lightGray}
          bgColor={theme.COLORS.transparent}
        />
      ),
      color: currentScreen === 'Profile' ? theme.COLORS.lightBlue1 : theme.COLORS.lightGray,
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.white }}>
      {currentScreen === 'Home' && <screens.DOrders />}
      {currentScreen === 'Profile' && <screens.Profile />}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingVertical: 5,
          borderTopWidth: 1,
          borderTopColor: theme.COLORS.lightGray1,
        }}
      >
        {tabs.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => dispatch(setScreen(item.screen))}
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {item.icon}
              <Text
                style={{
                  marginTop: 2,
                  color: item?.color,
                  fontSize: 12,
                  textAlign: 'center',
                  ...theme.FONTS.Mulish_600SemiBold,
                }}
              >
                {item.screen}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default DeliveryLayout;
