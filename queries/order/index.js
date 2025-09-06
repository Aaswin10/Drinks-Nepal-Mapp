import { useMutation } from '@tanstack/react-query';
import { createQueryAndHook } from '../helpers/createQueryAndHook';
import {
  ordersForDeliveryGuy,
  ordersForUser,
  processOrder,
  updateOrderStatus,
  verifyPayment,
} from './order';

export const { hook: useOrdersForDeliveryGuy } = createQueryAndHook({
  queryKey: ['ordersForDeliveryGuy'],
  query: (options) => ordersForDeliveryGuy({ ...options }),
});

export const { hook: useOrdersForUser } = createQueryAndHook({
  queryKey: ['ordersForUser'],
  query: (options) => ordersForUser({ ...options }),
});

export const useProcessOrderMutation = (options) => useMutation(processOrder(options));
export const useVerifyPaymentMutation = (options) => useMutation(verifyPayment(options));
export const useUpdateOrderStatusMutation = (options) => useMutation(updateOrderStatus(options));
