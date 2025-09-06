import React, { useCallback } from 'react';
import { Text, TouchableOpacity, View, BackHandler, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { setScreen } from '../store/tabSlice';
import { useFocusEffect } from '@react-navigation/native';
import { useResponsiveDimensions } from '../hooks/useResponsiveDimensions';
import { selectCartItemCount, selectCurrentScreen } from '../store/selectors';

import { screens } from '.';
import { theme } from '../constants';
import { svg } from '../svg';

const MainLayout = () => {
  const dispatch = useDispatch();
  const { getScaledSize } = useResponsiveDimensions();
  const cartItemCount = useSelector(selectCartItemCount);
  const currentScreen = useSelector(selectCurrentScreen);

  const styles = React.useMemo(() => createStyles(getScaledSize), [getScaledSize]);

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
        <View style={styles.cartIconContainer}>
          <svg.BagSvg
            iconColor={currentScreen === 'Cart' ? theme.COLORS.lightBlue1 : theme.COLORS.lightGray}
            bgColor={theme.COLORS.transparent}
          />
          {cartItemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.badgeText}>
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
    <SafeAreaView style={styles.container}>
      {currentScreen === 'Home' && <screens.HomeOne />}
      {currentScreen === 'Explore' && <screens.Search />}
      {currentScreen === 'Cart' && <screens.Order />}
      {currentScreen === 'Order' && <screens.OrderHistory />}
      {currentScreen === 'Profile' && <screens.Profile />}
      <View style={styles.tabBar}>
        {tabs.map((item, index) => {
          return item.screen === 'Cart' ? (
            <TouchableOpacity
              key={index}
              onPress={() => dispatch(setScreen(item.screen))}
              style={[styles.cartTab, { borderColor: item?.borderColor }]}
            >
              {item.icon}
              <Text style={[styles.cartTabText, { color: item?.color }]}>
                {item.screen}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              key={index}
              onPress={() => dispatch(setScreen(item.screen))}
              style={styles.tab}
            >
              {item.icon}
              <Text style={[styles.tabText, { color: item?.color }]}>
                {item.screen}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const createStyles = (getScaledSize) => ({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: getScaledSize(8),
    borderTopWidth: 1,
    borderTopColor: theme.COLORS.lightGray1,
    backgroundColor: theme.COLORS.white,
  },
  tab: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: getScaledSize(4),
  },
  cartTab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.COLORS.lightGray1,
    borderWidth: 0.5,
    borderRadius: getScaledSize(25),
    padding: getScaledSize(10),
  },
  tabText: {
    marginTop: getScaledSize(2),
    fontSize: getScaledSize(12),
    textAlign: 'center',
    ...theme.FONTS.Mulish_600SemiBold,
  },
  cartTabText: {
    marginLeft: getScaledSize(8),
    fontSize: getScaledSize(16),
    textAlign: 'center',
    fontWeight: 'bold',
    ...theme.FONTS.Mulish_600SemiBold,
  },
  cartIconContainer: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    right: -getScaledSize(30),
    top: -getScaledSize(8),
    backgroundColor: theme.COLORS.red,
    borderRadius: getScaledSize(10),
    minWidth: getScaledSize(20),
    height: getScaledSize(20),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: getScaledSize(4),
  },
  badgeText: {
    color: theme.COLORS.white,
    fontSize: getScaledSize(10),
    fontWeight: 'bold',
  },
});

export default MainLayout;
