import { Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';

import { components } from '../components';
import { theme } from '../constants';

const NewPassword = () => {
  const navigation = useNavigation();
  const renderHeader = () => {
    return <components.Header title="Reset password" goBack={true} />;
  };

  const renderContent = () => {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          flexGrow: 1,
          paddingVertical: 30,
        }}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            ...theme.FONTS.Mulish_400Regular,
            fontSize: 16,
            color: theme.COLORS.black,
            lineHeight: 16 * 1.7,
            marginBottom: 40,
          }}
        >
          Enter new password and confirm.
        </Text>
        <components.InputField
          title="new password"
          secureTextEntry={true}
          placeholder="••••••••"
          containerStyle={{ marginBottom: 20 }}
          eyeOffSvg={true}
        />
        <components.InputField
          title="confirm password"
          secureTextEntry={true}
          placeholder="••••••••"
          containerStyle={{ marginBottom: 20 }}
          eyeOffSvg={true}
        />
        <components.Button
          title="change password"
          onPress={() => navigation.navigate('ForgotPasswordSentEmail')}
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

export default NewPassword;
