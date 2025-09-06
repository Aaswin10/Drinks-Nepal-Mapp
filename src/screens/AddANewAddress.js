import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import {
  useDeleteAddressMutation,
  useEditAddressMutation,
  useSubmitAddressMutation,
} from '../../queries/address';
import { validateRequired } from '../utils/errorHandler';
import { components } from '../components';
import { theme } from '../constants';
import { updateUserAddresses } from '../store/userSlice';

const AddANewAddress = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {
    user: { _id: userId },
  } = useSelector((state) => state.user);

  const editingAddress = route?.params?.address;
  const mapRef = useRef(null);

  const [rememberMe, setRememberMe] = useState(null);
  const [placeName, setPlaceName] = useState('');

  const [isDefault, setIsDefault] = useState(editingAddress?.isDefault || false);
  const [markerPosition, setMarkerPosition] = useState({
    latitude: editingAddress?.latitude || 27.7103,
    longitude: editingAddress?.longitude || 85.3222,
  });
  const [title, setTitle] = useState(editingAddress?.addressDetails || '');
  const [titleError, setTitleError] = useState('');

  const [address, setAddress] = useState(
    editingAddress ? `${editingAddress.latitude}, ${editingAddress.longitude}` : '',
  );
  useEffect(() => {
    if (editingAddress) {
      console.log('editingAddress', editingAddress);
      setAddress(`${editingAddress.latitude}, ${editingAddress.longitude}`);
    }
  }, [editingAddress]);

  useEffect(() => {
    console.log('address', address);
  }, [address]);

  const { mutate: submitAddress, isLoading } = useSubmitAddressMutation();
  const { mutate: editAddress } = useEditAddressMutation();

  useEffect(() => {
    if (rememberMe) {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Permission to access location was denied');
          setRememberMe(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const newPosition = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setMarkerPosition(newPosition);
        setAddress(`${newPosition.latitude.toFixed(6)}, ${newPosition.longitude.toFixed(6)}`);

        // Animate map to new position
        mapRef.current?.animateToRegion({
          ...newPosition,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      })();
    } else if (rememberMe === false) {
      // Only run this when explicitly unchecking
      // Clear coordinates when unchecking "Use current location"
      const defaultPosition = {
        latitude: 27.7103,
        longitude: 85.3222,
      };
      setMarkerPosition(defaultPosition);
      setAddress('');

      // Animate map to default position
      mapRef.current?.animateToRegion({
        ...defaultPosition,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [rememberMe]);

  // Effect to handle initial position when editing address
  useEffect(() => {
    if (editingAddress?.latitude && editingAddress?.longitude) {
      const editPosition = {
        latitude: editingAddress.latitude,
        longitude: editingAddress.longitude,
      };
      mapRef.current?.animateToRegion({
        ...editPosition,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [editingAddress]);

  const handlePlaceNameChange = async (text) => {
    setPlaceName(text);
    if (text) {
      try {
        const geocode = await Location.geocodeAsync(text);
        if (geocode.length > 0) {
          const { latitude, longitude } = geocode[0];
          const newPosition = { latitude, longitude };
          setMarkerPosition(newPosition);

          mapRef.current?.animateToRegion({
            ...newPosition,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }
      } catch (error) {
        console.error('Geocoding error:', error);
      }
    }
  };

  const renderHeader = () => {
    return <components.Header title="Add a new address" goBack={true} />;
  };

  const renderMap = () => {
    return (
      <View
        style={{
          width: '100%',
          height: theme.SIZES.height * 0.45,
          borderBottomWidth: 1,
          borderBottomColor: theme.COLORS.lightBlue1,
          marginBottom: 29,
          marginTop: 10,
        }}
      >
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={{
            width: '100%',
            height: '100%',
          }}
          initialRegion={{
            latitude: markerPosition.latitude,
            longitude: markerPosition.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={(e) => {
            setMarkerPosition(e.nativeEvent.coordinate);
            setAddress(
              `${e.nativeEvent.coordinate.latitude.toFixed(6)}, ${e.nativeEvent.coordinate.longitude.toFixed(6)}`,
            );
            setRememberMe(null);
          }}
        >
          <Marker
            coordinate={markerPosition}
            draggable
            onDragEnd={(e) => {
              setMarkerPosition(e.nativeEvent.coordinate);
              setAddress(
                `${e.nativeEvent.coordinate.latitude.toFixed(6)}, ${e.nativeEvent.coordinate.longitude.toFixed(6)}`,
              );
              setRememberMe(null);
            }}
          />
        </MapView>
      </View>
    );
  };

  const handleSubmit = () => {
    // Validate required fields
    const titleValidation = validateRequired(title, 'Address details');
    if (titleValidation) {
      setTitleError(titleValidation);
      return;
    }
    
    setTitleError('');
    
    if (!userId) {
      Alert.alert('Error', 'User not authenticated. Please log in.');
      return;
    }

    const addressData = {
      userId,
      longitude: markerPosition?.longitude,
      latitude: markerPosition?.latitude,
      addressDetails: title,
      isDefault: isDefault,
    };

    if (editingAddress) {
      editAddress(
        { ...addressData, addressId: editingAddress._id },
        {
          onSuccess: (response) => {
            dispatch(
              updateUserAddresses((currentAddresses) => {
                // If setting this address as default, remove default from other addresses
                if (isDefault) {
                  return currentAddresses.map((addr) => ({
                    ...addr,
                    isDefault: addr._id === editingAddress._id,
                    ...(addr._id === editingAddress._id ? response.data : {}),
                  }));
                }
                // Otherwise just update the edited address
                return currentAddresses.map((addr) =>
                  addr._id === editingAddress._id ? response.data : addr,
                );
              }),
            );

            Alert.alert('Success', 'Address updated!');
            navigation.goBack();
          },
          onError: (error) => {
            console.error('Error updating address:', error);
            Alert.alert('Error', 'Failed to update address.');
          },
        },
      );
    } else {
      submitAddress(addressData, {
        onSuccess: (response) => {
          console.log('Full API Response:', response);

          dispatch(
            updateUserAddresses((currentAddresses) => {
              // If setting new address as default, remove default from other addresses
              if (isDefault) {
                return [
                  ...currentAddresses.map((addr) => ({ ...addr, isDefault: false })),
                  response.data,
                ];
              }
              return [...currentAddresses, response.data];
            }),
          );
          Alert.alert('Success', 'Address added!');
          navigation.goBack();
        },
        onError: (error) => {
          console.error('Error adding address:', error);
          Alert.alert('Error', 'Failed to save address.');
        },
      });
    }
  };
  const { mutate: deleteAddressMutation } = useDeleteAddressMutation();

  const handleDeleteAddress = () => {
    if (!editingAddress) {
      Alert.alert('Error', 'No address selected for deletion.');
      return;
    }

    deleteAddressMutation(
      { userId, addressId: editingAddress._id },
      {
        onSuccess: () => {
          dispatch(
            updateUserAddresses((currentAddresses) =>
              currentAddresses.filter((addr) => addr._id !== editingAddress._id),
            ),
          );

          Alert.alert('Success', 'Address deleted!');
          navigation.goBack();
        },
        onError: (error) => {
          console.error('Error deleting address:', error);
          Alert.alert('Error', 'Failed to delete address.');
        },
      },
    );
  };

  function renderContent() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 20,
          flexGrow: 1,
        }}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
      >
        <components.InputField
          title="Address Details"
          placeholder="Address Details"
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            if (titleError) setTitleError('');
          }}
          error={titleError}
          required={true}
          containerStyle={{
            marginBottom: 16,
          }}
        />
        <components.InputField
          placeholder="Enter Place Name"
          value={placeName}
          onChangeText={handlePlaceNameChange}
          containerStyle={{
            marginBottom: 20,
          }}
        />
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 5,
              borderWidth: 2,
              borderColor: theme.COLORS.lightBlue1,
              marginRight: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {rememberMe === true && (
              <View
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: theme.COLORS.lightBlue1,
                  borderRadius: 2,
                }}
              />
            )}
          </View>
          <Text
            style={{
              ...theme.FONTS.Mulish_400Regular,
              fontSize: 16,
              lineHeight: 16 * 1.7,
              color: theme.COLORS.gray1,
            }}
          >
            Use current location
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}
          onPress={() => setIsDefault(!isDefault)}
        >
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 5,
              borderWidth: 2,
              borderColor: theme.COLORS.lightBlue1,
              marginRight: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {isDefault === true && (
              <View
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: theme.COLORS.lightBlue1,
                  borderRadius: 2,
                }}
              />
            )}
          </View>
          <Text
            style={{
              ...theme.FONTS.Mulish_400Regular,
              fontSize: 16,
              lineHeight: 16 * 1.7,
              color: theme.COLORS.gray1,
            }}
          >
            Set as default address
          </Text>
        </TouchableOpacity>
        <components.Button
          title="save address"
          containerStyle={{ marginBottom: 30 }}
          onPress={handleSubmit}
          disabled={isLoading}
        />
        {editingAddress && (
          <components.Button
            title="delete address"
            containerStyle={{ marginBottom: 30 }}
            color={theme.COLORS.red}
            onPress={handleDeleteAddress}
          />
        )}
      </KeyboardAwareScrollView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.white }}>
      {renderHeader()}
      {renderMap()}
      {renderContent()}
    </SafeAreaView>
  );
};

export default AddANewAddress;
