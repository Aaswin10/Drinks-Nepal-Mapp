import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../../queries/authentication/authentication';
import { components } from '../components';
import { theme } from '../constants';
import { setLoading } from '../store/cartSlice';
import { resetUserNotificationUnReadCount } from '../store/userSlice';

const NotificationScreen = () => {
  const userId = useSelector((state) => state?.user?.user?._id);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetUserNotificationUnReadCount());
  }, []);

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['notifications', userId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetchNotifications().mutationFn({
        page: pageParam,
        pageSize: 10,
        userId,
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined;
    },
    enabled: !!userId,
  });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const notifications = data?.pages.flatMap((page) => page?.notifications || []) || [];

  const renderNotification = ({ item }) => (
    <View style={styles.notificationCard}>
      <View style={styles.notificationHeader}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.time}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.notificationBody}>{item.message}</Text>
    </View>
  );

  const renderHeader = () => (
    <components.Header goBack={true} title="Notifications" displayScreenName={true} />
  );

  return (
    <View style={styles.container}>
      {renderHeader()}

      {isLoading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      ) : notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          onEndReached={() => {
            if (!isFetchingNextPage && hasNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notifications found</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  headerContainer: {
    backgroundColor: theme.COLORS.white,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: theme.COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: theme.COLORS.lightBlue1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.COLORS.primary,
  },
  time: {
    color: theme.COLORS.lightBlue1,
    fontSize: 12,
    fontStyle: 'italic',
  },
  notificationBody: {
    fontSize: 14,
    color: theme.COLORS.gray1,
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.COLORS.white,
  },
  emptyText: {
    ...theme.FONTS.Mulish_600SemiBold,
    color: theme.COLORS.primary,
    fontSize: 16,
  },
  loadingText: {
    ...theme.FONTS.Mulish_600SemiBold,
    color: theme.COLORS.accent,
    fontSize: 16,
  },
});

export default NotificationScreen;
