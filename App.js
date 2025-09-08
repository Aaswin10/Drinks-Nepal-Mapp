import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect } from 'react';
import FlashMessage from 'react-native-flash-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { requestLocationPermission } from './src/utils/locationUtils';
import InternetModal from './src/components/InternetModal';
import NetInfo from '@react-native-community/netinfo';
import { setConnectivity } from './src/store/connectivitySlice';
import { useDispatch, Provider } from 'react-redux';
import store from './src/store/store';
import StackNavigator from './src/navigation/StackNavigator';

import {
  Lato_100Thin,
  Lato_100Thin_Italic,
  Lato_300Light,
  Lato_300Light_Italic,
  Lato_400Regular,
  Lato_400Regular_Italic,
  Lato_700Bold,
  Lato_700Bold_Italic,
  Lato_900Black,
  Lato_900Black_Italic,
} from '@expo-google-fonts/lato';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      cacheTime: 1000 * 60 * 5,
      staleTime: 1000 * 30,
    },
  },
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function AppContent() {
  const dispatch = useDispatch();
  const [fontsLoaded] = useFonts({
    Lato_100Thin,
    Lato_100Thin_Italic,
    Lato_300Light,
    Lato_300Light_Italic,
    Lato_400Regular,
    Lato_400Regular_Italic,
    Lato_700Bold,
    Lato_700Bold_Italic,
    Lato_900Black,
    Lato_900Black_Italic,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      // await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      dispatch(setConnectivity(!!state.isConnected));
    });
    return () => unsubscribe();
  }, [dispatch]);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer independent={true}>
        <SafeAreaProvider onLayout={onLayoutRootView}>
          <StackNavigator />
          <InternetModal />
        </SafeAreaProvider>
        <FlashMessage position="top" statusBarHeight={20} floating={true} />
      </NavigationContainer>
    </QueryClientProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
