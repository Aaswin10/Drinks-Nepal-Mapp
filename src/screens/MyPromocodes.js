import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';

import { components } from '../components';
import { promocodes, theme } from '../constants';
import { svg } from '../svg';

const MyPromocodes = () => {
  const [category, setCategory] = useState('Current');

  const renderHeader = () => {
    return <components.Header title="My promocodes" goBack={true} />;
  };

  const renderCategory = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 20,
          marginTop: 20,
          borderBottomWidth: 1,
          borderBottomColor: theme.COLORS.lightBlue1,
        }}
      >
        <TouchableOpacity
          onPress={() => setCategory('Current')}
          style={{
            backgroundColor: category == 'Current' ? theme.COLORS.black : theme.COLORS.lightBlue1,
            borderRadius: 30,
            marginHorizontal: 4,
          }}
        >
          <Text
            style={{
              paddingHorizontal: 20,
              paddingVertical: 5,
              marginHorizontal: 4,
              fontFamily: 'Mulish_600SemiBold',
              fontSize: 14,
              lineHeight: 14 * 1.7,
              color: category == 'Current' ? theme.COLORS.white : theme.COLORS.black,
            }}
          >
            Current
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setCategory('Used')}
          style={{
            backgroundColor: category == 'Used' ? theme.COLORS.black : theme.COLORS.lightBlue1,
            borderRadius: 30,
            marginHorizontal: 4,
          }}
        >
          <Text
            style={{
              paddingHorizontal: 20,
              paddingVertical: 5,
              marginHorizontal: 4,
              fontFamily: 'Mulish_600SemiBold',
              fontSize: 14,
              lineHeight: 14 * 1.7,
              color: category == 'Used' ? theme.COLORS.white : theme.COLORS.black,
            }}
          >
            Used
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderPromocodes = () => {
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {promocodes.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{
              padding: 20,
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderColor: theme.COLORS.lightBlue1,
            }}
            onPress={() =>
              showMessage({
                message: 'Success',
                description: `${item.name} promocode was copied to clipboard`,
                type: 'success',
              })
            }
          >
            <components.ImageItem
              item={item}
              containerStyle={{ width: 73, height: 84, marginRight: 14 }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  ...theme.FONTS.H4,
                  color: theme.COLORS.black,
                }}
              >
                {item.name}
              </Text>
              <Text
                style={{
                  flex: 1,
                  fontSize: 21,
                  ...theme.FONTS.Mulish_600SemiBold,
                  color:
                    index === 0
                      ? '#F4303C'
                      : index === 1
                        ? '#EF962D'
                        : index === 2
                          ? '#00824B'
                          : index === 3
                            ? '#F4303C'
                            : index === 4
                              ? '#EF962D'
                              : index === 5
                                ? '#00824B'
                                : index === 6
                                  ? '#F4303C'
                                  : index === 7
                                    ? '#EF962D'
                                    : index === 8
                                      ? '#00824B'
                                      : index === 9
                                        ? '#F4303C'
                                        : '#EF962D',
                  lineHeight: 21 * 1.7,
                }}
              >
                {item.discount}% off
              </Text>
              <Text
                style={{
                  lineHeight: 14 * 1.7,
                  ...theme.FONTS.Mulish_400Regular,
                  fontSize: 14,
                  color: theme.COLORS.gray1,
                }}
              >
                {item.valid_till}
              </Text>
            </View>
            <View style={{ justifyContent: 'center' }}>
              <svg.CopySvg />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderPromocodesEmpty = () => {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          flexGrow: 1,
        }}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignSelf: 'center', marginTop: 26, marginBottom: 20 }}>
          <svg.Percent />
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
          Your don’t have{'\n'}promocodes yet!
        </Text>
        <Text
          style={{
            textAlign: 'center',
            marginBottom: 30,
            ...theme.FONTS.Mulish_400Regular,
            fontSize: 16,
            lineHeight: 16 * 1.7,
            color: theme.COLORS.gray1,
          }}
        >
          Qui ex aute ipsum duis. Incididunt{'\n'}adipisicing voluptate laborum
        </Text>
        <components.InputField
          title="Enter the voucher"
          placeholder="Promocode2022"
          containerStyle={{ marginBottom: 20 }}
        />
        <components.Button title="submit" containerStyle={{ marginBottom: 20 }} />
      </KeyboardAwareScrollView>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.white }}>
      {renderHeader()}
      {promocodes.length > 0 && renderCategory()}
      {promocodes.length > 0 ? renderPromocodes() : renderPromocodesEmpty()}
    </SafeAreaView>
  );
};

export default MyPromocodes;
