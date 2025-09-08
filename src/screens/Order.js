import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Alert, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../store/cartSlice';
import { setScreen } from '../store/tabSlice';

import { components } from '../components';
import { theme } from '../constants';
import { svg } from '../svg';

const Order = () => {
  const navigation = useNavigation();
  const products = useSelector((state) => state.cart.list);
  const total = useSelector((state) => state.cart.total)?.toFixed(2);

  const dispatch = useDispatch();

  const renderHeader = () => {
    return (
      <>
        <components.Header title="Cart" goBack={products.length > 0 ? false : false} />
        <View
          style={{
            left: 0,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            width: '100%',
            backgroundColor: theme.COLORS.white,
          }}
          className="px-5 py-5"
        >
          <Text
            style={{
              ...theme.FONTS.Mulish_700Bold,
              color: theme.COLORS.black,
              fontSize: 22,
            }}
          >
            My Cart
          </Text>
        </View>
      </>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView>
        <View className="px-5 mt-3 mb-3" style={{ backgroundColor: theme.COLORS.white }}>
          <Text
            style={{
              ...theme.FONTS.Mulish_700Bold,
              fontSize: 16,
              color: theme.COLORS.black,
            }}
            className="my-3"
          >
            Your Items ({products.length})
          </Text>
          {products?.map((cartItem, index) => {
            return (
              <React.Fragment key={index}>
                {cartItem.volume.map((volumeItem, volumeIndex) => (
                  <View key={`${index}-${volumeIndex}`}>
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: theme.COLORS.white,
                        paddingVertical: 10,
                      }}
                    >
                      <ImageBackground
                        source={{ uri: cartItem?.images[0] }}
                        style={{
                          width: 70,
                          height: 70,
                          marginRight: 14,
                        }}
                        imageStyle={{
                          resizeMode: 'contain',
                        }}
                      >
                        {cartItem?.salePrice === 0 && <components.Sale />}
                      </ImageBackground>
                      <View style={{ flex: 1 }}>
                        <TouchableOpacity
                          onPress={() => Alert.alert('Product Name', cartItem?.name)}
                        >
                          <Text
                            style={{
                              ...theme.FONTS.Mulish_400Regular,
                              fontSize: 14,
                              color: theme.COLORS.black,
                              lineHeight: 14 * 1.7,
                            }}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                          >
                            {cartItem?.name}
                          </Text>
                        </TouchableOpacity>
                        <Text
                          style={{
                            ...theme.FONTS.Mulish_400Regular,
                            fontSize: 14,
                            color: theme.COLORS.lightBlue1,
                          }}
                        >
                          {volumeItem.volume}
                        </Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <View
                          style={{
                            alignItems: 'center',
                            flexDirection: 'row',
                            borderRadius: 50,
                            borderWidth: 1,
                            borderColor: theme.COLORS.lightBlue1,
                            marginBottom: 5,
                            height: 35,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() =>
                              dispatch(
                                removeFromCart({
                                  ...cartItem,
                                  selectedVolume: volumeItem.volume,
                                }),
                              )
                            }
                            style={{
                              width: 20,
                              height: 20,
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingHorizontal: 15,
                              paddingVertical: 22,
                            }}
                          >
                            <svg.MinusSvg />
                          </TouchableOpacity>
                          <Text
                            style={{
                              fontFamily: 'Mulish_600SemiBold',
                              color: theme.COLORS.gray1,
                              fontSize: 14,
                              paddingHorizontal: 10,
                            }}
                          >
                            {volumeItem.quantity}
                          </Text>
                          <TouchableOpacity
                            onPress={() =>
                              dispatch(
                                addToCart({
                                  ...cartItem,
                                  selectedVolume: volumeItem.volume,
                                }),
                              )
                            }
                            style={{
                              width: 20,
                              height: 20,
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingHorizontal: 15,
                              paddingVertical: 22,
                            }}
                          >
                            <svg.PlusSvg />
                          </TouchableOpacity>
                        </View>
                        <components.Price
                          item={volumeItem}
                          containerStyle={{ alignSelf: 'flex-end' }}
                        />
                      </View>
                    </View>
                    {(volumeIndex !== cartItem.volume.length - 1 ||
                      index !== products.length - 1) && (
                      <View
                        style={{
                          borderBottomWidth: 1,
                          borderBottomColor: theme.COLORS.lightBlue2,
                          marginVertical: 10,
                          width: '100%',
                        }}
                      />
                    )}
                  </View>
                ))}
              </React.Fragment>
            );
          })}
        </View>
        <View className="px-5 py-5" style={{ backgroundColor: theme.COLORS.white }}>
          <TouchableOpacity style={{ backgroundColor: theme.COLORS.white }} onPress={() => {}}>
            <Text style={{ color: theme.COLORS.green, ...theme.FONTS.Mulish_400Regular }}>
              You will earn 100 tokens on this order.
            </Text>
          </TouchableOpacity>
          <View
            style={{
              borderWidth: 1,
              borderColor: theme.COLORS.lightGray2,
              borderStyle: 'dashed',
              marginVertical: 20,
            }}
          />
          <Text
            style={{
              ...theme.FONTS.Mulish_700Bold,
              fontSize: 16,
              color: theme.COLORS.black,
            }}
            className="mb-5"
          >
            Price Details
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{
                ...theme.FONTS.H5,
                marginBottom: 10,
                color: theme.COLORS.black,
              }}
            >
              Subtotal
            </Text>
            <Text
              style={{
                ...theme.FONTS.H5,
                marginBottom: 10,
                color: theme.COLORS.black,
              }}
            >
              Rs. {total}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                ...theme.FONTS.Mulish_400Regular,
                color: theme.COLORS.gray1,
                fontSize: 16,
                lineHeight: 16 * 1.7,
              }}
            >
              Delivery
            </Text>
            <Text
              style={{
                color: '#00824B',
                ...theme.FONTS.Mulish_400Regular,
                fontSize: 16,
                lineHeight: 16 * 1.7,
              }}
            >
              Free
            </Text>
          </View>
          <View
            style={{
              borderWidth: 1,
              borderColor: theme.COLORS.lightGray2,
              borderStyle: 'dashed',
              marginVertical: 20,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 10,
              marginBottom: 40,
              backgroundColor: theme.COLORS.white,
            }}
          >
            <Text
              style={{
                ...theme.FONTS.H4,
                color: theme.COLORS.black,
              }}
            >
              Grand Total
            </Text>
            <Text
              style={{
                ...theme.FONTS.H4,
                color: theme.COLORS.black,
              }}
            >
              Rs. {total}
            </Text>
          </View>
          <View className="h-[100%]">
            <components.Button
              title="proceed to checkout"
              onPress={() => navigation.navigate('Checkout')}
              containerStyle={{ marginBottom: 30 }}
            />
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderCartIsEmpty = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: theme.SIZES.height * 0.05,
        }}
      >
        <View
          style={{
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <svg.ShoppingBagSvg />
        </View>
        <components.Line containerStyle={{ marginBottom: 14 }} />
        <Text
          style={{
            textAlign: 'center',
            ...theme.FONTS.H2,
            color: theme.COLORS.black,
            paddingHorizontal: 60,
            marginBottom: 14,
          }}
        >
          Your cart is empty!
        </Text>
        <Text
          style={{
            textAlign: 'center',
            ...theme.FONTS.Mulish_400Regular,
            fontSize: 16,
            color: theme.COLORS.gray1,
            lineHeight: 16 * 1.7,
            paddingHorizontal: 50,
            marginBottom: 30,
          }}
        >
          Looks like you haven&apos;t added any drinks to your cart yet.
        </Text>
        <components.Button
          title="Browse our selection"
          onPress={() => navigation.navigate('MainLayout', dispatch(setScreen('Home')))}
        />
      </ScrollView>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: products.length === 0 ? theme.COLORS.white : theme.COLORS.lightBlue2,
      }}
    >
      {renderHeader()}
      {products.length === 0 ? renderCartIsEmpty() : renderContent()}
    </View>
  );
};

export default Order;
