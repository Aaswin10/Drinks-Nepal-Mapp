import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  Dimensions,
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
import { components } from '../components';
import { theme } from '../constants';
import { setLoading } from '../store/cartSlice';
import { loadUserLocationFromStorage, setUserLocationWithStorage } from '../store/userSlice';
import SearchList from './SearchList';

const HomeOne = () => {
  const navigation = useNavigation();
  const { data: categories } = useHomeCategories();

  const { data: banners = [], isLoading: isLoadingBanners } = useBannerImageUrl();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [bannerLoading, setBannerLoading] = useState(true);
  const flatListRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  
  // Check if user is new or has not selected location
  const isNewUser = useSelector((state) => !state?.user?.user?.location);

  const fullName = useSelector((state) => state?.user?.user?.fullName);
  const phoneNumber = useSelector((state) => state?.user?.user?.phoneNumber);
  const dispatch = useDispatch();
  const API_URL =
    Platform.OS === 'android' ? process.env.APP_API_BASE_URL_ANDROID : process.env.APP_API_BASE_URL;


  const currentLocation = useSelector((state) => state?.user?.user?.location);

  useEffect(() => {
    dispatch(loadUserLocationFromStorage());
  }, [dispatch]);

  useEffect(() => {
    // Show location modal only for new users
    if (isNewUser) {
      setIsLocationModalVisible(true);
    }
  }, [isNewUser]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleLocationSelect = (location) => {
    // Dispatch location to both user slice and storage
    dispatch(setUserLocationWithStorage(location));
    
    // Close location modal
    setIsLocationModalVisible(false);
    
    // Optional: You might want to show a welcome message or perform additional actions
    Alert.alert(
      'Welcome!', 
      `Your location is set to ${location}`, 
      [{ text: 'OK' }]
    );
  };

  const renderHeader = () => (
    <components.Header
      logo={true}
      search={true}
      onSearchPress={() => setIsSearchVisible(true)}
      name={fullName}
      address={phoneNumber}
      setIsLocationModalVisible={setIsLocationModalVisible}
      currentLocation={currentLocation}
    />
  );

  const { data: searchResults, isLoading } = useTrendingProducts({ pageSize: 4 });

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading]);

  // Auto-scroll banners
  useEffect(() => {
    if (banners.length <= 1) return;
    
    const interval = setInterval(() => {
      const nextIndex = (currentBannerIndex + 1) % banners.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentBannerIndex(nextIndex);
    }, 5000); // Change banner every 5 seconds
    
    return () => clearInterval(interval);
  }, [currentBannerIndex, banners.length]);

  const renderBannerItem = ({ item }) => {
    if (!item?.url) return null;
    
    // Construct full URL using environment variables
    let imageUrl = item.url;
    if (!imageUrl.startsWith('http')) {
      const baseUrl = Platform.OS === 'android' 
        ? process.env.APP_API_BASE_URL_ANDROID 
        : process.env.APP_API_BASE_URL;
      imageUrl = `${baseUrl}${imageUrl}`;
    }
    
    return (
      <TouchableOpacity activeOpacity={0.9} style={styles.bannerTouchable}>
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.bannerImage}
            resizeMode="cover"
            onLoadStart={() => setBannerLoading(true)}
            onLoadEnd={() => setBannerLoading(false)}
          />
          {bannerLoading && (
            <ActivityIndicator
              size="small"
              color={theme.COLORS.primary}
              style={styles.loader}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderBanner = () => {
    if (isLoadingBanners) {
      return (
        <View style={[styles.bannerContainer, styles.loadingContainer]}>
          <ActivityIndicator size="large" color={theme.COLORS.primary} />
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
        <FlatList
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
  };

  const renderCategories = () => (
    <View style={{ paddingVertical: 20, backgroundColor: theme.COLORS.white }} className="mb-3">
      <components.ProductCategory
        title="C A T E G O R I E S"
        containerStyle={{ marginHorizontal: 20 }}
        onPress={() =>
          navigation.navigate('CategoryShop', {
            title: 'Categories',
            searchType: 'category',
          })
        }
      />
      <FlatList
        data={categories?.data}
        keyExtractor={(item) => item?._id?.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              flex: 1,
              margin: 5,
              padding: 2,
              backgroundColor: theme.COLORS.white,
              height: 70,
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
              borderColor: theme.COLORS.lightBlue2,
              borderWidth: 1,
              borderRadius: 12,
            }}
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
            <Image
              source={{ uri: `${API_URL}${item?.imageUrl}` }}
              style={{
                width: 30,
                height: 30,
                resizeMode: 'contain',
                marginBottom: 8,
              }}
            />
            <Text style={{ fontSize: 11, textAlign: 'center', color: theme.COLORS.black }}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        numColumns={3}
        scrollEnabled={false}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );

  const renderSpecials = () => (
    <View style={{ paddingVertical: 20, backgroundColor: theme.COLORS.white }} className="mb-3">
      <components.ProductCategory
        title="Drinks Nepal Special"
        containerStyle={{ marginHorizontal: 20 }}
        onPress={() =>
          navigation.navigate('CategoryShop', {
            title: 'Specials',
            searchType: 'trending',
          })
        }
      />
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={searchResults?.data?.products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <components.ProductItem item={item} />}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={{ padding: 10 }}
        />
      )}
    </View>
  );

  const renderLocationModal = () => {
    // Only render if it's a new user and location is not set
    if (!isNewUser) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isLocationModalVisible}
        onRequestClose={() => {
          // Prevent closing without selecting a location for new users
          Alert.alert(
            'Location Required', 
            'Please select a location to continue', 
            [{ text: 'OK' }]
          );
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Welcome to Drinks Nepal!</Text>
            <Text style={styles.modalSubtitle}>Select Your Location to Get Started</Text>

            <View style={styles.locationButtonContainer}>
              <Pressable
                style={[styles.locationButton]}
                onPress={() => handleLocationSelect('Kathmandu')}
              >
                <Text style={styles.locationButtonText}>Kathmandu</Text>
              </Pressable>

              <Pressable
                style={[styles.locationButton]}
                onPress={() => handleLocationSelect('Pokhara')}
              >
                <Text style={styles.locationButtonText}>Pokhara</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderListItem = ({ item }) => {
    switch (item.type) {
      case 'banner':
        return renderBanner();
      case 'categories':
        return renderCategories();
      case 'specials':
        return renderSpecials();
      default:
        return null;
    }
  };

  const data = [
    { id: 'banner', type: 'banner' },
    { id: 'categories', type: 'categories' },
    { id: 'specials', type: 'specials' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.COLORS.lightGray1 }}>
      {renderHeader()}
      {renderLocationModal()}
      <FlatList
        data={data}
        renderItem={renderListItem}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      <SearchList isVisible={isSearchVisible} onClose={() => setIsSearchVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  bannerWrapper: {
    height: 200,
    marginBottom: 10,
    position: 'relative',
  },
  bannerContainer: {
    width: Dimensions.get('window').width - 20,
    height: 200,
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: theme.COLORS.lightGray,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -10,
    marginTop: -10,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: theme.COLORS.white,
    width: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  locationButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  locationButton: {
    flex: 1,
    padding: 15,
    margin: 10,
    backgroundColor: theme.COLORS.lightBlue1,
    borderRadius: 10,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: theme.COLORS.lightBlue2,
  },
  locationButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeOne;
