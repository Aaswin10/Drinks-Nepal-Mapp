import React, { useCallback } from 'react';
import { Text, TouchableOpacity, View, BackHandler, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { setScreen } from '../store/tabSlice';
import { useFocusEffect } from '@react-navigation/native';

import { screens } from '.';
import { theme } from '../constants';
import { svg } from '../svg';

const MainLayout = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.list || []);
  const cartItemCount = cartItems.reduce((total, item) => {
    return total + item.volume.reduce((sum, vol) => sum + vol.quantity, 0);
  }, 0);

  const currentScreen = useSelector((state) => state.tab.screen);

  useFocusEffect(
    useCallback(() => {
      let backPressCount = 0;
      let backPressTimer = null;

      const onBackPress = () => {
        if (currentScreen !== 'Home') {
          dispatch(setScreen('Home'));
          return true;
        }
        
        if (backPressCount === 0) {
          backPressCount++;
          Alert.alert(
            'Exit App',
            'Do you want to exit?',
            [
              {
                text: 'Cancel',
                onPress: () => {
                  backPressCount = 0;
                  if (backPressTimer) clearTimeout(backPressTimer);
                },
                style: 'cancel'
              },
              { 
                text: 'Exit', 
                onPress: () => BackHandler.exitApp() 
              }
            ],
            { cancelable: false }
          );

          backPressTimer = setTimeout(() => {
            backPressCount = 0;
          }, 2000);

          return true;
        }

        return false;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => {
        backHandler.remove();
        if (backPressTimer) clearTimeout(backPressTimer);
      };
    }, [currentScreen, dispatch])
  );

  const tabs = [
    {
      id: '1',
      screen: 'Home',
      icon: (
        <svg.HomeSvg
          bgColor={currentScreen === 'Home' ? theme.COLORS.lightBlue1 : theme.COLORS.lightGray}
          iconColor={theme.COLORS.white}
        />
      ),
      color: currentScreen === 'Home' ? theme.COLORS.lightBlue1 : theme.COLORS.lightGray,
    },
    {
      id: '2',
      screen: 'Explore',
      icon: (
        <svg.ExploreSvg
          iconColor={currentScreen === 'Explore' ? theme.COLORS.lightBlue1 : theme.COLORS.lightGray}
          bgColor={theme.COLORS.transparent}
        />
      ),
      color: currentScreen === 'Explore' ? theme.COLORS.lightBlue1 : theme.COLORS.lightGray,
    },
    {
      id: '3',
      screen: 'Cart',
      icon: (
        <View style={{ position: 'relative' }}>
          <svg.BagSvg
            iconColor={currentScreen === 'Cart' ? theme.COLORS.lightBlue1 : theme.COLORS.lightGray}
            bgColor={theme.COLORS.transparent}
          />
          {cartItemCount > 0 && (
            <View
              style={{
                position: 'absolute',
                right: -60,
                top: -15,
                backgroundColor: theme.COLORS.red,
                borderRadius: 10,
                minWidth: 20,
                height: 20,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 4,
              }}
            >
              <Text
                style={{
                  color: theme.COLORS.white,
                  fontSize: 10,
                  fontWeight: 'bold',
                }}
              >
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </Text>
            </View>
          )}
        </View>
      ),
      color: currentScreen === 'Cart' ? theme.COLORS.lightBlue1 : theme.COLORS.lightGray,
      borderColor: currentScreen === 'Cart' ? theme.COLORS.lightBlue1 : theme.COLORS.lightGray2,
    },
    {
      id: '4',
      screen: 'Order',
      icon: (
        <svg.OrderSvg
          iconColor={currentScreen === 'Order' ? theme.COLORS.lightBlue1 : theme.COLORS.lightGray}
          bgColor={theme.COLORS.transparent}
        />
      ),
      color: currentScreen === 'Order' ? theme.COLORS.lightBlue1 : theme.COLORS.lightGray,
    },
    {
      id: '5',
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
      {currentScreen === 'Home' && <screens.HomeOne />}
      {currentScreen === 'Explore' && <screens.Search />}
      {currentScreen === 'Cart' && <screens.Order />}
      {currentScreen === 'Order' && <screens.OrderHistory />}
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
          return item.screen === 'Cart' ? (
            <TouchableOpacity
              key={index}
              onPress={() => dispatch(setScreen(item.screen))}
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.COLORS.lightGray1,
                borderColor: item?.borderColor,
                borderWidth: 0.5,
                borderRadius: 99,
                padding: 10,
              }}
            >
              {item.icon}
              <Text
                style={{
                  marginLeft: 8,
                  color: item?.color,
                  fontSize: 16,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  ...theme.FONTS.Mulish_600SemiBold,
                }}
              >
                {item.screen}
              </Text>
            </TouchableOpacity>
          ) : (
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

export default MainLayout;
