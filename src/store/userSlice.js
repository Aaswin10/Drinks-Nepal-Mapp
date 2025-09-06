import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  user: {
    addresses: [],
    location: null,
    notification: {
      notifications: [],
      count: 0,
      unreadCount: 0,
    },
  },
  accessToken: '',
  refreshToken: '',
  isAuthenticated: null,
  loading: true, // Add loading state
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
      state.loading = false; // Set loading to false when authentication state is set
    },
    setUserLocation: (state, action) => {
      state.user.location = action.payload;
    },
    updateUserAddresses: (state, action) => {
      state.user.addresses = action.payload(state.user.addresses);
    },
    updateUserNotification: (state, action) => {
      const exists = state.user?.notification?.notifications?.some(
        (notification) => notification._id === action.payload._id,
      );
      if (!exists) {
        state.user.notification.notifications.unshift(action.payload);
        state.user.notification.unreadCount += 1;
        state.user.notification.count += 1;
      }
    },
    resetUserNotificationUnReadCount: (state) => {
      state.user.notification.unreadCount = 0;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const setUserLocationWithStorage = (location) => async (dispatch) => {
  try {
    // Save to AsyncStorage
    await AsyncStorage.setItem('userLocation', location);

    // Dispatch to Redux store
    dispatch(userSlice.actions.setUserLocation(location));
  } catch (error) {
    console.error('Error saving location to AsyncStorage', error);
  }
};

export const loadUserLocationFromStorage = () => async (dispatch) => {
  try {
    const savedLocation = await AsyncStorage.getItem('userLocation');

    if (savedLocation) {
      dispatch(userSlice.actions.setUserLocation(savedLocation));
    }
  } catch (error) {
    console.error('Error loading location from AsyncStorage', error);
  }
};

export const {
  setUser,
  setAccessToken,
  setRefreshToken,
  setIsAuthenticated,
  setUserLocation,
  updateUserAddresses,
  updateUserNotification,
  resetUserNotificationUnReadCount,
  setLoading,
} = userSlice.actions;

export default userSlice.reducer;
