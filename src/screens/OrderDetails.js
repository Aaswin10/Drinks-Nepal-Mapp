import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import { OpenLocationCode } from 'open-location-code';
import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { components } from '../components';
import { theme } from '../constants';

const OrderDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [streetAddress, setStreetAddress] = useState('Loading address...');

  const { order } = route.params;

  useEffect(() => {
    reverseGeocode();
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

  const renderHeader = () => {
    return <components.Header title="OrderDetails" goBack={true} height={42} />;
  };

  const renderContent = () => {
    return (
      <ScrollView style={styles.container}>
        <View style={{ ...styles.orderInfo, backgroundColor: theme.COLORS.white }}>
          <Text style={styles.orderNumber}>ORDER ID: {order.orderId}</Text>
        </View>

        {order.status === 'outfordelivery' && (
          <View style={{ padding: 15 }}>
            <components.Button
              onPress={() => navigation.navigate('TrackYourOrder', { order })}
              title="Track Order"
            />
          </View>
        )}

        <View style={{ backgroundColor: theme.COLORS.white }}>
          <Text style={{ ...styles.sectionTitle, paddingHorizontal: 16 }}>
            ORDERED ITEMS ({order.items.length})
          </Text>

          {order.items.map((item) => (
            <View style={styles.orderItem} key={item._id}>
              <Image source={{ uri: item.product.images[0] }} style={styles.productImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} className="w-2/3">
                  {item.product.name}
                </Text>
                <Text style={styles.itemQuantity}>
                  {item.quantity} x Rs. {item.price / item.quantity}
                </Text>
              </View>
              <Text style={styles.itemPrice}>Rs. {item.price}</Text>
            </View>
          ))}

          <View style={styles.priceSummary}>
            <View style={styles.priceRow}>
              <Text style={{ ...theme.FONTS.Mulish_400Regular }}>Price</Text>
              <Text style={{ ...theme.FONTS.Mulish_400Regular }}>Rs. {order.totalAmount}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={{ ...theme.FONTS.Mulish_400Regular }}>Discount</Text>
              <Text style={{ ...theme.FONTS.Mulish_400Regular }}>0</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={{ ...theme.FONTS.Mulish_400Regular }}>Delivery Charges</Text>
              <Text style={styles.freeDelivery}>FREE Delivery</Text>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalText}>Grand Total</Text>
              <Text style={styles.totalPrice}>Rs. {order.totalAmount}</Text>
            </View>
          </View>

          <View style={styles.orderDetails}>
            <Text style={styles.sectionTitle}>Order Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>ORDER NUMBER</Text>
              <Text style={styles.detailValue}>{order.orderId}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>DATE</Text>
              <Text style={styles.detailValue}>
                {new Date(order.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>PHONE NUMBER</Text>
              <Text style={styles.detailValue}>{order.user.phoneNumber}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>PAYMENT TYPE</Text>
              <Text style={styles.detailValue}>
                {order.paymentType === 'fonepay' ? 'Fonepay' : 'Cash on Delivery'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>PAYMENT STATUS</Text>
              <Text style={styles.detailValue}>
                {order.paymentStatus ? order.paymentStatus.toUpperCase() : 'PENDING'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.sectionTitle}>Deliver To</Text>
            </View>
            <View style={styles.addressContainer}>
              <Text style={styles.detailValue}>{streetAddress}</Text>
              <Text style={styles.detailValue}>{order.deliveryAddress.addressDetails}</Text>
            </View>
          </View>
        </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.lightGray1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  deliveryStatus: {
    marginLeft: 'auto',
    color: '#4CAF50',
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '500',
    ...theme.FONTS.Mulish_400Regular,
  },
  sectionTitle: {
    fontSize: 16,
    marginVertical: 8,
    ...theme.FONTS.Mulish_700Bold,
  },
  orderItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    ...theme.FONTS.Mulish_600SemiBold,
  },
  itemQuantity: {
    fontSize: 12,
    ...theme.FONTS.Mulish_400Regular,
    color: '#757575',
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 14,
    ...theme.FONTS.Mulish_600SemiBold,
    fontWeight: '500',
  },
  priceSummary: {
    padding: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  freeDelivery: {
    color: '#4CAF50',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
    marginTop: 8,
  },
  totalText: {
    ...theme.FONTS.Mulish_700Bold,
  },
  totalPrice: {
    ...theme.FONTS.Mulish_700Bold,
    fontSize: 18,
  },
  savingsText: {
    color: '#4CAF50',
    textAlign: 'center',
    marginVertical: 16,
  },
  orderDetails: {
    padding: 16,
    ...theme.FONTS.Mulish_700Bold,
  },
  detailRow: {
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 12,
    ...theme.FONTS.Mulish_400Regular,
    color: theme.COLORS.black,
  },
  detailValue: {
    fontSize: 14,
    marginTop: 2,
    ...theme.FONTS.Mulish_400Regular,
    color: theme.COLORS.gray1,
  },
  addressContainer: {
    flex: 1,
    alignItems: 'flex-start',
    color: theme.COLORS.gray1,
  },
  mapLink: {
    fontSize: 14,
    ...theme.FONTS.Mulish_400Regular,
    color: theme.COLORS.gray1,
  },
  mapLinkText: {
    color: theme.COLORS.lightBlue1,
    textDecorationLine: 'underline',
    fontSize: 14,
    ...theme.FONTS.Mulish_400Regular,
    marginVertical: 4,
  },
  rateButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
});

export default OrderDetails;
