import { useNavigation, CommonActions, useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useCallback } from 'react';
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { theme } from '../constants';
import { svg } from '../svg';

import onBoardingImage from '../assets/onBoarding.png';
import Loading from '../assets/loading.png';

const AgeVerificationModal = ({ isVisible, onVerify }) => (
  <Modal animationType="fade" transparent={true} visible={isVisible}>
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 20,
      }}
    >
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 35,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <svg.LogoSvg />
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 10 }}>
          Are you 18 years or older?
        </Text>
        <Text style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>Just a quick check</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              borderColor: '#4285F4',
              borderWidth: 1,
              paddingVertical: 10,
              paddingHorizontal: 30,
              borderRadius: 20,
            }}
            onPress={() => onVerify(false)}
          >
            <Text style={{ color: '#4285F4' }}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#4285F4',
              paddingVertical: 10,
              paddingHorizontal: 30,
              borderRadius: 20,
            }}
            onPress={() => onVerify(true)}
          >
            <Text style={{ color: 'white' }}>Yes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const OnBoarding = () => {
  const navigation = useNavigation();

  // Get connectivity and user state from Redux
  const isConnected = useSelector((state) => state.connectivity?.isConnected);
  const { isAuthenticated, loading: userLoading } = useSelector((state) => ({
    isAuthenticated: state.user.isAuthenticated,
    loading: state.user.loading,
  }));

  const [screenState, setScreenState] = useState({
    isAgeModalVisible: true,
    isLoading: true,
  });

  // Check authentication status
  const checkAuth = useCallback(() => {
    if (userLoading) {
      setScreenState((prev) => ({ ...prev, isLoading: true }));
      return;
    }

    if (isAuthenticated) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'MainLayout' }],
        }),
      );
    } else {
      setScreenState((prev) => ({ ...prev, isAgeModalVisible: true, isLoading: false }));
    }
  }, [isAuthenticated, userLoading, navigation]);

  useFocusEffect(
    useCallback(() => {
      checkAuth();
    }, [checkAuth]),
  );

  // Back button handler
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!isAuthenticated) {
        BackHandler.exitApp();
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [isAuthenticated]);

  const handleAgeVerification = useCallback((isAdult) => {
    if (isAdult) {
      setScreenState((prev) => ({ ...prev, isAgeModalVisible: false }));
    } else {
      Alert.alert('Age Restriction', 'You must be 18 or older to use this app.', [
        { text: 'Exit', onPress: () => BackHandler.exitApp() },
      ]);
    }
  }, []);

  // If offline, don't render the onboarding screen (InternetModal will show globally)
  if (!isConnected) return null;

  // Show loading state
  if (screenState.isLoading || userLoading) {
    return (
      <View style={{ flex: 1 }}>
        <Image
          source={Loading}
          style={{ position: 'absolute', width: '100%', height: '100%', resizeMode: 'cover' }}
        />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.8)',
          }}
        >
          <ActivityIndicator size="large" color="#4285F4" />
        </View>
      </View>
    );
  }

  // Show age verification modal
  if (screenState.isAgeModalVisible) {
    return <AgeVerificationModal isVisible={true} onVerify={handleAgeVerification} />;
  }

  // Main OnBoarding content
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar style="dark" />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 20,
          marginTop: '40%',
        }}
      >
        <View style={{ alignItems: 'center' }}>
          <svg.LogoSvg />
          <Image
            source={onBoardingImage}
            style={{ width: 300, height: 200, resizeMode: 'contain' }}
          />
          <Text style={{ fontSize: 24, fontWeight: '600', marginTop: 20, textAlign: 'center' }}>
            Here you pick up a drink that fits all your criteria
          </Text>
          <Text style={{ fontSize: 16, color: '#666', marginTop: 10, textAlign: 'center' }}>
            Find low prices near you. We collect wine, beer and spirit prices from across the globe
            and put them on your mobile.
          </Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: theme.COLORS.lightBlue1,
            paddingVertical: 15,
            paddingHorizontal: 20,
            borderRadius: 25,
            width: '100%',
            alignItems: 'center',
            marginBottom: 20,
          }}
          onPress={() =>
            navigation.navigate('VerifyYourPhoneNumber', { fromAgeVerification: true })
          }
        >
          <Text style={{ color: theme.COLORS.white, fontSize: 16, fontWeight: 'bold' }}>
            Sign in via mobile number
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnBoarding;
