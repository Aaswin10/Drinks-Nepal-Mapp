import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { useRegisterMutation } from '../../queries/authentication';
import { components } from '../components';
import { theme } from '../constants';
import { setLoading } from '../store/cartSlice';
import { setAccessToken, setIsAuthenticated, setRefreshToken, setUser } from '../store/userSlice';

const SignUp = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { phoneNumber } = route.params;

  const { mutate: registerMutation } = useRegisterMutation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const handleContinue = async () => {
    try {
      dispatch(setLoading(true));
      registerMutation(
        { phoneNumber, fullName, email },
        {
          onSuccess: async (data) => {
            if (data?.data?.accessToken && data?.data?.refreshToken && data?.data?.user) {
              dispatch(setUser(data.data.user));
              dispatch(setAccessToken(data.data.accessToken));
              dispatch(setRefreshToken(data.data.refreshToken));
              dispatch(setIsAuthenticated(true));
              dispatch(setLoading(false));
              await AsyncStorage.setItem('accessToken', data.data.accessToken);
              await AsyncStorage.setItem('refreshToken', data.data.refreshToken);

              navigation.navigate('AccountCreated', { phoneNumber });
            } else {
              Alert.alert('Error', 'Error Registering');
            }
          },
          onError: (error) => {
            console.log('Error Registering:', JSON.stringify(error));
            Alert.alert('Error', 'Error Registering');
            dispatch(setLoading(false));
          },
        },
      );
    } catch (error) {
      console.error('Error in handleContinue:', error);
      dispatch(setLoading(false));
    }
  };

  const renderHeader = () => {
    return <components.Header title="Sign up" goBack={true} height={40} />;
  };

  const renderContent = () => {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: theme.SIZES.height * 0.06,
          flexGrow: 1,
        }}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            textAlign: 'center',
            ...theme.FONTS.H1,
            marginBottom: 30,
            textTransform: 'capitalize',
            color: theme.COLORS.black,
          }}
        >
          Enter Your Details
        </Text>
        <components.InputField
          title="name"
          placeholder="Full Name"
          containerStyle={{ marginBottom: 20 }}
          check={true}
          value={fullName}
          onChangeText={setFullName}
        />
        <components.InputField
          title="Email"
          placeholder="Email"
          containerStyle={{ marginBottom: 20 }}
          check={true}
          value={email}
          onChangeText={setEmail}
        />
        <components.Button
          title="Continue"
          containerStyle={{ marginBottom: 20 }}
          onPress={handleContinue}
        />
      </KeyboardAwareScrollView>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.white }}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
};

export default SignUp;
