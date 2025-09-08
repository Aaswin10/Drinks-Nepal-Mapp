import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { useGenerateOtpMutation, useVerifyOtpMutation } from '../../queries/authentication';
import { components } from '../components';
import { theme } from '../constants';
import { setLoading } from '../store/cartSlice';
import { setAccessToken, setIsAuthenticated, setRefreshToken, setUser } from '../store/userSlice';
import { CommonActions } from '@react-navigation/native';

const ConfirmationCode = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { phoneNumber } = route.params;

  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const scrollViewRef = useRef(null);
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [finalOtp, setFinalOtp] = useState('');
  const otpInputs = useRef([]);

  const { mutate: verifyOtpMutation, isPending } = useVerifyOtpMutation();

  const { mutate: generateOtpMutation, isPending: isResendOtpLoading } = useGenerateOtpMutation();

  useEffect(() => {
    dispatch(setLoading(isPending || isResendOtpLoading));
  }, [isPending, isResendOtpLoading]);

  const handleResendOtp = async () => {
    try {
      generateOtpMutation(
        { phoneNumber },
        {
          onSuccess: () => {
            Alert.alert('Success', 'OTP resent successfully');
          },
          onError: (error) => {
            console.error('Error resending OTP:', JSON.stringify(error));
            Alert.alert('Error', 'Failed to resend OTP');
          },
        },
      );
    } catch (error) {
      console.error('Error resending OTP:', JSON.stringify(error));
      Alert.alert('Error', 'Failed to resend OTP');
    }
  };

  const handleContinue = async () => {
    try {
      verifyOtpMutation(
        { phoneNumber, otp: finalOtp },
        {
          onSuccess: async (data) => {
            if (data?.data?.accessToken && data?.data?.refreshToken) {
              // Store tokens in AsyncStorage
              await AsyncStorage.setItem('accessToken', data.data.accessToken);
              await AsyncStorage.setItem('refreshToken', data.data.refreshToken);

              if (data?.data?.user) {
                dispatch(setIsAuthenticated(true));
                dispatch(setAccessToken(data.data.accessToken));
                dispatch(setRefreshToken(data.data.refreshToken));
                dispatch(setUser(data.data.user));
                const route =
                  data?.data?.user.role === 'deliveryGuy' ? 'DeliveryLayout' : 'MainLayout';
                if (global.reInitializeAuth) {
                  global.reInitializeAuth();
                }
                navigation.navigate(route);
              } else {
                navigation.navigate('SignUp', { phoneNumber });
              }
            } else {
              Alert.alert('Error', 'OTP verification failed');
            }
          },
          onError: (error) => {
            console.log('Error verifyting OTP:', JSON.stringify(error));
            Alert.alert('Error', 'OTP verification failed');
          },
        },
      );
    } catch (error) {
      console.error('Error in handleContinue:', error);
      dispatch(setLoading(false));
    }
  };
  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text.length === 1 && index < 4) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
      otpInputs.current[index - 1].focus();
    }
  };

  useEffect(() => {
    setFinalOtp(otp.join(''));
  }, [otp]);

  // Ensure the screen can only be accessed from phone verification
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // Prevent going back to previous authentication steps
      e.preventDefault();
      
      // Reset to Phone Verification if trying to go back
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { 
              name: 'VerifyYourPhoneNumber', 
              params: { fromAgeVerification: true } 
            }
          ],
        })
      );
    });

    return unsubscribe;
  }, [navigation]);

  // Add back button handler
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // Always go back to Phone Verification
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              { 
                name: 'VerifyYourPhoneNumber', 
                params: { fromAgeVerification: true } 
              }
            ],
          })
        );
        return true;
      }
    );

    return () => backHandler.remove();
  }, [navigation]);

  const renderHeader = () => {
    return <components.Header title="Confirmation Code" goBack={true} height={42} />;
  };

  const renderContent = () => {
    return (
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={contentHeight > scrollViewHeight}
        onLayout={(event) => {
          setScrollViewHeight(event.nativeEvent.layout.height);
        }}
      >
        <View
          style={styles.contentContainer}
          onLayout={(event) => {
            setContentHeight(event.nativeEvent.layout.height);
          }}
        >
          <Text style={styles.titleText}>Verification Code</Text>
          <Text style={styles.descriptionText}>
            Please enter the code we have sent to your phone number {phoneNumber}
          </Text>
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <components.OtpNumber
                key={index}
                ref={(input) => (otpInputs.current[index] = input)}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleOtpKeyPress(e, index)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderButton = () => {
    const isOtpComplete = otp.every((digit) => digit !== '');

    return (
      <View style={[styles.buttonContainer]}>
        <View style={styles.resendContainer}>
          <Text style={styles.subText}>Didn&apos;t receive the OTP?</Text>
          <TouchableOpacity onPress={handleResendOtp}>
            <Text style={styles.resendText}>Resend</Text>
          </TouchableOpacity>
        </View>
        <components.Button
          disabled={!isOtpComplete}
          title="continue"
          onPress={handleContinue}
          style={{ marginTop: 20 }}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        {renderContent()}
        {renderButton()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 100,
  },
  titleText: {
    textAlign: 'center',
    ...theme.FONTS.H1,
    marginBottom: 30,
    textTransform: 'capitalize',
    color: theme.COLORS.black,
  },
  descriptionText: {
    ...theme.FONTS.Mulish_400Regular,
    fontSize: 16,
    color: theme.COLORS.gray1,
    lineHeight: 25,
    marginBottom: 40,
    textAlign: 'center',
  },
  subText: {
    ...theme.FONTS.Mulish_400Regular,
    fontSize: 14,
    color: theme.COLORS.gray1,
    lineHeight: 25,
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },

  otpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  resendText: {
    ...theme.FONTS.Mulish_400Regular,
    fontSize: 14,
    color: theme.COLORS.lightBlue1,
    lineHeight: 25,
    paddingHorizontal: 5,
  },
});

export default ConfirmationCode;
