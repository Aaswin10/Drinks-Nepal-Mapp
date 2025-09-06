import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux';
import { useMarkNotificationAsReadMutation } from '../../queries/authentication';
import { theme } from '../constants';
import { setLoading } from '../store/cartSlice';
import { resetUserNotificationUnReadCount } from '../store/userSlice';
import { svg } from '../svg';
import ContactCategory from './ContactCategory';
import LocationSelector from './LocationSelector';
import { setScreen } from '../store/tabSlice';

const Header = ({
  containerStyle,
  goBack,
  name,
  address,
  logo,
  search,
  onSearchPress,
  border,
  height,
  displayScreenName,
  currentLocation,
  setIsLocationModalVisible,
  cart,
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const screenName = name || route.name;
  const dispatch = useDispatch();
  const { unreadCount = 0 } = useSelector((state) => state.user?.user?.notification || {});
  const { _id = null } = useSelector((state) => state.user?.user || {});
  const { mutate: markNotificationAsRead, isPending } = useMarkNotificationAsReadMutation();
  const cartItems = useSelector((state) => state.cart?.list || []);
  const cartItemCount = cartItems.reduce((total, item) => {
    return total + (item.volume?.reduce((sum, vol) => sum + (vol.quantity || 0), 0) || 0);
  }, 0);
  useEffect(() => {
    dispatch(setLoading(isPending));
  }, [isPending]);

  const [showModal, setShowModal] = useState(false);

  const handleNotificationPress = () => {
    markNotificationAsRead(
      { userId: _id },
      {
        onSuccess: () => {
          navigation.navigate('Notification');
          dispatch(resetUserNotificationUnReadCount());
        },
        onError: (error) => {
          console.log('Error marking notification as read', error);
        },
      },
    );
  };

  const handleCartPress = () => {
    dispatch(setScreen('Cart'));
    navigation.navigate('MainLayout', { screen: 'Cart' });
  };

  const renderContacts = () => {
    return (
      <Modal
        isVisible={showModal}
        onBackdropPress={() => setShowModal(false)}
        hideModalContentWhileAnimating={true}
        backdropTransitionOutTiming={0}
        style={{ margin: 0 }}
        animationIn="slideInLeft"
        animationOut="slideOutLeft"
      >
        <View
          style={{
            width: 270,
            height: theme.SIZES.height,
            backgroundColor: theme.COLORS.black,
            paddingHorizontal: 20,
            paddingTop: 60,
            paddingBottom: 50,
            justifyContent: 'space-between',
          }}
        >
          <View>
            <View
              style={{
                width: 1,
                height: 30,
                backgroundColor: theme.COLORS.white,
                marginBottom: 14,
              }}
            />
            <Text
              style={{
                ...theme.FONTS.H2,
                color: theme.COLORS.white,
                marginBottom: 10,
              }}
            >
              Contact us
            </Text>
            <ContactCategory
              lineOne="27 Division St, New York,"
              lineTwo="NY 10002, USA"
              icon={<svg.ContactMapPinSvg />}
            />
            <ContactCategory
              lineOne="manerosale@mail.com"
              lineTwo="manerosupport@mail.com"
              icon={<svg.ContactMailSvg />}
            />
            <ContactCategory
              lineOne="+17  123456789"
              lineTwo="+17  987654321"
              icon={<svg.ContactPhoneSvg />}
            />
          </View>
          <View>
            <Text
              style={{
                color: '#B3B9C7',
                ...theme.FONTS.Mulish_400Regular,
                fontSize: 14,
                lineHeight: 14 * 1.7,
                marginBottom: 18,
              }}
            >
              Track your order
            </Text>
            <TouchableOpacity
              style={{
                width: '100%',
                height: 50,
                borderColor: 'rgba(219,227,245, 0.2)',
                borderWidth: 1,
                borderRadius: 25,
                paddingLeft: 30,
                paddingRight: 5,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onPress={() => {
                setShowModal(false);
                navigation.navigate('TrackYourOrder', {
                  orderNumber: '100345',
                });
              }}
            >
              <Text
                style={{
                  color: '#B3B9C7',
                  paddingHorizontal: 10,
                  position: 'absolute',
                  top: -11,
                  left: 20,
                  backgroundColor: theme.COLORS.black,
                  textTransform: 'uppercase',
                  ...theme.FONTS.Mulish_600SemiBold,
                  fontSize: 12,
                  lineHeight: 12 * 1.7,
                }}
              >
                order number
              </Text>
              <Text style={{ color: theme.COLORS.white }}>100345</Text>
              <svg.GoToOrderSvg />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View
      style={{
        flexDirection: 'column',
        ...containerStyle,
        borderBottomWidth: border ? 1 : 0,
        borderBottomColor: theme.COLORS.lightBlue1,
        backgroundColor: theme.COLORS.white,
        height: height,
      }}
    >
      {goBack && (
        <View
          style={{
            left: 0,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            width: '100%',
          }}
        >
          <TouchableOpacity
            style={{
              paddingHorizontal: 20,
              paddingVertical: 12,
            }}
            onPress={() => navigation.goBack()}
          >
            <svg.GoBackSvg color={theme.COLORS.black} />
          </TouchableOpacity>
          {displayScreenName && (
            <Text
              style={{
                ...theme.FONTS.Mulish_700Bold,
                color: theme.COLORS.black,
                marginLeft: 10,
                fontSize: 18,
              }}
            >
              {screenName.replace(/([a-z])([A-Z])/g, '$1 $2')}
            </Text>
          )}
        </View>
      )}
      {logo && (
        <View className="mx-5 my-3 flex flex-row justify-between items-center">
          <View className="flex flex-w justify-between gap-1">
            <svg.LogoSvg />
            <LocationSelector
              currentLocation={currentLocation}
              setIsLocationModalVisible={setIsLocationModalVisible}
            />
          </View>

          {(name || address) && (
            <View className="flex flex-column justify-between gap-1">
              <Text
                style={{
                  textAlign: 'right',
                  textTransform: 'capitalize',
                  ...theme.FONTS.Mulish_700Bold,
                  fontSize: 16,
                  color: theme.COLORS.darkBlue,
                }}
              >
                Hi, {name}
              </Text>
              <Text
                style={{
                  textAlign: 'right',
                  textTransform: 'capitalize',
                  ...theme.FONTS.Mulish_400Regular,
                  color: theme.COLORS.lightGray,
                }}
              >
                {address}
              </Text>
            </View>
          )}
        </View>
      )}
      {search && (
        <>
          <View className="mx-5 my-5 flex flex-row justify-between">
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderColor: theme.COLORS.lightGray1,
                borderWidth: 1,
                borderRadius: 12,
                padding: 10,
              }}
              onPress={onSearchPress}
            >
              <View>
                <svg.HeaderSearchSvg />
              </View>

              <Text
                style={{
                  height: '100%',
                  width: '77%',
                  marginLeft: 8,
                  color: theme.COLORS.lightGray,
                }}
              >
                Search
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: theme.COLORS.lightGray1,
                borderWidth: 1,
                borderRadius: 12,
                marginHorizontal: 12,
                width: '12%',
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={handleNotificationPress}
              >
                <svg.NotificationSvg />

                {/* Badge to show the total notification */}
                <View
                  style={{
                    position: 'absolute',
                    right: -6,
                    top: -16,
                    backgroundColor: theme.COLORS.accent,
                    borderRadius: 12,
                    zIndex: 2,
                    padding: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: theme.COLORS.white,
                      ...theme.FONTS.Mulish_700Bold,
                      fontSize: 12,
                      paddingHorizontal: 3,
                      paddingVertical: 1,
                      textAlign: 'center',
                    }}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
      {cart && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingRight: 16,
            marginTop: -30,
          }}
        >
          <TouchableOpacity
            onPress={handleCartPress}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: theme.COLORS.lightGray1,
              borderWidth: 1,
              borderRadius: 12,
              padding: 10,
            }}
          >
            <svg.BagSvg width={28} height={28} />
            {cartItemCount > 0 && (
              <View
                style={{
                  position: 'absolute',
                  right: -6,
                  top: -10,
                  backgroundColor: theme.COLORS.accent,
                  borderRadius: 12,
                  zIndex: 2,
                  padding: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    color: theme.COLORS.white,
                    ...theme.FONTS.Mulish_700Bold,
                    fontSize: 12,
                    paddingHorizontal: 3,
                    paddingVertical: 1,
                    textAlign: 'center',
                  }}
                >
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}

      {renderContacts()}
    </View>
  );
};

export default Header;
