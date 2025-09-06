import React from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../store/wishlistSlice';

import { theme } from '../constants';
import { svg } from '../svg';

const FavoriteWithCircle = ({ item }) => {
  const wishlist = useSelector((state) => state.wishlist.list);
  const itemExist = (item) => {
    return wishlist.find((i) => i.id === item.id);
  };

  const dispatch = useDispatch();

  const removeFromWishlistHandler = (product) => {
    return Alert.alert('Alert!', 'Are you sure you want to delete from wishlist ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => dispatch(removeFromWishlist(product)),
      },
    ]);
  };

  return (
    <TouchableOpacity
      style={{
        width: 33,
        height: 33,
        borderWidth: 1,
        borderRadius: 33 / 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: theme.COLORS.lightBlue1,
      }}
      onPress={() => {
        if (itemExist(item)) {
          removeFromWishlistHandler(item);
        } else {
          dispatch(addToWishlist(item));
        }
      }}
    >
      <svg.HeartWithCircleSvg
        strokeColor={itemExist(item) ? theme.COLORS.accent : theme.COLORS.gray1}
        fillColor={itemExist(item) ? theme.COLORS.accent : theme.COLORS.transparent}
      />
    </TouchableOpacity>
  );
};

export default FavoriteWithCircle;
