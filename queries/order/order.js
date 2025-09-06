import { Platform } from 'react-native';
import { fetchPost, fetchPut } from '../helpers/utils';

const orderUrl =
  Platform.OS === 'android'
    ? `${process.env.APP_API_URL_ANDROID}/orders/`
    : `${process.env.APP_API_URL}/orders/`;

const defaultParams = {
  createdAt: -1,
};

export const updateOrderStatus = () => ({
  mutationFn: async (options = {}) => {
    const { orderId, newStatus, deliveryGuyId, location } = options;
    return fetchPut(`${orderUrl}${orderId}`, {
      newStatus,
      deliveryGuyId,
      ...(location && { latitude: location.latitude, longitude: location.longitude }),
    });
  },
});

export const ordersForDeliveryGuy = (options = {}) => ({
  queryFn: async () => {
    const { deliveryGuyId } = options;
    const params = {
      ...defaultParams,
      ...(deliveryGuyId && { filters: { assignedTo: deliveryGuyId } }),
    };
    return fetchPost(orderUrl, params);
  },
});

export const ordersForUser = (options = {}) => ({
  queryFn: async () => {
    const { userId } = options;
    const params = {
      ...defaultParams,
      ...(userId && { filters: { userId } }),
    };
    const data = await fetchPost(orderUrl, params);
    return data;
  },
});

export const processOrder = () => ({
  mutationFn: async (options = {}) => {
    const { items, paymentType, deliveryAddressId, userId } = options;
    return fetchPost(`${orderUrl}process/${userId}`, {
      items,
      paymentType,
      deliveryAddressId,
    });
  },
});

export const verifyPayment = () => ({
  mutationFn: async (options = {}) => {
    const { paymentData, orderData } = options;
    return fetchPost(
      `${orderUrl}verify?UID=${paymentData.UID}&PRN=${paymentData.PRN}&BID=${paymentData.BID}`,
      {
        orderId: orderData.orderId,
        userId: orderData.userId,
        items: orderData.items,
        deliveryAddressId: orderData.deliveryAddressId,
        paymentType: orderData.paymentType,
      },
    );
  },
});
