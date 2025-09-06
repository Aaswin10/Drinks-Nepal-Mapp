import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { defineTask } from 'expo-task-manager';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { useOrdersForDeliveryGuy } from '../../../queries/order';
import { theme } from '../../constants';
import { setLoading } from '../../store/cartSlice';
import { formatDateTime } from './functions';

const LOCATION_TASK_NAME = 'background-location-task';
const SOCKET_CONFIG = {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
};

// Socket Manager Class
class SocketManager {
  static instance = null;
  socket = null;
  reconnectAttempts = 0;
  maxReconnectAttempts = 5;

  static getInstance() {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  connect() {
    if (this.socket?.connected) return this.socket;

    const socketUrl =
      Platform.OS === 'android' ? process.env.APP_SOCKET_URL_ANDROID : process.env.APP_SOCKET_URL;

    this.socket = io(socketUrl, SOCKET_CONFIG);

    this.socket.on('connect_error', this.handleConnectionError);
    this.socket.on('disconnect', this.handleDisconnect);
    this.socket.on('connect', () => {
      console.log('Socket connected successfully');
      this.reconnectAttempts = 0;
    });

    return this.socket;
  }

  handleConnectionError = (error) => {
    console.log('Socket connection error:', error);
    this.reconnectAttempts++;

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      this.disconnect();
    }
  };

  handleDisconnect = (reason) => {
    console.log('Socket disconnected:', reason);
    if (reason === 'io server disconnect') {
      setTimeout(() => this.connect(), 1000);
    }
  };

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emitLocation(orderId, latitude, longitude) {
    if (this.socket?.connected) {
      console.log(`Location sent for ${orderId} ${latitude} ${longitude}`);
      this.socket.emit('updateLocation', {
        orderId,
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
      });
    }
  }
}

// Define the task for iOS
defineTask(LOCATION_TASK_NAME, async ({ data: { locations }, error }) => {
  if (error) {
    console.error('Background task error:', error);
    return;
  }

  if (locations && locations.length > 0) {
    const { latitude, longitude } = locations[0].coords;

    const socketManager = SocketManager.getInstance();
    socketManager.connect();

    const outForDeliveryOrders =
      global.activeOrders?.filter((order) => order.status === 'outfordelivery') || [];

    outForDeliveryOrders.forEach((order) => {
      const currentOrder = global.activeOrders?.find((o) => o._id === order._id);
      if (currentOrder?.status === 'outfordelivery') {
        socketManager.emitLocation(order._id, latitude, longitude);
      }
    });
  }
});

const statusOptions = {
  processing: 'Processing',
  outfordelivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancel Delivery',
};

const DOrders = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const socketManager = SocketManager.getInstance();

  const { data, isLoading, refetch } = useOrdersForDeliveryGuy({
    deliveryGuyId: user?._id,
  });

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const setupLocationTracking = async () => {
    try {
      if (!user?._id) {
        console.warn('No delivery guy ID available');
        return;
      }
      
      // Request foreground permissions
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== 'granted') {
        Alert.alert(
          'Permission required',
          'Please enable location permissions to track deliveries.',
        );
        return;
      }

      // Request background permission for Android
      if (Platform.OS === 'android') {
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== 'granted') {
          Alert.alert(
            'Background permission required',
            'Please enable background location permissions to track deliveries.',
          );
          return;
        }
      }

      // For Android emulator testing
      if (Platform.OS === 'android') {
        const socketManager = SocketManager.getInstance();
        socketManager.connect();
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High, // Changed to high accuracy
            timeInterval: 1000, // Reduced to 1 second for more frequent updates
            distanceInterval: 1, // Reduced to 1 meter
            mayShowUserSettingsDialog: true, // Add this to prompt for settings if needed
          },
          (location) => {
            const { latitude, longitude } = location.coords;
            const outForDeliveryOrders =
              data?.data?.orders?.filter((order) => order.status === 'outfordelivery') || [];

            outForDeliveryOrders.forEach((order) => {
              const currentOrder = data?.data?.orders?.find((o) => o._id === order._id);
              if (currentOrder?.status === 'outfordelivery') {
                socketManager.emitLocation(order._id, latitude, longitude);
              }
            });
          },
        );

        // Add location provider check for Android emulator
        const provider = await Location.getProviderStatusAsync();
        if (!provider.locationServicesEnabled) {
          Alert.alert(
            'Location Services Disabled',
            'Please enable location services to track deliveries.',
          );
        }
      } else {
        // iOS implementation remains the same
        try {
          const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
          if (hasStarted) {
            await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
          }

          await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000,
            distanceInterval: 10,
            foregroundService: {
              notificationTitle: 'Location Tracking',
              notificationBody: 'Tracking delivery location',
            },
          });
        } catch (e) {
          console.error('iOS location setup error:', e);
        }
      }

      console.log('Location tracking started successfully');
    } catch (err) {
      console.error('Error setting up location tracking:', err);
    }
  };

  // Wrap the setup in useEffect with proper dependency array
  useEffect(() => {
    let locationSubscription = null;

    if (data?.data?.orders?.length > 0) {
      setupLocationTracking();
      global.activeOrders = data?.data?.orders;
    }

    // Cleanup function
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }

      if (Platform.OS === 'ios') {
        Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME)
          .then((hasStarted) => {
            if (hasStarted) {
              Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
            }
          })
          .catch(() => {});
      }
      socketManager.disconnect();
    };
  }, [data?.data?.orders]);

  const renderOrderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => {
        global.activeOrderId = item._id;
        navigation.navigate('DOrderDetails', {
          order: item,
          deliveryGuyId: user?._id,
        });
      }}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>{item.orderId}</Text>
        <Text
          style={[
            styles.statusBadge,
            { backgroundColor: item.status === 'processing' ? '#FFE5CC' : '#CCE5FF' },
          ]}
        >
          {statusOptions[item.status]}
        </Text>
      </View>

      <View style={styles.orderInfo}>
        <Text style={styles.customerName}>{item?.user?.fullName || 'N/A'}</Text>
        <Text style={styles.phone}>{item?.user?.phoneNumber || 'N/A'}</Text>
        <Text style={styles.address}>{item.deliveryAddress?.addressDetails}</Text>
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.time}>{formatDateTime(item.createdAt)}</Text>
        <Text style={styles.amount}>Rs. {item.totalAmount}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Active Orders</Text>
      {data?.data?.orders?.length > 0 ? (
        <FlatList
          data={data?.data?.orders}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item?._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <Text style={styles.emptyText}>No active orders found</Text>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...theme.FONTS.Mulish_600SemiBold,
    color: theme.COLORS.gray1,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
  },
  orderInfo: {
    marginBottom: 12,
  },
  customerName: {
    fontSize: 16,
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#666',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  time: {
    color: '#666',
    fontSize: 12,
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  phone: {
    color: theme.COLORS.lightBlue1,
    fontSize: 16,
    marginBottom: 4,
  },
});

export default DOrders;
