import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';

import { useQueryClient } from '@tanstack/react-query';
import * as Location from 'expo-location';
import { Pressable } from 'react-native';
import { useProcessOrderMutation, useVerifyPaymentMutation } from '../../queries/order';
import { components } from '../components';
import { theme } from '../constants';
import { setCart, setLoading } from '../store/cartSlice';
import { setScreen } from '../store/tabSlice';
import { svg } from '../svg';

const reverseGeocode = async (address) => {
  try {
    const result = await Location.reverseGeocodeAsync({
      latitude: address?.latitude,
      longitude: address?.longitude,
    });
    if (result && result[0]) {
      const location = result[0];
      const address = location.city;

      return `${address}`;
    }
  } catch (error) {
    console.log('Error getting address:', error);
  }
};

const Checkout = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [deliveryAddressId, setDeliveryAddressId] = useState(
    addresses && addresses[0] ? addresses[0]._id : null,
  );
  const selectedCity = useSelector((state) => state?.user?.user?.location);

  const [paymentType, setPaymentType] = useState('fonepay');
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const queryClient = useQueryClient();

  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (addresses && addresses[0] && addresses[0]._id) {
      setDeliveryAddressId(addresses[0]._id);
    }
  }, [addresses]);

  useEffect(() => {
    if (route?.params?.selectedAddressId) {
      setDeliveryAddressId(route.params.selectedAddressId);
    }
  }, [route?.params?.selectedAddressId]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleSelectPayment = (type) => {
    setPaymentType(type);
    toggleModal();
  };

  const { mutate: processOrder, isPending } = useProcessOrderMutation();
  const { mutate: verifyPayment, isPending: isVerifyingPayment } = useVerifyPaymentMutation();

  useEffect(() => {
    dispatch(setLoading(isPending || isVerifyingPayment));
  }, [isPending, isVerifyingPayment]);

  const products = useSelector((state) => state.cart.list);
  const total = useSelector((state) => state.cart.total);
  const {
    user: { addresses, _id: userId },
  } = useSelector((state) => state.user);

  useEffect(() => {
    if (addresses && addresses[0] && addresses[0]._id) {
      setDeliveryAddressId(addresses[0]?._id);
    }
  }, [addresses]);
  const handleProcessOrder = async () => {
    const selectedAddress = addresses.find((address) => address._id === deliveryAddressId);
    const cityFromSelectedAddress = await reverseGeocode(selectedAddress);

    if (!selectedAddress || cityFromSelectedAddress !== selectedCity) {
      Alert.alert(
        'Delivery Unavailable',
        `Sorry, delivery is only available in ${selectedCity}. Please select an address in this city.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('ShippingDetails'),
          },
        ],
      );
      return;
    }

    const orderItems = [];
    const productMap = new Map();

    products.forEach((product) => {
      if (!productMap.has(product._id)) {
        productMap.set(product._id, {
          productId: product._id,
          volume: [],
        });
      }

      const productEntry = productMap.get(product._id);
      product.volume.forEach((volumeItem) => {
        productEntry.volume.push({
          volume: volumeItem.volume,
          quantity: volumeItem.quantity,
        });
      });
    });

    orderItems.push(...productMap.values());

    processOrder(
      {
        items: orderItems,
        paymentType,
        deliveryAddressId,
        userId,
      },
      {
        onSuccess: (paymentDetails) => {
          if (paymentType === 'cash') {
            queryClient.invalidateQueries({ queryKey: ['ordersForUser'] });
            dispatch(setCart([]));
            dispatch(setScreen('Home'));
            navigation.navigate('OrderSuccessful');
          } else {
            setPaymentData(paymentDetails?.data);
            setPaymentModalVisible(true);
          }
        },
        onError: (error) => {
          console.log('Error processing order:', error);
          Alert.alert('Error', 'Failed to process order. Please try again.');
        },
      },
    );
  };

  const generateFonepayForm = (data) => {
    const { processUrl, paymentData } = data;
    return `
      <form id="fonepayForm" method="POST" action="${processUrl}">
        ${Object.entries(paymentData)
          .map(([key, value]) => `<input type="hidden" name="${key}" value="${value}">`)
          .join('')}
      </form>
      <script>
        document.getElementById('fonepayForm').submit();
      </script>
    `;
  };

  const handleVerifyPayment = async (url) => {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    const verificationData = {
      UID: urlParams.get('UID'),
      PRN: urlParams.get('PRN'),
      ...(urlParams.get('BID') && { BID: urlParams.get('BID') }),
    };

    const orderItems = products.map((product) => ({
      productId: product._id,
      volume: product.volume.map((volumeItem) => ({
        volume: volumeItem.volume,
        quantity: volumeItem.quantity,
      })),
    }));

    console.log(
      'verificationData',
      JSON.stringify(
        {
          orderId: paymentData?.orderId,
          userId,
          items: orderItems,
          deliveryAddressId,
          paymentType,
        },
        null,
        2,
      ),
    );

    verifyPayment(
      {
        paymentData: verificationData,
        orderData: {
          orderId: paymentData?.orderId,
          userId,
          items: orderItems,
          deliveryAddressId,
          paymentType,
        },
      },
      {
        onSuccess: (result) => {
          setPaymentModalVisible(false);
          if (result?.message === 'success') {
            Alert.alert('Success', 'Payment successful!', [
              {
                text: 'OK',
                onPress: () => {
                  setTimeout(() => {
                    setRedirectUrl(null);
                  }, 2000);
                  dispatch(setCart([]));
                  dispatch(setScreen('Home'));
                  navigation.navigate('OrderSuccessful');
                },
              },
            ]);
          } else {
            Alert.alert('Payment Failed', result.message || result?.error);
          }
        },
        onError: () => {
          Alert.alert('Error', 'Payment verification failed. Please contact support.');
        },
      },
    );
  };

  const handleNavigationStateChange = async (navState) => {
    if (navState.url.includes('/api/payment/verify/')) {
      setPaymentModalVisible(false);
      setRedirectUrl(navState.url);
    }
  };

  useEffect(() => {
    if (!paymentModalVisible && redirectUrl) {
      handleVerifyPayment(redirectUrl);
    }
  }, [paymentModalVisible, redirectUrl]);

  const renderHeader = () => {
    return <components.Header title="Checkout" goBack={true} displayScreenName={true} />;
  };

  const renderContent = () => {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: theme.COLORS.lightBlue2,
        }}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 mb-3 mt-3" style={{ backgroundColor: theme.COLORS.white }}>
          <Text
            style={{
              ...theme.FONTS.Mulish_700Bold,
              fontSize: 16,
              color: theme.COLORS.black,
            }}
            className="my-3"
          >
            Your Items ({products?.length})
          </Text>
          {products?.map((item, index) => {
            return (
              <React.Fragment key={index}>
                {item.volume.map((volumeItem, volumeIndex) => (
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
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                          style={{
                            ...theme.FONTS.Mulish_700Bold,
                            fontSize: 14,
                            color: theme.COLORS.black,
                            marginRight: 10,
                          }}
                        >
                          X{volumeItem.quantity}
                        </Text>
                        <ImageBackground
                          source={{ uri: item.images[0] }}
                          style={{
                            width: 70,
                            height: 70,
                            marginRight: 14,
                          }}
                        ></ImageBackground>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            ...theme.FONTS.Mulish_400Regular,
                            fontSize: 14,
                            color: theme.COLORS.gray1,
                            lineHeight: 14 * 1.7,
                          }}
                        >
                          {item.brand}
                        </Text>
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
                          {item.name}
                        </Text>
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
                        <components.Price
                          item={volumeItem}
                          containerStyle={{ alignSelf: 'flex-end' }}
                        />
                      </View>
                    </View>
                    {(volumeIndex !== item.volume.length - 1 || index !== products.length - 1) && (
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
              Rs. {total?.toFixed(2)}
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
              Rs. {total?.toFixed(2)}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 10,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.COLORS.white,
          }}
          className="mt-3"
          onPress={() => {
            navigation.navigate('ShippingDetails');
          }}
        >
          <View>
            <Text
              style={{
                ...theme.FONTS.Mulish_700Bold,
                fontSize: 16,
                color: theme.COLORS.black,
              }}
              className="mb-5"
            >
              Delivery Address
            </Text>
            <Text
              style={{
                ...theme.FONTS.Mulish_400Regular,
                fontSize: 14,
                color: theme.COLORS.gray1,
                lineHeight: 14 * 1.5,
              }}
              numberOfLines={1}
            >
              {addresses &&
                addresses.find((address) => address._id === deliveryAddressId)?.addressDetails}
            </Text>
          </View>
          <svg.CheckoutArrow />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 10,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.COLORS.white,
          }}
          className="mt-3"
          onPress={toggleModal}
        >
          <View>
            <Text
              style={{
                ...theme.FONTS.Mulish_700Bold,
                fontSize: 16,
                color: theme.COLORS.black,
              }}
              className="mb-5"
            >
              Payment method
            </Text>
            <Text
              style={{
                ...theme.FONTS.Mulish_400Regular,
                fontSize: 14,
                color: theme.COLORS.gray1,
                lineHeight: 14 * 1.5,
              }}
              numberOfLines={1}
            >
              {paymentType === 'cash' ? 'Cash on Delivery' : 'FonePay'}
            </Text>
          </View>
          <svg.CheckoutArrow />
        </TouchableOpacity>
        <View
          style={{
            paddingHorizontal: 20,
            marginBottom: theme.SIZES.height * 0.1,
            backgroundColor: theme.COLORS.white,
          }}
          className="mt-3"
        >
          <View
            style={{
              width: '100%',
              height: 100,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: theme.COLORS.lightBlue1,
              marginBottom: 40,
              marginTop: 20,
            }}
          >
            <TextInput
              style={{
                width: '100%',
                height: '100%',
                paddingHorizontal: 30,
                paddingTop: 23,
                paddingBottom: 23,
              }}
              placeholder="Enter your comment"
              textAlignVertical="top"
              multiline={true}
            />
            <View
              style={{
                position: 'absolute',
                top: -10,
                left: 20,
                paddingHorizontal: 10,
                backgroundColor: theme.COLORS.white,
              }}
            >
              <Text
                style={{
                  color: theme.COLORS.gray1,
                  fontFamily: 'Mulish_600SemiBold',
                  fontSize: 12,
                  textTransform: 'uppercase',
                }}
              >
                comment
              </Text>
            </View>
          </View>
          <View className="h-[100%]">
            <components.Button
              title="Confirm Order"
              onPress={handleProcessOrder}
              containerStyle={{ marginBottom: 30 }}
            />
          </View>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={toggleModal}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <View
              style={{
                width: '100%',
                paddingHorizontal: 20,
                paddingTop: 20,
                paddingBottom: 40,
                backgroundColor: theme.COLORS.white,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  ...theme.FONTS.Mulish_700Bold,
                  fontSize: 18,
                  marginBottom: 30,
                  marginTop: 10,
                }}
              >
                Select Payment Method
              </Text>

              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 30,
                }}
              >
                <Pressable
                  onPress={() => handleSelectPayment('cash')}
                  style={[
                    {
                      flex: 1,
                      padding: 20,
                      borderRadius: 15,
                      marginRight: 15,
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                    paymentType === 'cash'
                      ? {
                          borderColor: theme.COLORS.lightBlue1,
                          backgroundColor: theme.COLORS.lightBlue2,
                          borderWidth: 1,
                        }
                      : {
                          borderColor: theme.COLORS.gray2,
                          backgroundColor: theme.COLORS.white,
                        },
                  ]}
                >
                  <Text
                    style={{
                      ...theme.FONTS.Mulish_700Bold,
                      fontSize: 16,
                      color: paymentType === 'cash' ? theme.COLORS.lightBlue1 : theme.COLORS.gray1,
                    }}
                  >
                    Cash on Delivery
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => handleSelectPayment('fonepay')}
                  style={[
                    {
                      flex: 1,
                      padding: 20,
                      borderRadius: 15,
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                    paymentType === 'fonepay'
                      ? {
                          borderColor: theme.COLORS.lightBlue1,
                          backgroundColor: theme.COLORS.lightBlue2,
                          borderWidth: 1,
                        }
                      : {
                          borderColor: theme.COLORS.gray2,
                          backgroundColor: theme.COLORS.white,
                        },
                  ]}
                >
                  <Text
                    style={{
                      ...theme.FONTS.Mulish_700Bold,
                      fontSize: 16,
                      color:
                        paymentType === 'fonepay' ? theme.COLORS.lightBlue1 : theme.COLORS.gray1,
                    }}
                  >
                    FonePay
                  </Text>
                </Pressable>
              </View>

              <TouchableOpacity
                onPress={toggleModal}
                style={{
                  marginTop: 5,
                }}
              >
                <Text
                  style={{
                    ...theme.FONTS.Mulish_400Regular,
                    fontSize: 14,
                    color: theme.COLORS.gray1,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          visible={paymentModalVisible}
          transparent={false}
          animationType="slide"
          onRequestClose={() => {
            setPaymentModalVisible(false);
          }}
        >
          <View style={{ flex: 1 }}>
            {paymentData ? (
              <WebView
                source={{ html: generateFonepayForm(paymentData) }}
                onNavigationStateChange={handleNavigationStateChange}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
              />
            ) : (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#4285F4" />
              </View>
            )}
            <TouchableOpacity
              onPress={() => setPaymentModalVisible(false)}
              className="absolute top-10 right-5 p-3 bg-gray-800 rounded-full"
            >
              <Text className="text-white font-bold">✕</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </KeyboardAwareScrollView>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.lightBlue2 }}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
};

export default Checkout;
