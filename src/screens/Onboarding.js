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
  StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useResponsiveDimensions } from '../hooks/useResponsiveDimensions';
import { theme } from '../constants';
import { svg } from '../svg';

import onBoardingImage from '../assets/onBoarding.png';
import Loading from '../assets/loading.png';

const AgeVerificationModal = ({ isVisible, onVerify, styles }) => (
  <Modal animationType="fade" transparent={true} visible={isVisible}>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <svg.LogoSvg />
        <Text style={styles.modalTitle}>Are you 18 years or older?</Text>
        <Text style={styles.modalSubtitle}>Just a quick check</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.noButton} onPress={() => onVerify(false)}>
            <Text style={styles.noButtonText}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.yesButton} onPress={() => onVerify(true)}>
            <Text style={styles.yesButtonText}>Yes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const OnBoarding = () => {
  const navigation = useNavigation();
  const { getScaledSize } = useResponsiveDimensions();

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

  const styles = React.useMemo(() => createStyles(getScaledSize), [getScaledSize]);

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
      <View style={styles.loadingContainer}>
        <Image
          source={Loading}
          style={styles.loadingBackground}
        />
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.COLORS.lightBlue1} />
        </View>
      </View>
    );
  }

  // Show age verification modal
  if (screenState.isAgeModalVisible) {
    return <AgeVerificationModal isVisible={true} onVerify={handleAgeVerification} styles={styles} />;
  }

  // Main OnBoarding content
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.topSection}>
          <svg.LogoSvg />
          <Image
            source={onBoardingImage}
            style={styles.onboardingImage}
          />
          <Text style={styles.title}>
            Here you pick up a drink that fits all your criteria
          </Text>
          <Text style={styles.subtitle}>
            Find low prices near you. We collect wine, beer and spirit prices from across the globe
            and put them on your mobile.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() =>
            navigation.navigate('VerifyYourPhoneNumber', { fromAgeVerification: true })
          }
        >
          <Text style={styles.signInButtonText}>
            Sign in via mobile number
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (getScaledSize) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
  },
  loadingBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: getScaledSize(20),
    paddingTop: '20%',
  },
  topSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  onboardingImage: {
    width: getScaledSize(300),
    height: getScaledSize(200),
    resizeMode: 'contain',
    marginVertical: getScaledSize(20),
  },
  title: {
    fontSize: getScaledSize(24),
    fontWeight: '600',
    marginTop: getScaledSize(20),
    textAlign: 'center',
    color: theme.COLORS.black,
    ...theme.FONTS.H2,
  },
  subtitle: {
    fontSize: getScaledSize(16),
    color: theme.COLORS.gray1,
    marginTop: getScaledSize(10),
    textAlign: 'center',
    ...theme.FONTS.Mulish_400Regular,
    lineHeight: getScaledSize(24),
  },
  signInButton: {
    backgroundColor: theme.COLORS.lightBlue1,
    paddingVertical: getScaledSize(15),
    paddingHorizontal: getScaledSize(20),
    borderRadius: getScaledSize(25),
    width: '100%',
    alignItems: 'center',
    marginBottom: getScaledSize(20),
  },
  signInButtonText: {
    color: theme.COLORS.white,
    fontSize: getScaledSize(16),
    fontWeight: 'bold',
    ...theme.FONTS.Mulish_700Bold,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: getScaledSize(20),
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: getScaledSize(20),
    padding: getScaledSize(35),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
    maxWidth: getScaledSize(400),
  },
  modalTitle: {
    fontSize: getScaledSize(18),
    fontWeight: 'bold',
    marginVertical: getScaledSize(10),
    textAlign: 'center',
    ...theme.FONTS.H3,
  },
  modalSubtitle: {
    fontSize: getScaledSize(14),
    color: theme.COLORS.gray1,
    marginBottom: getScaledSize(20),
    textAlign: 'center',
    ...theme.FONTS.Mulish_400Regular,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: getScaledSize(15),
  },
  noButton: {
    flex: 1,
    backgroundColor: 'white',
    borderColor: theme.COLORS.lightBlue1,
    borderWidth: 1,
    paddingVertical: getScaledSize(10),
    paddingHorizontal: getScaledSize(20),
    borderRadius: getScaledSize(20),
    alignItems: 'center',
  },
  yesButton: {
    flex: 1,
    backgroundColor: theme.COLORS.lightBlue1,
    paddingVertical: getScaledSize(10),
    paddingHorizontal: getScaledSize(20),
    borderRadius: getScaledSize(20),
    alignItems: 'center',
  },
  noButtonText: {
    color: theme.COLORS.lightBlue1,
    fontSize: getScaledSize(16),
    ...theme.FONTS.Mulish_600SemiBold,
  },
  yesButtonText: {
    color: 'white',
    fontSize: getScaledSize(16),
    ...theme.FONTS.Mulish_600SemiBold,
  },
});

export default OnBoarding;
