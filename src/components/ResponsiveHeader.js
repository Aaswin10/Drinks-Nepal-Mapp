import { useNavigation, useRoute } from '@react-navigation/native';
import React, { memo } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useResponsiveDimensions } from '../hooks/useResponsiveDimensions';
import { selectCartItemCount, selectNotificationCount } from '../store/selectors';
import { theme } from '../constants';
import { svg } from '../svg';
import { setScreen } from '../store/tabSlice';
import LocationSelector from './LocationSelector';

const ResponsiveHeader = memo(({
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
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { getScaledSize, getResponsiveValue } = useResponsiveDimensions();
  
  const screenName = name || route.name;
  const unreadCount = useSelector(selectNotificationCount);
  const cartItemCount = useSelector(selectCartItemCount);

  const styles = createStyles(getScaledSize, getResponsiveValue);

  const handleNotificationPress = () => {
    // Mark notifications as read and navigate
    // This should be implemented with the notification mutation
    navigation.navigate('Notification');
  };

  const handleCartPress = () => {
    dispatch(setScreen('Cart'));
    navigation.navigate('MainLayout', { screen: 'Cart' });
  };

  return (
    <View style={[styles.container, containerStyle, { height }]}>
      {goBack && (
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <svg.GoBackSvg color={theme.COLORS.black} />
          </TouchableOpacity>
          {displayScreenName && (
            <Text style={styles.screenName}>
              {screenName.replace(/([a-z])([A-Z])/g, '$1 $2')}
            </Text>
          )}
        </View>
      )}

      {logo && (
        <View style={styles.logoContainer}>
          <View style={styles.logoSection}>
            <svg.LogoSvg />
            <LocationSelector
              currentLocation={currentLocation}
              setIsLocationModalVisible={setIsLocationModalVisible}
            />
          </View>

          {(name || address) && (
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Hi, {name}</Text>
              <Text style={styles.userAddress}>{address}</Text>
            </View>
          )}
        </View>
      )}

      {search && (
        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.searchInput} onPress={onSearchPress}>
            <svg.HeaderSearchSvg />
            <Text style={styles.searchPlaceholder}>Search</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationPress}>
            <svg.NotificationSvg />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}

      {cart && (
        <View style={styles.cartContainer}>
          <TouchableOpacity style={styles.cartButton} onPress={handleCartPress}>
            <svg.BagSvg width={getScaledSize(28)} height={getScaledSize(28)} />
            {cartItemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.badgeText}>
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});

const createStyles = (getScaledSize, getResponsiveValue) => StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.white,
    paddingHorizontal: getScaledSize(16),
    paddingVertical: getScaledSize(8),
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getScaledSize(8),
  },
  backButton: {
    padding: getScaledSize(12),
    marginLeft: -getScaledSize(12),
  },
  screenName: {
    ...theme.FONTS.Mulish_700Bold,
    color: theme.COLORS.black,
    fontSize: getScaledSize(18),
    marginLeft: getScaledSize(8),
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: getScaledSize(12),
  },
  logoSection: {
    flex: 1,
    gap: getScaledSize(4),
  },
  userInfo: {
    alignItems: 'flex-end',
  },
  userName: {
    ...theme.FONTS.Mulish_700Bold,
    fontSize: getScaledSize(16),
    color: theme.COLORS.darkBlue,
    textTransform: 'capitalize',
  },
  userAddress: {
    ...theme.FONTS.Mulish_400Regular,
    fontSize: getScaledSize(12),
    color: theme.COLORS.lightGray,
    textTransform: 'capitalize',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getScaledSize(12),
    marginVertical: getScaledSize(16),
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: theme.COLORS.lightGray1,
    borderWidth: 1,
    borderRadius: getScaledSize(12),
    padding: getScaledSize(12),
    gap: getScaledSize(8),
  },
  searchPlaceholder: {
    color: theme.COLORS.lightGray,
    fontSize: getScaledSize(14),
    ...theme.FONTS.Mulish_400Regular,
  },
  notificationButton: {
    borderColor: theme.COLORS.lightGray1,
    borderWidth: 1,
    borderRadius: getScaledSize(12),
    padding: getScaledSize(12),
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -getScaledSize(6),
    top: -getScaledSize(6),
    backgroundColor: theme.COLORS.accent,
    borderRadius: getScaledSize(12),
    minWidth: getScaledSize(20),
    height: getScaledSize(20),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: getScaledSize(4),
  },
  badgeText: {
    color: theme.COLORS.white,
    fontSize: getScaledSize(10),
    ...theme.FONTS.Mulish_700Bold,
    textAlign: 'center',
  },
  cartContainer: {
    alignItems: 'flex-end',
    marginTop: -getScaledSize(30),
    paddingRight: getScaledSize(16),
  },
  cartButton: {
    borderColor: theme.COLORS.lightGray1,
    borderWidth: 1,
    borderRadius: getScaledSize(12),
    padding: getScaledSize(10),
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    right: -getScaledSize(6),
    top: -getScaledSize(10),
    backgroundColor: theme.COLORS.accent,
    borderRadius: getScaledSize(12),
    minWidth: getScaledSize(20),
    height: getScaledSize(20),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: getScaledSize(4),
  },
});

ResponsiveHeader.displayName = 'ResponsiveHeader';
export default ResponsiveHeader;