import { Platform } from 'react-native';
import { fetchDelete, fetchPost, fetchPut } from '../helpers/utils';

const submitAddressUrl = 
Platform.OS === 'android'
  ? `${process.env.APP_API_URL_ANDROID}/address`
  : `${process.env.APP_API_URL}/address`;
export const submitAddress = () => ({
  mutationFn: async (options = {}) => {
    const { userId, longitude, latitude, addressDetails, isDefault } = options;
    const params = {
      userId,
      longitude,
      latitude,
      addressDetails,
      isDefault,
    };
    return fetchPost(submitAddressUrl, params);
  },
});

export const editAddress = () => ({
  mutationFn: async (options = {}) => {
    const { userId, addressId, addressDetails, isDefault, longitude, latitude } = options;
    if (!userId || !addressId) {
      throw new Error('userId and addressId are required to edit the address.');
    }

    const editAddressUrl = `${process.env.APP_API_URL}/address/${userId}/${addressId}`;
    const params = {
      addressDetails,
      isDefault,
      longitude,
      latitude,
    };
    return fetchPut(editAddressUrl, params);
  },
});

export const deleteAddress = () => ({
  mutationFn: async ({ userId, addressId }) => {
    if (!userId || !addressId) {
      throw new Error('userId and addressId are required to delete the address.');
    }

    const deleteAddressUrl = `${process.env.APP_API_URL}/address/${userId}/${addressId}`;

    return fetchDelete(deleteAddressUrl);
  },
});
