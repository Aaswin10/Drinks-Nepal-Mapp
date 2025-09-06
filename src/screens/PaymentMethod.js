import React from 'react';
import { Text, ScrollView, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { components } from '../components';
import { theme } from '../constants';
import { svg } from '../svg';

const creditCards = [
  {
    id: '1',
    image: 'https://dl.dropbox.com/s/8e2zgvf1qjo77tr/01.png?dl=0',
  },
  {
    id: '2',
    image: 'https://dl.dropbox.com/s/uplx035pg4crmkx/02.png?dl=0',
  },
  {
    id: '3',
    image: 'https://dl.dropbox.com/s/hy3jf5splox6af6/03.png?dl=0',
  },
];

const PaymentMethod = () => {
  const navigation = useNavigation();

  const renderHeader = () => {
    return <components.Header title="Payment Method" goBack={true} />;
  };

  const renderContent = () => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginTop: 20,
            marginBottom: 14,
          }}
        >
          <Text
            style={{
              ...theme.FONTS.H5,
              textTransform: 'capitalize',
              color: theme.COLORS.black,
            }}
          >
            Cards
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddANewCard')}>
            <svg.AddANewCardSvg />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20 }}
        >
          {creditCards.map((item, index) => {
            return (
              <View key={index} style={{ marginRight: 14 }}>
                <components.ImageItem item={item} containerStyle={{ width: 279, height: 170 }} />
                {/* <Image
                  source={{ uri: item }}
                  style={{ width: 279, height: 170 }}
                /> */}
              </View>
            );
          })}
        </ScrollView>
        <View style={{ marginTop: 10 }}>
          <components.PaymentSystem paymentSystem="Apple Pay" />
          <components.PaymentSystem paymentSystem="Pay Pal" />
          <components.PaymentSystem paymentSystem="Payoneer" />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.white }}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
};

export default PaymentMethod;
