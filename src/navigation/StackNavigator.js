import { createStackNavigator } from '@react-navigation/stack';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Platform, View } from 'react-native';

import { screens } from '../screens';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigation } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthenticateMutation, useUpdatePushTokenMutation } from '../../queries/authentication';
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

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Stack = createStackNavigator();

const StackNavigator = () => {
  const { mutate: authenticateMutation, isLoading } = useAuthenticateMutation();
  const { mutate: updatePushTokenMutation, isUpdatePushTokenLoading: updatePushTokenLoading } =
    useUpdatePushTokenMutation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [initialRoute, setInitialRoute] = useState('Onboarding');
  const notificationListener = useRef();
  const responseListener = useRef();
  const { loading } = useSelector((state) => state.cart);
  const queryClient = useQueryClient();

  useEffect(() => {
    dispatch(setLoading(isLoading || updatePushTokenLoading));
  }, [isLoading, updatePushTokenLoading]);

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
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
      return;
    }

    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants?.expoConfig?.extra?.eas?.projectId,
    });

    return token?.data;
  }

  const checkAuth = useCallback(async () => {
    console.log('Checking Auth');
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      console.log('Access Token in Storage:', accessToken);
      console.log('Refresh Token in Storage:', refreshToken);
      let tokens = { pushToken: null, accessToken: null, userId: null };

      if (accessToken && refreshToken) {
        dispatch(setAccessToken(accessToken));
        dispatch(setRefreshToken(refreshToken));

        await new Promise((resolve) => {
          authenticateMutation(
            { accessToken },
            {
              onSuccess: async (data) => {
                try {
                  console.log('Authentication success:', data);

                  await Promise.all([
                    dispatch(setAccessToken(accessToken)),
                    dispatch(setRefreshToken(refreshToken)),
                  ]);

                  dispatch(setIsAuthenticated(true));

                  if (!data?.data?.phoneNumber) {
                    setInitialRoute('SignUp');
                    navigation.navigate('SignUp', {
                      phoneNumber: data?.data?.phoneNumber,
                    });
                    resolve();
                    return;
                  }

                  dispatch(setUser(data.data));

                  const route =
                    data?.data?.role === 'deliveryGuy' ? 'DeliveryLayout' : 'MainLayout';

                  setInitialRoute(route);
                  tokens = {
                    pushToken: data?.data?.pushToken,
                    accessToken,
                    userId: data?.data?._id,
                  };
                  if (navigation.getCurrentRoute()?.name !== route) {
                    navigation.navigate(route);
                  }
                  resolve();
                } catch (err) {
                  console.log('Error in success callback:', err);
                  resolve();
                }
              },
              onError: async (error) => {
                console.log('Authentication error:', error);
                await AsyncStorage.removeItem('accessToken');
                await AsyncStorage.removeItem('refreshToken');
                dispatch(setIsAuthenticated(false));
                setInitialRoute('Onboarding');
                navigation.navigate('Onboarding');
                resolve();
              },
            },
          );
        });
        return tokens;
      } else {
        setInitialRoute('Onboarding');
        dispatch(setIsAuthenticated(false));
        navigation.navigate('Onboarding');
        return tokens;
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setInitialRoute('Onboarding');
      navigation.navigate('Onboarding');
      return { pushToken: null, accessToken: null };
    }
  }, [dispatch, navigation, authenticateMutation]);

  useEffect(() => {
    global.reInitializeAuth = initializeAuth;
  }, [initializeAuth]);

  const initializeAuth = useCallback(async () => {
    try {
      const { pushToken: userPushToken, accessToken, userId } = await checkAuth();

      if (!accessToken) return;

      const token = await registerForPushNotificationsAsync();

      if (token && token !== userPushToken) {
        updatePushTokenMutation(
          { pushToken: token, userId },
          {
            onSuccess: () => {
              console.log('Push Token Updated');
            },
            onError: (error) => console.log('Error updating push token', error),
          },
        );
      }

      // Set up notification listeners
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
            Alert.alert('Order assigned'); //TODO remove later
            queryClient.invalidateQueries({ queryKey: ['ordersForDeliveryGuy'] });
          }
        },
      );
    } catch (error) {
      console.error('Error initializing auth and push notifications:', error);
    }
  }, [checkAuth, updatePushTokenMutation]);

  useEffect(() => {
    initializeAuth();

    return () => {
      try {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      } catch (error) {
        console.log('Error removing notification subscription', error);
      }
    };
  }, []);

  return (
    <>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          gestureEnabled: false,
          cardStyle: { backgroundColor: 'white' },
        }}
      >
        <Stack.Screen name="Product" component={screens.Product} options={{ headerShown: false }} />
        <Stack.Screen name="Shop" component={screens.Shop} options={{ headerShown: false }} />
        <Stack.Screen
          name="CategoryShop"
          component={screens.CategoryShop}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Reviews" component={screens.Reviews} options={{ headerShown: false }} />
        <Stack.Screen
          name="EditProfile"
          component={screens.EditProfile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding"
          component={screens.Onboarding}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OrderHistory"
          component={screens.OrderHistory}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OrderDetails"
          component={screens.OrderDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TrackYourOrder"
          component={screens.TrackYourOrder}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OrderSuccessful"
          component={screens.OrderSuccessful}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OrderFailed"
          component={screens.OrderFailed}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LeaveAReviews"
          component={screens.LeaveAReviews}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ConfirmationCode"
          component={screens.ConfirmationCode}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="SignIn" component={screens.SignIn} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={screens.SignUp} options={{ headerShown: false }} />
        <Stack.Screen
          name="ForgotPassword"
          component={screens.ForgotPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyPromocodes"
          component={screens.MyPromocodes}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VerifyYourPhoneNumber"
          component={screens.VerifyYourPhoneNumber}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AccountCreated"
          component={screens.AccountCreated}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Checkout"
          component={screens.Checkout}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PaymentMethod"
          component={screens.PaymentMethod}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewPassword"
          component={screens.NewPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPasswordSentEmail"
          component={screens.ForgotPasswordSentEmail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddANewCard"
          component={screens.AddANewCard}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyAddress"
          component={screens.MyAddress}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddANewAddress"
          component={screens.AddANewAddress}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ShippingDetails"
          component={screens.CheckoutShippingDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="AboutUs" component={screens.AboutUs} options={{ headerShown: false }} />
        <Stack.Screen
          name="PrivacyPolicy"
          component={screens.PrivacyPolicy}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TermsOfService"
          component={screens.TermsOfService}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DOrderDetails"
          component={screens.DOrderDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="MainLayout" component={MainLayout} options={{ headerShown: false }} />
        <Stack.Screen
          name="DeliveryLayout"
          component={DeliveryLayout}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Notification"
          component={screens.Notification}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>

      {loading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255,255,255,0.7)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="large" color="#4285F4" />
        </View>
      )}
    </>
  );
};

export default StackNavigator;
