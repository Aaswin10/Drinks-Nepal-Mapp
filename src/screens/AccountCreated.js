import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { components } from '../components';
import { theme } from '../constants';
import { svg } from '../svg';

const AccountCreated = () => {
  const navigation = useNavigation();

  const renderHeader = () => {
    return <components.Header logo={true} />;
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignSelf: 'center', marginBottom: 20 }}>
          <svg.AccountUserSvg />
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
          Account Created!
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
          Welcome to Drinks Nepal!
        </Text>
        <components.Button
          title="done"
          onPress={() => navigation.navigate('MainLayout')}
          containerStyle={{ paddingHorizontal: 20 }}
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

export default AccountCreated;
