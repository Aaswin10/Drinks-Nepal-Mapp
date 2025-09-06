import { Text, View, TextInput } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { theme } from '../constants';
import { components } from '../components';
import { svg } from '../svg';

const LeaveAReviews = () => {
  const navigation = useNavigation();

  const renderHeader = () => {
    return <components.Header title="Leave a review" goBack={true} />;
  };

  const renderContent = () => {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ alignSelf: 'center', marginTop: 26, marginBottom: 20 }}>
            <svg.Comment />
          </View>
          <components.Line containerStyle={{ marginBottom: 14 }} />
          <Text
            style={{
              textAlign: 'center',
              ...theme.FONTS.H2,
              color: theme.COLORS.black,
              marginBottom: 20,
            }}
          >
            Please rate the quality of{'\n'}service for the order!
          </Text>
          <View style={{ marginBottom: 20 }}>
            <components.RatingSelect />
          </View>
          <Text
            style={{
              textAlign: 'center',
              ...theme.FONTS.Mulish_400Regular,
              fontSize: 14,
              color: theme.COLORS.gray1,
              lineHeight: 14 * 1.5,
              marginBottom: 50,
            }}
          >
            Your comments and suggestions help us improve {'\n'} the service quality better!
          </Text>
          <View
            style={{
              marginBottom: theme.SIZES.height * 0.1,
            }}
          >
            <View
              style={{
                width: '100%',
                height: 131,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: theme.COLORS.lightBlue1,
              }}
            >
              <TextInput
                style={{
                  width: '100%',
                  height: '100%',
                  paddingHorizontal: 30,
                  paddingTop: 23,
                  paddingBottom: 23,
                }}
                placeholder="Enter your comment"
                textAlignVertical="top"
                multiline={true}
              />
              <View
                style={{
                  position: 'absolute',
                  top: -10,
                  left: 20,
                  paddingHorizontal: 10,
                  backgroundColor: theme.COLORS.white,
                }}
              >
                <Text
                  style={{
                    color: theme.COLORS.gray1,
                    fontFamily: 'Mulish_600SemiBold',
                    fontSize: 12,
                    textTransform: 'uppercase',
                  }}
                >
                  comment
                </Text>
              </View>
            </View>
          </View>
          <components.Button
            title="submit"
            onPress={() => navigation.navigate('OrderHistory')}
            containerStyle={{ marginBottom: 20 }}
          />
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

export default LeaveAReviews;
