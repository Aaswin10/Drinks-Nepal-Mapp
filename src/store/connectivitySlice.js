import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isConnected: true,
};

const connectivitySlice = createSlice({
  name: 'connectivity',
  initialState,
  reducers: {
    setConnectivity: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});

export const { setConnectivity } = connectivitySlice.actions;
export default connectivitySlice.reducer;
