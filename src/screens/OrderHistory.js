import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDispatch, useSelector } from 'react-redux';
import { useOrdersForUser } from '../../queries/order';
import { theme } from '../constants';
import { setLoading } from '../store/cartSlice';
import { svg } from '../svg';

const OrderHistory = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {
    user: { _id: userId },
  } = useSelector((state) => state.user);

  const { data, isLoading, refetch } = useOrdersForUser({ userId });
  const [orderHistory, setOrderHistory] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  }, [refetch]);

  useEffect(() => {
    if (data?.data?.orders) {
      setOrderHistory(data.data.orders);
    }
  }, [data]);

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading]);

  const renderHeader = () => {
    const prevRoute = navigation.getState().routes[navigation.getState().routes.length - 2];
    const showBackButton = prevRoute?.name === 'OrderSuccessful';

    return (
      <View className="w-full p-[20px] flex-row items-center">
        {showBackButton && (
          <TouchableOpacity
            style={{
              paddingHorizontal: 20,
              paddingVertical: 12,
            }}
            onPress={() => {
              navigation.navigate('MainLayout');
            }}
          >
            <svg.GoBackSvg color={theme.COLORS.black} />
          </TouchableOpacity>
        )}
        <Text
          className="text-xl"
          style={{
            ...theme.FONTS.Mulish_700Bold,
          }}
        >
          Orders
        </Text>
      </View>
    );
  };

  function renderOrder(order) {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('OrderDetails', { order })}
        activeOpacity={0.7}
        key={order._id}
      >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderTitle}>Order ID: {order.orderId}</Text>
            <View className="flex flex-row w-full justify-between items-center">
              <View className="w-1/2 flex flex-col items-start justify-start">
                <Text style={styles.cardHeaderSubtitle}>Order Placed:</Text>
                <Text style={{ ...styles.cardHeaderSubtitle, ...theme.FONTS.Mulish_700Bold }}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <View className="w-1/2 flex flex-col items-start justify-start">
                <Text style={styles.cardHeaderSubtitle}>
                  {order.status === 'delivered' ? 'Delivered' : 'Status:'}
                </Text>
                <Text style={{ ...styles.cardHeaderSubtitle, ...theme.FONTS.Mulish_700Bold }}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.cardContent}>
            <View className="mb-5">
              {order.status === 'delivered' && (
                <Text style={{ ...styles.cardHeaderTitle, ...theme.FONTS.Mulish_700Bold }}>
                  Delivered on {new Date(order.updatedAt).toLocaleDateString()}
                </Text>
              )}
              {order.status !== 'delivered' && (
                <Text style={{ ...styles.cardHeaderSubtitle, color: theme.COLORS.lightBlue1 }}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Text>
              )}
            </View>

            <View className="px-[10px] w-full ">
              {order.items.map((item) => (
                <View key={item._id} className="flex flex-row items-center mb-5">
                  <Text style={styles.quantityText}>{item.quantity}x</Text>

                  <Image
                    source={{ uri: item?.product?.images[0] }}
                    style={styles.productImage}
                    resizeMode="contain"
                  />
                  <View className="flex-1">
                    <Text style={styles?.productBrand}>{item?.product?.sku}</Text>
                    <Text style={styles?.productName} numberOfLines={2} ellipsizeMode="tail">
                      {item?.product?.name}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  const renderContent = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.COLORS.lightBlue1]}
            tintColor={theme.COLORS.lightBlue1}
          />
        }
      >
        {orderHistory && orderHistory.length > 0 ? (
          orderHistory.map((order) => renderOrder(order))
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ ...theme.FONTS.Mulish_600SemiBold, color: theme.COLORS.gray1 }}>
              No orders found
            </Text>
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.white }}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = {
  card: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderColor: theme.COLORS.lightGray1,
    borderWidth: 1,
    elevation: 3,
  },
  cardHeader: {
    padding: 15,
    backgroundColor: theme.COLORS.lightGray1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardHeaderTitle: {
    ...theme.FONTS.H5,
    color: theme.COLORS.black,
  },
  cardHeaderSubtitle: {
    ...theme.FONTS.Mulish_400Regular,
    fontSize: 12,
    color: theme.COLORS.gray1,
    marginTop: 5,
  },
  cardContent: {
    padding: 15,
  },
  cardContentText: {
    ...theme.FONTS.Mulish_600SemiBold,
    fontSize: 14,
    color: theme.COLORS.lightGray,
    marginBottom: 10,
  },
  quantityText: {
    ...theme.FONTS.Mulish_700Bold,
    fontSize: 14,
    color: theme.COLORS.lightGray,
    marginRight: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  productBrand: {
    ...theme.FONTS.Mulish_700Bold,
    fontSize: 12,
    color: theme.COLORS.lightGray,
    marginBottom: 5,
  },
  productName: {
    ...theme.FONTS.Mulish_400Regular,
    fontSize: 14,
    color: theme.COLORS.black,
    lineHeight: 16,
  },
};

export default OrderHistory;
