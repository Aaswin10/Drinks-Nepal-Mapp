import { BackHandler } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useGenerateOtpMutation } from '../../queries/authentication';
import { components } from '../components';
import { theme } from '../constants';
import { setLoading } from '../store/cartSlice';
import { useNavigation } from '@react-navigation/native';

const VerifyYourPhoneNumber = ({ route }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.cart);
  const scrollViewRef = useRef(null);

  // Ensure the screen can only be accessed from age verification
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      const { fromAgeVerification } = route.params || {};
      
      // Prevent going back unless it's from age verification
      if (!fromAgeVerification) {
        e.preventDefault();
        
        // Reset to Onboarding if trying to go back improperly
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Onboarding' }],
          })
        );
      }
    });

    return unsubscribe;
  }, [navigation, route.params]);

  // Add back button handler
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // Always go back to Onboarding when back is pressed
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Onboarding' }],
          })
        );
        return true;
      }
    );

    return () => backHandler.remove();
  }, [navigation]);

  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');

  const { isPending, mutate: generateOtpMutation } = useGenerateOtpMutation();

  useEffect(() => {
    dispatch(setLoading(isPending));
  }, [isPending]);

  const handleContinue = async () => {
    try {
      generateOtpMutation(
        { phoneNumber },
        {
          onSuccess: (data) => {
            if (data.data === true) {
              navigation.navigate('ConfirmationCode', { phoneNumber });
            } else {
              Alert.alert('Error', 'Error generating OTP');
            }
          },
          onError: (error) => {
            console.log('Error generating OTP:', JSON.stringify(error));
            Alert.alert('Error', 'Error generating OTP');
          },
        },
      );
    } catch (error) {
      console.error('Error in handleContinue:', error);
      dispatch(setLoading(false));
    }
  };

  const renderHeader = () => {
    return <components.Header title="Verify your phone number" goBack={true} height={42} />;
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
          <Text style={styles.titleText}>Your Phone Number</Text>
          <Text style={styles.descriptionText}>Enter your phone number to get started</Text>
          <components.InputField
            title="phone number"
            placeholder="+977 123456789"
            containerStyle={styles.inputField}
            keyboardType={'numeric'}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>
      </ScrollView>
    );
  };

  const renderButton = () => {
    return (
      <View style={[styles.buttonContainer]}>
        <Text style={styles.subText}>
          Make sure you can receive SMS messages on this number before you continue
        </Text>
        <components.Button
          title="continue"
          onPress={handleContinue}
          disabled={!phoneNumber || phoneNumber.length !== 10 || loading}
          loading={loading}
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
        keyboardVerticalOffset={insets.bottom + 20}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {renderContent()}
        </ScrollView>
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
    marginBottom: 10,
    textAlign: 'center',
  },
  inputField: {
    marginBottom: 20,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 50,
    alignItems: 'center',
  },
});

export default VerifyYourPhoneNumber;
