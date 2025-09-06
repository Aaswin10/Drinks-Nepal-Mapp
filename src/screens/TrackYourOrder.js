import { useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Image, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MapView, { AnimatedRegion, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import io from 'socket.io-client';
import { components } from '../components';
import { theme } from '../constants';

const TrackYourOrder = () => {
  const route = useRoute();
  const { order } = route.params;
  const markerRef = useRef(null);
  const mapRef = useRef(null);

  const [markerPosition, setMarkerPosition] = useState();
  const [currentZoom, setCurrentZoom] = useState({
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  });

  const deliveryLocation = {
    latitude: order?.deliveryAddress?.latitude,
    longitude: order?.deliveryAddress?.longitude,
  };

  const animateMarker = (newCoordinate) => {
    const duration = 1000;
    if (!markerPosition) {
      // Create new animated region if markerPosition is null
      const newMarkerPosition = new AnimatedRegion({
        latitude: newCoordinate.latitude,
        longitude: newCoordinate.longitude,
        latitudeDelta: currentZoom.latitudeDelta,
        longitudeDelta: currentZoom.longitudeDelta,
      });
      setMarkerPosition(newMarkerPosition);

      // Pan to delivery guy location when first set
      mapRef.current?.animateToRegion({
        latitude: newCoordinate.latitude,
        longitude: newCoordinate.longitude,
        latitudeDelta: currentZoom.latitudeDelta,
        longitudeDelta: currentZoom.longitudeDelta,
      });
    } else {
      // Update marker position without changing zoom
      markerPosition
        .timing({
          latitude: newCoordinate.latitude,
          longitude: newCoordinate.longitude,
          duration,
          useNativeDriver: false,
        })
        .start();
      mapRef.current?.animateToRegion(
        {
          latitude: newCoordinate.latitude,
          longitude: newCoordinate.longitude,
          latitudeDelta: currentZoom.latitudeDelta,
          longitudeDelta: currentZoom.longitudeDelta,
        },
        duration,
      );
    }
  };

  useEffect(() => {
    // Connect to socket server
    const socketUrl = Platform.OS === 'android' ? process.env.APP_SOCKET_URL_ANDROID : process.env.APP_SOCKET_URL;
    
    if (!socketUrl) {
      console.warn('Socket URL not configured');
      return;
    }
    
    const socket = io(socketUrl);

    // Listen for location updates for this specific order
    socket.on(`order_location_${order._id}`, (location) => {
      animateMarker({
        latitude: location.latitude,
        longitude: location.longitude,
      });
    });

    // Clean up socket connection on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [order._id, currentZoom]);

  const renderHeader = () => {
    return (
      <components.Header
        title={`Order: ${order.orderId}`}
        name={`Order: ${order.orderId}`}
        goBack={true}
        displayScreenName={true}
        height={42}
      />
    );
  };

  const renderDeliveryPartner = () => {
    return (
      <View
        style={{
          padding: 10,
          backgroundColor: theme.COLORS.white,
          marginHorizontal: 10,
          marginVertical: 5,
          borderRadius: 10,
          elevation: 1,
          shadowColor: theme.COLORS.lightGray,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 16, ...theme.FONTS.Mulish_600SemiBold }}>
              Delivery Partner
            </Text>
            <Text style={{ ...theme.FONTS.Mulish_400Regular, color: theme.COLORS.lightGray }}>
              Top-rated delivery partner
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderDeliveryInfo = () => {
    return (
      <View
        style={{
          padding: 10,
          backgroundColor: 'white',
          marginHorizontal: 10,
          marginVertical: 5,
          borderRadius: 10,
          elevation: 1,
          shadowColor: theme.COLORS.lightGray,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
        }}
      >
        <View style={{ flexDirection: 'column', alignItems: '', marginBottom: 15 }}>
          <Text
            style={{
              ...theme.FONTS.Mulish_400Regular,
              fontSize: 14,
              color: theme.COLORS.lightGray,
            }}
          >
            Delivery Partner will call this number
          </Text>
          <Text style={{ fontSize: 15, ...theme.FONTS.Mulish_600SemiBold }}>
            {order.user.fullName}, {order.user.phoneNumber}
          </Text>
        </View>
        <View>
          <Text
            style={{
              ...theme.FONTS.Mulish_400Regular,
              fontSize: 14,
              color: theme.COLORS.lightGray,
            }}
          >
            Delivery at Home
          </Text>
          <Text style={{ ...theme.FONTS.Mulish_400Regular }}>
            {order.deliveryAddress.addressDetails}
          </Text>
        </View>
      </View>
    );
  };

  const renderOrderDetails = () => {
    return (
      <View
        style={{
          padding: 10,
          backgroundColor: theme.COLORS.white,
          marginHorizontal: 10,
          marginVertical: 5,
          borderRadius: 10,
          elevation: 1,
          shadowColor: theme.COLORS.lightGray,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
        }}
      >
        <Text style={{ fontSize: 16, ...theme.FONTS.Mulish_700Bold, marginBottom: 10 }}>
          Order Details
        </Text>
        <View className="px-[10px] w-full ">
          {order &&
            order.items &&
            order.items.map((item) => (
              <View key={item._id} className="flex flex-row items-center mb-5">
                <Text style={styles.quantityText}>{item.quantity}x</Text>

                <Image
                  source={{ uri: item.product.images[0] }}
                  style={styles.productImage}
                  resizeMode="contain"
                />
                <View className="flex-1">
                  <Text style={styles.productBrand}>{item.product.sku}</Text>
                  <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
                    {item.product.name}
                  </Text>
                </View>
              </View>
            ))}
        </View>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 26 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            width: '100%',
            height: theme.SIZES.height * 0.45,
            borderBottomWidth: 1,
            borderBottomColor: theme.COLORS.lightBlue1,
            marginBottom: 5,
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
              latitude: deliveryLocation.latitude,
              longitude: deliveryLocation.longitude,
              latitudeDelta: currentZoom.latitudeDelta,
              longitudeDelta: currentZoom.longitudeDelta,
            }}
            onRegionChangeComplete={(region) => {
              setCurrentZoom({
                latitudeDelta: region.latitudeDelta,
                longitudeDelta: region.longitudeDelta,
              });
            }}
          >
            {markerPosition && (
              <Marker.Animated
                ref={markerRef}
                coordinate={markerPosition}
                title="Delivery Partner"
                description="Your order is on the way"
                pinColor="blue"
              />
            )}
            <Marker
              coordinate={deliveryLocation}
              title="Delivery Location"
              description="Your delivery address"
              pinColor="red"
            />
          </MapView>
        </View>
        {renderDeliveryPartner()}
        {renderDeliveryInfo()}
        {renderOrderDetails()}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.lightGray1 }}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = {
  quantityText: {
    ...theme.FONTS.Mulish_700Bold,
    fontSize: 14,
    color: theme.COLORS.lightGray,
    marginRight: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  productBrand: {
    ...theme.FONTS.Mulish_700Bold,
    fontSize: 12,
    color: theme.COLORS.lightGray,
    marginBottom: 5,
  },
  productName: {
    ...theme.FONTS.Mulish_400Regular,
    fontSize: 14,
    color: theme.COLORS.black,
    lineHeight: 16,
  },
};

export default TrackYourOrder;
