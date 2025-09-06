import { Platform } from 'react-native';
import { fetchGet, fetchPost, fetchPut } from '../helpers/utils';

const generateOtpUrl =
  Platform.OS === 'android'
    ? `${process.env.APP_API_URL_ANDROID}/auth/generate-otp`
    : `${process.env.APP_API_URL}/auth/generate-otp`;
const verifyOtpUrl =
  Platform.OS === 'android'
    ? `${process.env.APP_API_URL_ANDROID}/auth/verify-otp-login`
    : `${process.env.APP_API_URL}/auth/verify-otp-login`;
const registerUrl =
  Platform.OS === 'android'
    ? `${process.env.APP_API_URL_ANDROID}/auth/register`
    : `${process.env.APP_API_URL}/auth/register`;
const authenticateUrl =
  Platform.OS === 'android'
    ? `${process.env.APP_API_URL_ANDROID}/auth/authenticate`
    : `${process.env.APP_API_URL}/auth/authenticate`;
const refreshTokenUrl =
  Platform.OS === 'android'
    ? `${process.env.APP_API_URL_ANDROID}/auth/refresh-token`
    : `${process.env.APP_API_URL}/auth/refresh-token`;
const updatePushTokenUrl =
  Platform.OS === 'android'
    ? `${process.env.APP_API_URL_ANDROID}/auth/update-push-token`
    : `${process.env.APP_API_URL}/auth/update-push-token`;

const fetchNotificationsUrl =
  Platform.OS === 'android'
    ? `${process.env.APP_API_URL_ANDROID}/auth/notifications`
    : `${process.env.APP_API_URL}/auth/notifications`;

const markNotificationAsReadUrl =
  Platform.OS === 'android'
    ? `${process.env.APP_API_URL_ANDROID}/auth/mark-notifications-as-read`
    : `${process.env.APP_API_URL}/auth/mark-notifications-as-read`;

export const generateOtp = () => ({
  mutationFn: async (options = {}) => {
    const { phoneNumber } = options;
    const params = {
      phoneNumber: phoneNumber,
    };
    return fetchPost(generateOtpUrl, params);
  },
});

export const verifyOtp = () => ({
  mutationFn: async (options = {}) => {
    const { phoneNumber, otp } = options;
    const params = { phoneNumber, otp };
    return fetchPost(verifyOtpUrl, params);
  },
});

export const register = () => ({
  mutationFn: async (options = {}) => {
    const { phoneNumber, fullName, email } = options;
    const params = { phoneNumber, fullName, email };
    return fetchPost(registerUrl, params);
  },
});

export const authenticate = () => ({
  mutationFn: async (options = {}) => {
    const { accessToken } = options;
    return fetchGet(authenticateUrl, {
      Authorization: `Bearer ${accessToken}`,
    });
  },
});

export const refreshToken = () => ({
  mutationFn: async () => {
    return fetchGet(refreshTokenUrl);
  },
});

export const updatePushToken = () => ({
  mutationFn: async (options = {}) => {
    const { pushToken, userId } = options;
    return fetchPut(`${updatePushTokenUrl}/${userId}`, { pushToken });
  },
});

export const fetchNotifications = () => ({
  mutationFn: async (options = {}) => {
    const { page, pageSize, userId } = options;
    return fetchPost(fetchNotificationsUrl, { page, pageSize, userId });
  },
});

export const markNotificationAsRead = () => ({
  mutationFn: async (options = {}) => {
    const { userId } = options;
    return fetchPut(markNotificationAsReadUrl, { userId });
  },
});
