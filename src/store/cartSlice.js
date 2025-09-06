import { createSlice } from '@reduxjs/toolkit';

// Helper function to calculate total
const calculateTotal = (cartItems) => {
  return cartItems.reduce((sum, item) => {
    return sum + item.volume.reduce((volumeSum, v) => {
      return volumeSum + (v.price * v.quantity);
    }, 0);
  }, 0);
};

const initialState = {
  loading: false,
  list: [],
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { _id, selectedVolume, details } = action.payload;
      const defaultVolume = details?.volume?.find((v) => v.isDefault)?.volume;
      const volumeToUse = selectedVolume || defaultVolume;

      const inCart = state.list.find((item) => item._id === _id);
      const currentVolume = details?.volume?.find((item) => item.volume === volumeToUse);
      const volumePrice =
        currentVolume?.salePrice !== 0 ? currentVolume?.salePrice : currentVolume?.regularPrice;

      if (inCart) {
        const volumeExists = inCart.volume.find((v) => v.volume === volumeToUse);
        if (volumeExists) {
          volumeExists.quantity += 1;
        } else {
          inCart.volume.push({
            volume: volumeToUse,
            price: volumePrice,
            quantity: 1,
          });
        }
      } else {
        state.list.push({
          _id,
          name: action.payload.name,
          images: action.payload.images,
          volume: [
            {
              volume: volumeToUse,
              price: volumePrice,
              quantity: 1,
            },
          ],
        });
      }

      // Recalculate total using helper function
      state.total = calculateTotal(state.list);
    },
    removeFromCart: (state, action) => {
      const { _id, selectedVolume, details } = action.payload;
      const defaultVolume = details?.volume?.find((v) => v.isDefault)?.volume;
      const volumeToUse = selectedVolume || defaultVolume;

      const inCart = state.list.find((item) => item._id === _id);

      if (inCart) {
        const volumeIndex = inCart.volume.findIndex((v) => v.volume === volumeToUse);

        if (volumeIndex !== -1) {
          if (inCart.volume[volumeIndex].quantity > 1) {
            inCart.volume[volumeIndex].quantity -= 1;
          } else {
            inCart.volume.splice(volumeIndex, 1);

            if (inCart.volume.length === 0) {
              state.list = state.list.filter((item) => item._id !== _id);
            }
          }

          // Recalculate total using helper function
          state.total = calculateTotal(state.list);
        }
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCart: (state, action) => {
      state.list = action.payload;
      // Recalculate total using helper function
      state.total = calculateTotal(state.list);
    },
  },
});

export const { addToCart, removeFromCart, setLoading, setCart } = cartSlice.actions;

export default cartSlice.reducer;
