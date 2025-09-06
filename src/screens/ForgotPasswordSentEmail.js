import { Text, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

import { components } from '../components';
import { theme } from '../constants';
import { svg } from '../svg';

const ForgotPasswordSentEmail = () => {
  const navigation = useNavigation();

  const renderHeader = () => {
    return <components.Header logo={true} />;
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingVertical: 40,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <svg.KeySvg />
        </View>
        <components.Line containerStyle={{ marginBottom: 14 }} />
        <Text
          style={{
            textAlign: 'center',
            ...theme.FONTS.H2,
            color: theme.COLORS.black,
            marginBottom: 14,
          }}
        >
          Your password has{'\n'}been reset!
        </Text>
        <Text
          style={{
            textAlign: 'center',
            ...theme.FONTS.Mulish_400Regular,
            fontSize: 16,
            color: theme.COLORS.gray1,
            lineHeight: 16 * 1.7,
            marginBottom: 30,
          }}
        >
          Qui ex aute ipsum duis. Incididunt{'\n'}adipisicing voluptate laborum
        </Text>
        <components.Button
          title="done"
          containerStyle={{ marginBottom: 30 }}
          onPress={() => navigation.navigate('SignIn')}
        />
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.white }}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
};

export default ForgotPasswordSentEmail;
