import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { components } from '../components';
import { theme } from '../constants';
import { svg } from '../svg';

const SignIn = () => {
  const navigation = useNavigation();
  const [rememberMe, setRememberMe] = useState(false);

  const renderHeader = () => {
    return <components.Header title="Sign in" goBack={true} />;
  };

  const renderContent = () => {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: theme.SIZES.height * 0.05,
          flexGrow: 1,
        }}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
      >
        <components.Line containerStyle={{ marginBottom: 14 }} />
        <Text
          style={{
            textAlign: 'center',
            ...theme.FONTS.H1,
            marginBottom: 14,
            textTransform: 'capitalize',
            color: theme.COLORS.black,
          }}
        >
          Welcome Back!
        </Text>
        <Text
          style={{
            textAlign: 'center',
            marginBottom: 30,
            lineHeight: 16 * 1.7,
            color: theme.COLORS.gray1,
            ...theme.FONTS.Mulish_400Regular,
            fontSize: 16,
          }}
        >
          Sign in to continue
        </Text>
        <components.InputField
          title="Email"
          placeholder="kristinwatson@mail.com"
          containerStyle={{ marginBottom: 20 }}
          check={true}
        />
        <components.InputField
          title="password"
          placeholder="••••••••"
          containerStyle={{ marginBottom: 20 }}
          eyeOffSvg={true}
          secureTextEntry={true}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 30,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => {
              setRememberMe((rememberMe) => !rememberMe);
            }}
          >
            <View
              style={{
                width: 18,
                height: 18,
                borderRadius: 5,
                borderWidth: 2,
                borderColor: theme.COLORS.lightBlue1,
                marginRight: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {rememberMe == true && (
                <View
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: theme.COLORS.lightBlue1,
                    borderRadius: 2,
                  }}
                />
              )}
            </View>
            <Text
              style={{
                ...theme.FONTS.Mulish_400Regular,
                fontSize: 16,
                lineHeight: 16 * 1.7,
                color: theme.COLORS.gray1,
              }}
            >
              Remember me
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text
              style={{
                ...theme.FONTS.Mulish_400Regular,
                fontSize: 16,
                lineHeight: 16 * 1.7,
                color: theme.COLORS.black,
              }}
            >
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>
        <components.Button
          title="Sign in"
          containerStyle={{ marginBottom: 20 }}
          onPress={() => navigation.navigate('MainLayout')}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 40,
          }}
        >
          <Text
            style={{
              fontFamily: 'Mulish_400Regular',
              fontSize: 16,
              color: theme.COLORS.gray1,
              marginRight: 3,
            }}
          >
            Don’t have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text
              style={{
                ...theme.FONTS.Mulish_400Regular,
                fontSize: 16,
                color: theme.COLORS.black,
              }}
            >
              Sign up.
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity style={{ marginHorizontal: 7 }} onPress={() => {}}>
            <svg.FacebookSvg />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginHorizontal: 7 }} onPress={() => {}}>
            <svg.TwitterSvg />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginHorizontal: 7 }} onPress={() => {}}>
            <svg.GoogleSvg />
          </TouchableOpacity>
        </View>
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

export default SignIn;
