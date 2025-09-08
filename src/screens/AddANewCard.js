import React from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';

import { components } from '../components';
import { theme } from '../constants';
import { svg } from '../svg';

const AddANewCard = () => {
  const renderHeader = () => {
    return <components.Header title="Add a new card" goBack={true} />;
  };

  function renderContent() {
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
        <components.Line containerStyle={{ marginTop: 23, marginBottom: 14 }} />
        <components.SingleImageItem
          source={{
            uri: 'https://dl.dropbox.com/s/hy3jf5splox6af6/03.png?dl=0',
          }}
          containerStyle={{
            width: 279,
            height: 170,
            alignSelf: 'center',
            marginBottom: 40,
          }}
        />
        <components.InputField
          placeholder="Kristin Watson"
          title="Name"
          containerStyle={{ marginBottom: 20 }}
        />
        <components.InputField
          title="card number"
          placeholder="7741 6588 2123 6644"
          containerStyle={{ marginBottom: 20 }}
          keyboardType="phone-pad"
          icon={<svg.ScanCameraSvg />}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <components.InputField
            title="MM/yy"
            placeholder="12/23"
            containerStyle={{ width: '47%' }}
          />
          <components.InputField
            title="cvv"
            placeholder="•••"
            secureTextEntry={true}
            keyboardType="phone-pad"
            containerStyle={{ width: '47%' }}
          />
        </View>
        <components.Button title="save card" onPress={() => navigation.navigate('PaymentMethod')} />
      </KeyboardAwareScrollView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.white }}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
};

export default AddANewCard;
