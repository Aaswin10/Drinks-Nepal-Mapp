import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import store from '../store/store';
import { setAccessToken, setRefreshToken } from '../store/userSlice';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    // Check internet connectivity from Redux
    const state = store.getState();
    const isConnected = state?.connectivity?.isConnected;

    if (!isConnected) {
      // Cancel the request manually if offline
      return Promise.reject({ message: 'No internet connection', config });
    }

    // Add Authorization header if token exists
    const token = state?.user?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const state = store.getState();
        const refreshToken = state?.user?.refreshToken;

        const response = await axios.get(`${process.env.APP_API_URL}/auth/refresh-token`, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        const newAccessToken = response?.data?.data?.accessToken;
        const newRefreshToken = response?.data?.data?.refreshToken;

        // Store tokens
        await AsyncStorage.setItem('accessToken', newAccessToken);
        await AsyncStorage.setItem('refreshToken', newRefreshToken);

        store.dispatch(setAccessToken(newAccessToken));
        store.dispatch(setRefreshToken(newRefreshToken));

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
