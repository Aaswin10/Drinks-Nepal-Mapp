import React from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';

import { svg } from '../svg';

const InCart = ({ item }) => {
  const productList = useSelector((state) => state.cart.list);

  const productExist = (item) => {
    return productList.find((i) => i.id === item.id);
  };

  const dispatch = useDispatch();

  const productExistMessage = () => {
    return Alert.alert(
      'Alert!',
      'The product already exists in the cart, please remove the product from the cart',
      [
        {
          text: 'Ok',
        },
      ],
    );
  };

  return (
    <TouchableOpacity
      style={{
        padding: 8,
        position: 'absolute',
        right: 0,
        top: 38,
      }}
      onPress={() => {
        if (productExist(item)) {
          productExistMessage();
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
      <svg.ItemBagSvg />
    </TouchableOpacity>
  );
};

export default InCart;
