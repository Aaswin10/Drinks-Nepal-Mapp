import { createSelector } from '@reduxjs/toolkit';

// Memoized selectors for better performance
export const selectCartItems = (state) => state.cart.list;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartLoading = (state) => state.cart.loading;

export const selectCartItemCount = createSelector(
  [selectCartItems],
  (cartItems) => {
    return cartItems.reduce((total, item) => {
      return total + (item.volume?.reduce((sum, vol) => sum + (vol.quantity || 0), 0) || 0);
    }, 0);
  }
);

export const selectUser = (state) => state.user.user;
export const selectUserLocation = (state) => state.user.user?.location;
export const selectUserAddresses = (state) => state.user.user?.addresses || [];
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;

export const selectNotificationCount = createSelector(
  [selectUser],
  (user) => user?.notification?.unreadCount || 0
);

export const selectCurrentScreen = (state) => state.tab.screen;
export const selectConnectivity = (state) => state.connectivity.isConnected;

// Wishlist selectors
export const selectWishlistItems = (state) => state.wishlist.list;
export const selectIsInWishlist = createSelector(
  [selectWishlistItems, (state, itemId) => itemId],
  (wishlistItems, itemId) => {
    return wishlistItems.some(item => item.id === itemId);
  }
);

// Cart item existence check
export const selectIsInCart = createSelector(
  [selectCartItems, (state, itemId) => itemId],
  (cartItems, itemId) => {
    return cartItems.some(item => item._id === itemId);
  }
);