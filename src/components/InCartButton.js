import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { useDispatch, useSelector } from 'react-redux';
import { theme } from '../constants';
import { addToCart } from '../store/cartSlice';

const InCartButton = ({ item }) => {
  const productList = useSelector((state) => state.cart.list);
  const defaultVolume = item?.details?.volume?.find((v) => v.isDefault)?.volume;

  const productExist = (item) => {
    const inCart = productList.find((i) => i._id === item._id);
    if (!inCart) return false;
    return inCart.volume.some((v) => v.volume === defaultVolume);
  };

  const dispatch = useDispatch();

  return (
    <TouchableOpacity
      style={{
        flex: 1,
        borderWidth: 1,
        borderColor: theme.COLORS.lightBlue1,
        borderRadius: 12,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={() => {
        if (productExist(item)) {
          dispatch(addToCart(item));
          showMessage({
            message: 'Success',
            description: `${item.name} quantity increased in cart`,
            type: 'success',
          });
        } else {
          dispatch(addToCart(item));
          showMessage({
            message: 'Success',
            description: `${item.name} added to cart`,
            type: 'success',
          });
        }
      }}
    >
      <Text style={{ fontSize: 12, color: theme.COLORS.lightBlue1, textAlign: 'left' }}>
        {productExist(item) ? 'ADD MORE' : 'ADD'}
      </Text>
    </TouchableOpacity>
  );
};

export default InCartButton;
