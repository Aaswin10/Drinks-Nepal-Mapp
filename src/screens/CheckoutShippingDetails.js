import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { OpenLocationCode } from 'open-location-code';
import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { components } from '../components';
import { theme } from '../constants';

const CheckoutShippingDetails = () => {
  const renderHeader = () => {
    return <components.Header title="Shipping details" goBack={true} />;
  };

  const navigation = useNavigation();

  const {
    user: { addresses },
  } = useSelector((state) => state.user);
  const [selectedAddress, setSelectedAddress] = useState(
    addresses.length > 0 ? addresses[0]._id : null,
  );
  const [markerPosition, setMarkerPosition] = useState({
    latitude: 27.7103,
    longitude: 85.3222,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const mapRef = useRef(null);
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

  useEffect(() => {
    if (selectedAddress) {
      const address = addresses.find((address) => address._id === selectedAddress);
      if (address) {
        setMarkerPosition({
          latitude: parseFloat(address.latitude),
          longitude: parseFloat(address.longitude),
        });
      }
    }
  }, [selectedAddress, addresses]);

  const handlePlaceSubmit = async () => {
    if (!selectedAddress) {
      setErrorMessage('Please select an address');
      return;
    }

    navigation.navigate('Checkout', {
      selectedAddressId: selectedAddress,
    });
  };

  const renderMap = () => (
    <View
      style={{
        width: '100%',
        height: theme.SIZES.height * 0.45,
        borderBottomWidth: 1,
        borderBottomColor: theme.COLORS.lightBlue1,
        marginBottom: 10,
        marginTop: 10,
      }}
    >
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ width: '100%', height: '100%' }}
        initialRegion={{
          latitude: markerPosition.latitude,
          longitude: markerPosition.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={markerPosition} />
      </MapView>
    </View>
  );

  const renderContent = () => {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginHorizontal: 20, marginVertical: 15 }}>
          <components.Button
            title="Add New Address"
            onPress={() => navigation.navigate('AddANewAddress')}
          />
        </View>
        {addresses &&
          addresses.length > 0 &&
          addresses.map((item) => {
            return (
              <TouchableOpacity
                key={item._id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                  borderColor: '#E1E6EF',
                  borderBottomWidth: 1,
                  borderRadius: 16,
                  marginHorizontal: 20,
                  marginBottom: 10,
                }}
                onPress={() => setSelectedAddress(item._id)}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      ...theme.FONTS.H5,
                      color: theme.COLORS.black,
                      marginBottom: 4,
                    }}
                    numberOfLines={1}
                  >
                    {item.addressDetails}
                  </Text>
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
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 20 / 2,
                    borderWidth: 2,
                    borderColor: theme.COLORS.lightBlue1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {selectedAddress === item._id && (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: theme.COLORS.accent,
                        borderRadius: 10 / 2,
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}

        {errorMessage ? (
          <Text style={{ color: theme.COLORS.red, textAlign: 'center', marginVertical: 10 }}>
            {errorMessage}
          </Text>
        ) : null}

        <View style={{ marginHorizontal: 20, marginBottom: 15 }}>
          <components.Button title="Submit" onPress={handlePlaceSubmit} />
        </View>
      </KeyboardAwareScrollView>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.white }}>
      {renderHeader()}
      {renderMap()}
      {renderContent()}
    </SafeAreaView>
  );
};

export default CheckoutShippingDetails;
