import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useBannerImageUrl, useHomeCategories, useTrendingProducts } from '../../queries/products';
import { useResponsiveDimensions } from '../hooks/useResponsiveDimensions';
import { selectUser, selectUserLocation } from '../store/selectors';
import { theme } from '../constants';
import { setLoading } from '../store/cartSlice';
import { loadUserLocationFromStorage, setUserLocationWithStorage } from '../store/userSlice';
import { components } from '../components';
import SearchList from './SearchList';

const HomeOne = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { getScaledSize, getResponsiveValue, width } = useResponsiveDimensions();

  // Memoized selectors
  const user = useSelector(selectUser);
  const currentLocation = useSelector(selectUserLocation);
  const isLoading = useSelector(selectCartLoading);
  const isNewUser = !currentLocation;

  // API calls with proper error handling
  const { data: categories } = useHomeCategories();
  const { data: banners = [], isLoading: isLoadingBanners } = useBannerImageUrl();
  const { data: searchResults, isLoading: isProductsLoading } = useTrendingProducts({ pageSize: 4 });

  // Local state
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);

  const flatListRef = useRef(null);

  // Memoized API URL
  const API_URL = useMemo(() => 
    Platform.OS === 'android' ? process.env.APP_API_BASE_URL_ANDROID : process.env.APP_API_BASE_URL,
    []
  );

  // Effects
  useEffect(() => {
    dispatch(loadUserLocationFromStorage());
  }, [dispatch]);

  useEffect(() => {
    if (isNewUser) {
      setIsLocationModalVisible(true);
    }
  }, [isNewUser]);

  useEffect(() => {
    dispatch(setLoading(isProductsLoading));
  }, [isProductsLoading, dispatch]);

  // Auto-scroll banners with cleanup
  useEffect(() => {
    if (banners.length <= 1) return;
    
    const interval = setInterval(() => {
      const nextIndex = (currentBannerIndex + 1) % banners.length;
      flatListRef.current?.scrollToIndex({ 
        index: nextIndex, 
        animated: true,
        viewPosition: 0.5 
      });
      setCurrentBannerIndex(nextIndex);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentBannerIndex, banners.length]);

  // Memoized callbacks
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleLocationSelect = useCallback((location) => {
    dispatch(setUserLocationWithStorage(location));
    setIsLocationModalVisible(false);
    Alert.alert('Welcome!', `Your location is set to ${location}`, [{ text: 'OK' }]);
  }, [dispatch]);

  const handleSearchPress = useCallback(() => {
    setIsSearchVisible(true);
  }, []);

  const handleCloseSearch = useCallback(() => {
    setIsSearchVisible(false);
  }, []);

  // Memoized styles
  const styles = useMemo(() => createStyles(getScaledSize, getResponsiveValue, width), [getScaledSize, getResponsiveValue, width]);

  // Memoized render functions
  const renderBannerItem = useCallback(({ item }) => {
    if (!item?.url) return null;
    
    let imageUrl = item.url;
    if (!imageUrl.startsWith('http')) {
      imageUrl = `${API_URL}${imageUrl}`;
    }
    
    return (
      <TouchableOpacity activeOpacity={0.9} style={styles.bannerTouchable}>
        <components.OptimizedImage
          uri={imageUrl}
          containerStyle={styles.bannerContainer}
          style={styles.bannerImage}
          resizeMode="cover"
          loaderSize="large"
          loaderColor={theme.COLORS.lightBlue1}
        />
      </TouchableOpacity>
    );
  }, [API_URL, styles]);

  const renderCategoryItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() =>
        navigation.navigate('CategoryShop', {
          id: item._id,
          title: item.name,
          subCategories: item.subcategories,
          searchType: 'text',
          type: item.type,
        })
      }
    >
      <components.OptimizedImage
        uri={`${API_URL}${item?.imageUrl}`}
        containerStyle={styles.categoryImageContainer}
        style={styles.categoryImage}
        resizeMode="contain"
        showLoader={false}
      />
      <Text style={styles.categoryText} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  ), [API_URL, navigation, styles]);

  const renderBanner = useMemo(() => {
    if (isLoadingBanners) {
      return (
        <View style={[styles.bannerContainer, styles.loadingContainer]}>
          <ActivityIndicator size="large" color={theme.COLORS.lightBlue1} />
        </View>
      );
    }

    if (!banners.length) {
      return (
        <View style={styles.bannerContainer}>
          <View style={styles.placeholderBanner}>
            <Text style={styles.placeholderText}>No banners available</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.bannerWrapper}>
        <components.OptimizedFlatList
          ref={flatListRef}
          data={banners}
          renderItem={renderBannerItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const contentOffset = event.nativeEvent.contentOffset;
            const viewSize = event.nativeEvent.layoutMeasurement;
            const pageNum = Math.floor(contentOffset.x / viewSize.width);
            setCurrentBannerIndex(pageNum);
          }}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
        {banners.length > 1 && (
          <View style={styles.pagination}>
            {banners.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentBannerIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        )}
      </View>
    );
  }, [banners, isLoadingBanners, renderBannerItem, currentBannerIndex, styles, width]);

  const renderCategories = useMemo(() => (
    <View style={styles.sectionContainer}>
      <components.ProductCategory
        title="C A T E G O R I E S"
        containerStyle={styles.sectionHeaderStyle}
        onPress={() =>
          navigation.navigate('CategoryShop', {
            title: 'Categories',
            searchType: 'category',
          })
        }
      />
      <components.OptimizedFlatList
        data={categories?.data}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item?._id?.toString()}
        numColumns={3}
        scrollEnabled={false}
        contentContainerStyle={styles.categoriesContainer}
      />
    </View>
  ), [categories, renderCategoryItem, navigation, styles]);

  const renderSpecials = useMemo(() => (
    <View style={styles.sectionContainer}>
      <components.ProductCategory
        title="Drinks Nepal Special"
        containerStyle={styles.sectionHeaderStyle}
        onPress={() =>
          navigation.navigate('CategoryShop', {
            title: 'Specials',
            searchType: 'trending',
          })
        }
      />
      <components.OptimizedProductList
        data={searchResults?.data?.products}
        loading={isProductsLoading}
        numColumns={2}
      />
    </View>
  ), [searchResults, isProductsLoading, navigation, styles]);

  const renderLocationModal = useMemo(() => {
    if (!isNewUser) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isLocationModalVisible}
        onRequestClose={() => {
          Alert.alert('Location Required', 'Please select a location to continue', [{ text: 'OK' }]);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Welcome to Drinks Nepal!</Text>
            <Text style={styles.modalSubtitle}>Select Your Location to Get Started</Text>

            <View style={styles.locationButtonContainer}>
              <Pressable
                style={styles.locationButton}
                onPress={() => handleLocationSelect('Kathmandu')}
              >
                <Text style={styles.locationButtonText}>Kathmandu</Text>
              </Pressable>

              <Pressable
                style={styles.locationButton}
                onPress={() => handleLocationSelect('Pokhara')}
              >
                <Text style={styles.locationButtonText}>Pokhara</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
  }, [isNewUser, isLocationModalVisible, handleLocationSelect, styles]);

  const renderHeader = useCallback(() => (
    <components.ResponsiveHeader
      logo={true}
      search={true}
      onSearchPress={handleSearchPress}
      name={user?.fullName}
      address={user?.phoneNumber}
      setIsLocationModalVisible={setIsLocationModalVisible}
      currentLocation={currentLocation}
    />
  ), [user, currentLocation, handleSearchPress]);

  const listData = useMemo(() => [
    { id: 'banner', type: 'banner' },
    { id: 'categories', type: 'categories' },
    { id: 'specials', type: 'specials' },
  ], []);

  const renderListItem = useCallback(({ item }) => {
    switch (item.type) {
      case 'banner':
        return renderBanner;
      case 'categories':
        return renderCategories;
      case 'specials':
        return renderSpecials;
      default:
        return null;
    }
  }, [renderBanner, renderCategories, renderSpecials]);

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderLocationModal}
      <components.OptimizedFlatList
        data={listData}
        renderItem={renderListItem}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      />
      <SearchList isVisible={isSearchVisible} onClose={handleCloseSearch} />
    </View>
  );
};

const createStyles = (getScaledSize, getResponsiveValue, screenWidth) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.lightGray1,
  },
  bannerWrapper: {
    height: getScaledSize(200),
    marginBottom: getScaledSize(10),
    position: 'relative',
  },
  bannerContainer: {
    width: screenWidth - getScaledSize(20),
    height: getScaledSize(200),
    marginHorizontal: getScaledSize(10),
    borderRadius: getScaledSize(10),
    overflow: 'hidden',
    backgroundColor: theme.COLORS.lightGray,
  },
  bannerTouchable: {
    width: screenWidth,
    height: getScaledSize(200),
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderBanner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    fontSize: getScaledSize(16),
    color: theme.COLORS.gray1,
    ...theme.FONTS.Mulish_400Regular,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: getScaledSize(10),
    alignSelf: 'center',
  },
  paginationDot: {
    width: getScaledSize(8),
    height: getScaledSize(8),
    borderRadius: getScaledSize(4),
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: getScaledSize(4),
  },
  paginationDotActive: {
    backgroundColor: theme.COLORS.white,
    width: getScaledSize(20),
  },
  sectionContainer: {
    paddingVertical: getScaledSize(20),
    backgroundColor: theme.COLORS.white,
    marginBottom: getScaledSize(12),
  },
  sectionHeaderStyle: {
    marginHorizontal: getScaledSize(20),
    marginBottom: getScaledSize(16),
  },
  categoriesContainer: {
    paddingHorizontal: getScaledSize(10),
  },
  categoryItem: {
    flex: 1,
    margin: getScaledSize(5),
    padding: getScaledSize(8),
    backgroundColor: theme.COLORS.white,
    height: getScaledSize(80),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: theme.COLORS.lightBlue2,
    borderWidth: 1,
    borderRadius: getScaledSize(12),
  },
  categoryImageContainer: {
    width: getScaledSize(30),
    height: getScaledSize(30),
    marginBottom: getScaledSize(8),
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryText: {
    fontSize: getScaledSize(11),
    textAlign: 'center',
    color: theme.COLORS.black,
    ...theme.FONTS.Mulish_400Regular,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    maxWidth: getScaledSize(400),
    backgroundColor: 'white',
    borderRadius: getScaledSize(20),
    padding: getScaledSize(20),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: getScaledSize(20),
    fontWeight: 'bold',
    marginBottom: getScaledSize(10),
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: getScaledSize(16),
    marginBottom: getScaledSize(20),
    textAlign: 'center',
    color: theme.COLORS.gray1,
  },
  locationButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: getScaledSize(10),
  },
  locationButton: {
    flex: 1,
    padding: getScaledSize(15),
    backgroundColor: theme.COLORS.lightBlue1,
    borderRadius: getScaledSize(10),
    alignItems: 'center',
  },
  locationButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: getScaledSize(16),
  },
});
