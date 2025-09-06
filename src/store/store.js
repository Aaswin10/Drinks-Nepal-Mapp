import { configureStore } from '@reduxjs/toolkit';

import cartReducer from './cartSlice';
import tabReducer from './tabSlice';
import userReducer from './userSlice';
import wishlistReducer from './wishlistSlice';
import connectivityReducer from './connectivitySlice';

const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),

  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    tab: tabReducer,
    user: userReducer,
    connectivity: connectivityReducer,
  },
});

export default store;
