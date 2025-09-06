// screens/OrderDetails.js
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import * as Location from 'expo-location';
import { OpenLocationCode } from 'open-location-code';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useUpdateOrderStatusMutation } from '../../../queries/order';
import { components } from '../../components';
import { theme } from '../../constants';
import { setLoading } from '../../store/cartSlice';
import { formatDateTime } from './functions';

const statusOptions = {
  processing: 'Processing',
  outfordelivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancel Delivery',
};

const getCurrentLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    return location;
  } catch (error) {
    console.error('Error getting location:', error);
    Alert.alert('Error', 'Failed to get current location');
  }
};

const DOrderDetails = ({ route }) => {
  const navigation = useNavigation();
  const { order, deliveryGuyId } = route.params;
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { mutate: updateOrderStatusMutation, isLoading } = useUpdateOrderStatusMutation();
  const [streetAddress, setStreetAddress] = useState('Loading address...');

  useEffect(() => {
    dispatch(setLoading(isLoading));
    reverseGeocode();
  }, [isLoading]);

  useEffect(() => {
    getCurrentLocation();
  }, []);
  const reverseGeocode = async () => {
    try {
      const { latitude, longitude } = order.deliveryAddress;
      const result = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      // Generate Plus Code
      const plusCode = new OpenLocationCode().encode(latitude, longitude, 10);

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

        setStreetAddress(`${plusCode} - ${address}`);
      }
    } catch (error) {
      console.error('Error getting address:', error);
      setStreetAddress('Address not available');
    }
  };

  const handleStatusUpdate = async () => {
    let location;
    if (currentStatus === 'outfordelivery') {
      const { coords } = await getCurrentLocation();
      const { latitude, longitude } = coords;
      location = {
        latitude,
        longitude,
      };
    }

    updateOrderStatusMutation(
      {
        orderId: order._id,
        newStatus: currentStatus,
        deliveryGuyId: deliveryGuyId,
        ...(location && { location }),
      },
      {
        onSuccess: () => {
          // Invalidate and refetch orders query
          queryClient.invalidateQueries({ queryKey: ['ordersForDeliveryGuy'] });

          Alert.alert(
            'Status Updated',
            `Order status has been updated to: ${statusOptions[currentStatus]}`,
            [
              {
                text: 'OK',
                onPress: () => {
                  navigation.goBack();
                },
              },
            ],
          );
        },
        onError: (error) => {
          console.error('Failed to update delivery status:', error);
          Alert.alert('Error', 'Failed to update order status');
        },
      },
    );
  };

  const openInGoogleMaps = () => {
    const { latitude, longitude } = order.deliveryAddress;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const renderHeader = () => {
    return <components.Header title="OrderDetails" goBack={true} height={42} />;
  };

  return (
    <>
      {renderHeader()}
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Order Information</Text>
          <Text style={styles.orderNumber}>{order.orderId}</Text>
          <Text style={styles.timestamp}>{formatDateTime(order.createdAt)}</Text>
          <Text style={styles.paymentInfo}>
            Payment Type: {order.paymentType === 'fonepay' ? 'Fonepay' : 'Cash on Delivery'}
          </Text>
          <Text style={styles.paymentInfo}>
            Payment Status: {order.paymentStatus ? order.paymentStatus.toUpperCase() : 'PENDING'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Customer Details</Text>
          <Text style={styles.customerName}>{order?.user?.fullName || 'N/A'}</Text>
          <Text style={[styles.phone]}>{order?.user?.phoneNumber || 'N/A'}</Text>
          <Text style={styles.sectionHeader}>Address</Text>
          <TouchableOpacity onPress={openInGoogleMaps}>
            <Text style={styles.address}>Open in Maps:</Text>
            <Text style={styles.mapLink}>{streetAddress}</Text>
          </TouchableOpacity>
          <Text style={styles.address}>Details : {order.deliveryAddress.addressDetails}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Order Items</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.product.name}</Text>
              <Text style={styles.itemQuantity}>x{item.quantity}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalAmount}>Rs. {order.totalAmount}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Update Status</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={currentStatus}
              onValueChange={(itemValue) => setCurrentStatus(itemValue)}
              style={styles.picker}
            >
              {Object.entries(statusOptions).map(([key, label]) => (
                <Picker.Item key={key} label={label} value={key} />
              ))}
            </Picker>
          </View>

          <TouchableOpacity style={styles.updateButton} onPress={handleStatusUpdate}>
            <Text style={styles.updateButtonText}>Update Status</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestamp: {
    color: '#666',
    marginTop: 4,
  },
  paymentInfo: {
    color: '#666',
    marginTop: 4,
    fontSize: 14,
  },
  customerName: {
    fontSize: 16,
    marginBottom: 4,
  },
  address: {
    color: '#666',
    marginBottom: 4,
  },
  mapLink: {
    color: theme.COLORS.lightBlue1,
    textDecorationLine: 'underline',
    marginBottom: 4,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemName: {
    fontSize: 15,
    maxWidth: '80%',
  },
  itemQuantity: {
    fontSize: 16,
    color: '#666',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
  },
  picker: {
    // height: 50,
  },
  updateButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  phone: {
    color: theme.COLORS.lightBlue1,
    fontSize: 16,
    marginBottom: 16,
  },
});

export default DOrderDetails;
