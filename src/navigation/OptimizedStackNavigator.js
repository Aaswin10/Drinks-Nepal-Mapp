import { createStackNavigator } from '@react-navigation/stack';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { ActivityIndicator, Alert, Platform, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigation } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthenticateMutation, useUpdatePushTokenMutation } from '../../queries/authentication';
import { useResponsiveDimensions } from '../hooks/useResponsiveDimensions';
import { selectCartLoading } from '../store/selectors';
import { screens } from '../screens';
import DeliveryLayout from '../screens/DeliveryScreens/DeliveryLayout';
import MainLayout from '../screens/MainLayout';
import { setLoading } from '../store/cartSlice';
import {
  setAccessToken,
  setIsAuthenticated,
  setRefreshToken,
  setUser,
  updateUserNotification,
} from '../store/userSlice';
import { theme } from '../constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Stack = createStackNavigator();

const OptimizedStackNavigator = () => {
  const { mutate: authenticateMutation, isLoading } = useAuthenticateMutation();
  const { mutate: updatePushTokenMutation, isLoading: updatePushTokenLoading } =
    useUpdatePushTokenMutation();
  
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { getScaledSize } = useResponsiveDimensions();
  
  const [initialRoute, setInitialRoute] = useState('Onboarding');
  const notificationListener = useRef();
  const responseListener = useRef();
  
  const loading = useSelector(selectCartLoading);

  // Memoized styles
  const styles = useMemo(() => createStyles(getScaledSize), [getScaledSize]);

  useEffect(() => {
    dispatch(setLoading(isLoading || updatePushTokenLoading));
  }, [isLoading, updatePushTokenLoading, dispatch]);

  // Optimized push notification registration
  const registerForPushNotificationsAsync = useCallback(async () => {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }

    try {
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants?.expoConfig?.extra?.eas?.projectId,
      });
      return token?.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }, []);

  // Optimized authentication check
  const checkAuth = useCallback(async () => {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        AsyncStorage.getItem('accessToken'),
        AsyncStorage.getItem('refreshToken'),
      ]);

      if (!accessToken || !refreshToken) {
        setInitialRoute('Onboarding');
        dispatch(setIsAuthenticated(false));
        navigation.navigate('Onboarding');
        return { pushToken: null, accessToken: null, userId: null };
      }

      dispatch(setAccessToken(accessToken));
      dispatch(setRefreshToken(refreshToken));

      return new Promise((resolve) => {
        authenticateMutation(
          { accessToken },
          {
            onSuccess: async (data) => {
              try {
                dispatch(setIsAuthenticated(true));

                if (!data?.data?.phoneNumber) {
                  setInitialRoute('SignUp');
                  navigation.navigate('SignUp', { phoneNumber: data?.data?.phoneNumber });
                  resolve({ pushToken: null, accessToken, userId: null });
                  return;
                }

                dispatch(setUser(data.data));

                const route = data?.data?.role === 'deliveryGuy' ? 'DeliveryLayout' : 'MainLayout';
                setInitialRoute(route);
                
                if (navigation.getCurrentRoute()?.name !== route) {
                  navigation.navigate(route);
                }

                resolve({
                  pushToken: data?.data?.pushToken,
                  accessToken,
                  userId: data?.data?._id,
                });
              } catch (err) {
                console.error('Error in success callback:', err);
                resolve({ pushToken: null, accessToken: null, userId: null });
              }
            },
            onError: async (error) => {
              console.error('Authentication error:', error);
              await Promise.all([
                AsyncStorage.removeItem('accessToken'),
                AsyncStorage.removeItem('refreshToken'),
              ]);
              dispatch(setIsAuthenticated(false));
              setInitialRoute('Onboarding');
              navigation.navigate('Onboarding');
              resolve({ pushToken: null, accessToken: null, userId: null });
            },
          }
        );
      });
    } catch (error) {
      console.error('Error checking auth:', error);
      setInitialRoute('Onboarding');
      navigation.navigate('Onboarding');
      return { pushToken: null, accessToken: null, userId: null };
    }
  }, [dispatch, navigation, authenticateMutation]);

  // Optimized initialization
  const initializeAuth = useCallback(async () => {
    try {
      const { pushToken: userPushToken, accessToken, userId } = await checkAuth();

      if (!accessToken) return;

      const token = await registerForPushNotificationsAsync();

      if (token && token !== userPushToken && userId) {
        updatePushTokenMutation(
          { pushToken: token, userId },
          {
            onSuccess: () => console.log('Push Token Updated'),
            onError: (error) => console.error('Error updating push token:', error),
          }
        );
      }

      // Set up notification listeners with cleanup
      notificationListener.current = Notifications.addNotificationReceivedListener(
        (notification) => {
          const notificationData = {
            title: notification.request?.content?.title,
            message: notification.request?.content?.body,
            orderId: notification.request?.content?.data?.orderId,
            createdAt: notification.request?.content?.data?.createdAt,
            _id: notification.request?.content?.data?._id,
          };

          if (notificationData?.title !== 'New Order Assigned') {
            dispatch(updateUserNotification(notificationData));
          } else {
            Alert.alert('Order assigned');
            queryClient.invalidateQueries({ queryKey: ['ordersForDeliveryGuy'] });
          }
        }
      );
    } catch (error) {
      console.error('Error initializing auth and push notifications:', error);
    }
  }, [checkAuth, updatePushTokenMutation, dispatch, queryClient, registerForPushNotificationsAsync]);

  useEffect(() => {
    initializeAuth();

    return () => {
      try {
        if (notificationListener.current) {
          Notifications.removeNotificationSubscription(notificationListener.current);
        }
        if (responseListener.current) {
          Notifications.removeNotificationSubscription(responseListener.current);
        }
      } catch (error) {
        console.error('Error removing notification subscription:', error);
      }
    };
  }, [initializeAuth]);

  // Memoized screen options
  const screenOptions = useMemo(() => ({
    gestureEnabled: false,
    cardStyle: { backgroundColor: 'white' },
    headerShown: false,
  }), []);

  return (
    <>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={screenOptions}
      >
        <Stack.Screen name="Product" component={screens.Product} />
        <Stack.Screen name="Shop" component={screens.Shop} />
        <Stack.Screen name="CategoryShop" component={screens.CategoryShop} />
        <Stack.Screen name="Reviews" component={screens.Reviews} />
        <Stack.Screen name="EditProfile" component={screens.EditProfile} />
        <Stack.Screen name="Onboarding" component={screens.Onboarding} />
        <Stack.Screen name="OrderHistory" component={screens.OrderHistory} />
        <Stack.Screen name="OrderDetails" component={screens.OrderDetails} />
        <Stack.Screen name="TrackYourOrder" component={screens.TrackYourOrder} />
        <Stack.Screen name="OrderSuccessful" component={screens.OrderSuccessful} />
        <Stack.Screen name="OrderFailed" component={screens.OrderFailed} />
        <Stack.Screen name="LeaveAReviews" component={screens.LeaveAReviews} />
        <Stack.Screen name="ConfirmationCode" component={screens.ConfirmationCode} />
        <Stack.Screen name="SignIn" component={screens.SignIn} />
        <Stack.Screen name="SignUp" component={screens.SignUp} />
        <Stack.Screen name="ForgotPassword" component={screens.ForgotPassword} />
        <Stack.Screen name="MyPromocodes" component={screens.MyPromocodes} />
        <Stack.Screen name="VerifyYourPhoneNumber" component={screens.VerifyYourPhoneNumber} />
        <Stack.Screen name="AccountCreated" component={screens.AccountCreated} />
        <Stack.Screen name="Checkout" component={screens.Checkout} />
        <Stack.Screen name="PaymentMethod" component={screens.PaymentMethod} />
        <Stack.Screen name="NewPassword" component={screens.NewPassword} />
        <Stack.Screen name="ForgotPasswordSentEmail" component={screens.ForgotPasswordSentEmail} />
        <Stack.Screen name="AddANewCard" component={screens.AddANewCard} />
        <Stack.Screen name="MyAddress" component={screens.MyAddress} />
        <Stack.Screen name="AddANewAddress" component={screens.AddANewAddress} />
        <Stack.Screen name="ShippingDetails" component={screens.CheckoutShippingDetails} />
        <Stack.Screen name="AboutUs" component={screens.AboutUs} />
        <Stack.Screen name="PrivacyPolicy" component={screens.PrivacyPolicy} />
        <Stack.Screen name="TermsOfService" component={screens.TermsOfService} />
        <Stack.Screen name="DOrderDetails" component={screens.DOrderDetails} />
        <Stack.Screen name="MainLayout" component={MainLayout} />
        <Stack.Screen name="DeliveryLayout" component={DeliveryLayout} />
        <Stack.Screen name="Notification" component={screens.Notification} />
      </Stack.Navigator>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.COLORS.lightBlue1} />
        </View>
      )}
    </>
  );
};

const createStyles = (getScaledSize) => StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});

export default OptimizedStackNavigator;