import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as Location from 'expo-location';
import { OpenLocationCode } from 'open-location-code';
import { useSelector } from 'react-redux';
import { selectUserAddresses } from '../store/selectors';
import { components } from '../components';
import { theme } from '../constants';
import { svg } from '../svg';

const MyAddress = () => {
  const navigation = useNavigation();
  const renderHeader = () => {
    return <components.Header title="My address" goBack={true} height={42} />;
  };

  const addresses = useSelector(selectUserAddresses);

  const [geocodedAddresses, setGeocodedAddresses] = useState({});

  const reverseGeocode = async (address) => {
    try {
      const result = await Location.reverseGeocodeAsync({
        latitude: address?.latitude,
        longitude: address?.longitude,
      });
      // Generate Plus Code
      const plusCode = new OpenLocationCode().encode(address?.latitude, address?.longitude, 10);

      if (result && result[0]) {
        const location = result[0];
        const address = [
          location.street,
          location.city,
          location.region,
          location.postalCode,
          location.country,
        ]
          .filter(Boolean)
          .join(', ');

        return `${plusCode} - ${address}`;
      }
    } catch (error) {
      console.log('Error getting address:', error);
    }
  };

  useEffect(() => {
    const fetchAddresses = async (item) => {
      if (!item?.longitude || !item?.latitude) return;

      const result = await reverseGeocode(item);
      setGeocodedAddresses((prev) => ({
        ...prev,
        [item._id]: result,
      }));
    };

    if (addresses && addresses.length > 0) {
      addresses.forEach((item) => {
        fetchAddresses(item);
      });
    }
  }, [addresses]);

  function renderContent() {
    const sortedAddresses = [...(addresses || [])].sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return 0;
    });

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 10 }}
      >
        <View className="mx-3">
          <Pressable
            className="w-full h-14 my-2 flex justify-between items-center flex-row space-x-3 rounded-2xl border border-[#E1E6EF] shadow-sm bg-white"
            onPress={() => navigation.navigate('AddANewAddress')}
          >
            <View className="flex flex-row items-center space-x-2 pl-4">
              <svg.PlusBlueSvg />
              <Text className="text-[#2f6fed] text-base font-semibold">Add New Address</Text>
            </View>
            <View className="pr-2">
              <svg.ArrowRightSvg />
            </View>
          </Pressable>
        </View>
        <View className="flex-row items-center justify-center border-blue-300 px-4 py-2 mb-4">
          <View className="flex-1 h-px bg-gray-300 mr-2" />
          <Text className="text-gray-600 font-semibold">SAVED ADDRESSES</Text>
          <View className="flex-1 h-px bg-gray-300 ml-2" />
        </View>
        {sortedAddresses.length > 0 ? (
          sortedAddresses.map((item) => {
            return (
              <TouchableOpacity
                key={item._id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderWidth: 1,
                  borderColor: '#E1E6EF',
                  borderRadius: 16,
                  marginHorizontal: 20,
                  marginBottom: 16,
                  backgroundColor: item.isDefault ? '#F5F9FF' : 'white',
                }}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    borderColor: theme.COLORS.lightBlue1,
                    borderWidth: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 14,
                  }}
                >
                  <svg.MapPinSvg />
                </View>
                <View style={{ flex: 1 }}>
                  <View className="flex-row items-center space-x-2">
                    <Text
                      style={{
                        ...theme.FONTS.H5,
                        marginBottom: 4,
                      }}
                    >
                      {item.addressDetails}
                    </Text>
                    {item.isDefault && (
                      <View className="bg-blue-100 px-2 py-1 rounded">
                        <Text className="text-xs text-blue-600">Default</Text>
                      </View>
                    )}
                  </View>
                  <Text
                    style={{
                      ...theme.FONTS.Mulish_400Regular,
                      fontSize: 14,
                      color: theme.COLORS.gray1,
                    }}
                  >
                    {item?.longitude && item?.latitude
                      ? geocodedAddresses[item._id] || 'Loading address...'
                      : 'No coordinates provided'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('AddANewAddress', { address: item })}
                  className="p-2"
                >
                  <svg.EditSvg />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })
        ) : (
          <Text>No addresses found</Text>
        )}
      </ScrollView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.white }}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
};

export default MyAddress;
