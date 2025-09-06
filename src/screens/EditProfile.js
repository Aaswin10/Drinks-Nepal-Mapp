import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { components } from '../components';
import { theme } from '../constants';
import { svg } from '../svg';

const EditProfile = () => {
  const navigation = useNavigation();
  const renderHeader = () => {
    return <components.Header title="Edit profile" goBack={true} />;
  };

  const renderContent = () => {
    return (
      <KeyboardAwareScrollView>
        <components.Line containerStyle={{ marginTop: 23, marginBottom: 20 }} />
        <TouchableOpacity
          style={{
            width: 126,
            height: 126,
            marginBottom: 20,
            alignSelf: 'center',
          }}
          onPress={() => {}}
        >
          <components.SingleImageItem
            source={{
              uri: 'https://dl.dropbox.com/s/tcc67qouu0bzuzc/user.png?dl=0',
            }}
            containerStyle={{ width: '100%', height: '100%' }}
            imageStyle={{
              borderRadius: 63,
              borderWidth: 6,
              borderColor: theme.COLORS.lightBlue1,
            }}
          />
          <View style={{ position: 'absolute', right: 6, bottom: 6 }}>
            <svg.CameraSvg />
          </View>
        </TouchableOpacity>
        <View style={{ paddingHorizontal: 20 }}>
          <components.InputField
            containerStyle={{ marginTop: 23, marginBottom: 20 }}
            title="Name"
            placeholder="Kristin Watson"
          />
          <components.InputField
            containerStyle={{ marginBottom: 20 }}
            title="Email"
            placeholder="kristinwatson@mail.com"
          />
          <components.InputField
            containerStyle={{ marginBottom: 20 }}
            title="Phone number"
            placeholder="+17 123456789"
          />
          <components.InputField
            containerStyle={{ marginBottom: 20 }}
            title="location"
            placeholder="Chicago, USA"
          />
          <components.Button title="save changes" onPress={() => navigation.goBack()} />
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

export default EditProfile;
