import { useQueryClient } from '@tanstack/react-query';
import { useNavigation } from 'expo-router';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useTextSearch } from '../../queries/products';
import { theme } from '../constants';
import { addToCart, removeFromCart } from '../store/cartSlice';
import { svg } from '../svg';

const SearchList = ({ isVisible, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [animation] = useState(new Animated.Value(0));
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.cart.list);
  const navigation = useNavigation();

  const debouncedSearch = useCallback(
    debounce((text) => {
      setDebouncedQuery(text);
    }, 100),
    [],
  );

  const {
    data: searchResults,
    isLoading,
    error,
    refetch,
  } = useTextSearch({
    query: debouncedQuery,
    enabled: debouncedQuery.length >= 5,
  });

  useEffect(() => {
    if (isVisible) {
      setSearchQuery('');
      setDebouncedQuery('');
      Animated.timing(animation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [isVisible]);

  const handleSearch = (text) => {
    const cleanedText = text.trim();
    setSearchQuery(text);

    if (cleanedText.length >= 5) {
      debouncedSearch.cancel();
      debouncedSearch(cleanedText);
    } else {
      setDebouncedQuery('');
    }
  };

  const handleCancel = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    debouncedSearch.cancel();
    queryClient.invalidateQueries({ queryKey: ['products', 'text'] });
    onClose();
  };

  const handleRetry = () => {
    refetch();
  };

  useEffect(() => {
    if (debouncedQuery.length >= 5) {
      queryClient.invalidateQueries({ queryKey: ['products', 'text'] });
    }
  }, [debouncedQuery]);

  const renderItem = ({ item }) => {
    const itemInCart = productList.find((i) => i._id === item._id);
    const totalQty = itemInCart?.volume?.reduce((acc, vol) => acc + vol?.quantity, 0);

    return (
      <TouchableOpacity
        style={styles.productItem}
        onPress={() => navigation.navigate('Product', { product: item })}
      >
        <View style={styles.productImageContainer}>
          <Image
            source={{ uri: Array.isArray(item.images) ? item.images[0] : item.images }}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>
            Rs. {item?.salePrice !== 0 ? item?.salePrice : item?.regularPrice}
          </Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            borderRadius: 50,
            borderWidth: 1,
            borderColor: theme.COLORS.lightBlue1,
            marginBottom: 5,
            height: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => dispatch(removeFromCart(item))}
            style={{
              width: 20,
              height: 20,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 14,
              paddingVertical: 15,
            }}
          >
            <svg.MinusSvg />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: 'Mulish_600SemiBold',
              color: theme.COLORS.gray1,
              fontSize: 12,
              paddingHorizontal: 8,
            }}
          >
            {itemInCart ? totalQty : 0}
          </Text>
          <TouchableOpacity
            onPress={() => dispatch(addToCart(item))}
            style={{
              width: 20,
              height: 20,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 14,
              paddingVertical: 15,
            }}
          >
            <svg.PlusSvg />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (!isVisible) return null;

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.COLORS.black} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Something went wrong.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryText}>Tap to retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (searchQuery.length < 5) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.placeholderText}>Type at least 5 characters to search</Text>
        </View>
      );
    }

    if (searchResults?.data?.products?.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.placeholderText}>No products found</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={searchResults?.data?.products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        onEndReachedThreshold={0.5}
      />
    );
  };

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: animation,
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus={true}
          />
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        {renderContent()}
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.COLORS.white,
    zIndex: 1000,
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.lightGray2,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    ...theme.FONTS.Mulish_400Regular,
    marginRight: 10,
  },
  cancelButton: {
    paddingHorizontal: 8,
  },
  cancelButtonText: {
    color: theme.COLORS.lightBlue1 || '#007AFF',
    fontSize: 16,
    ...theme.FONTS.Mulish_400Regular,
    fontWeight: '500',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    ...theme.FONTS.Mulish_600SemiBold,
    fontWeight: '600',
  },
  productPrice: {
    fontSize: 14,
    ...theme.FONTS.Mulish_400Regular,
    color: theme.COLORS.gray1,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: theme.COLORS.lightBlue1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 16,
  },
  addButtonText: {
    color: theme.COLORS.white,
    fontWeight: '500',
  },
  productImageContainer: {
    width: 50,
    height: 50,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: theme.COLORS.error || 'red',
    fontSize: 16,
    textAlign: 'center',
    ...theme.FONTS.Mulish_400Regular,
  },
  placeholderText: {
    fontSize: 16,
    textAlign: 'center',
    ...theme.FONTS.Mulish_400Regular,
  },
});

export default SearchList;
