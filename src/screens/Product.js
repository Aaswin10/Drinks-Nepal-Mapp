import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../store/cartSlice';
import { useResponsiveDimensions } from '../hooks/useResponsiveDimensions';
import { selectCartItemCount } from '../store/selectors';

import { useRecommendedProducts } from '../../queries/products';
import { components } from '../components';
import { theme } from '../constants';
import { svg } from '../svg';

const Product = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { product } = route.params;
  const { getScaledSize } = useResponsiveDimensions();

  const userId = useSelector((state) => state.user?.user?._id);
  const dispatch = useDispatch();
  const { data: recommendedProducts, isLoading } = useRecommendedProducts({
    userId,
    page: 1,
    pageSize: 4,
  });

  const [selectedVolume, setSelectedVolume] = useState(
    product?.details?.volume?.find((v) => v.isDefault)?.volume || '',
  );

  const productList = useSelector((state) => state.cart.list);
  const styles = React.useMemo(() => createStyles(getScaledSize), [getScaledSize]);

  const itemQuantity = () => {
    const cartItem = productList.find((i) => i._id === product._id);
    if (!cartItem) return 0;
    const volumeItem = cartItem.volume.find((v) => v.volume === selectedVolume);
    return volumeItem ? volumeItem.quantity : 0;
  };

  const getCurrentPrice = () => {
    const volumeDetails = product?.details?.volume?.find((v) => v.volume === selectedVolume);
    return volumeDetails?.salePrice !== 0 ? volumeDetails?.salePrice : volumeDetails?.regularPrice;
  };

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const updateCurrentSlideIndex = (e) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / styles.carouselWidth);
    setCurrentSlideIndex(currentIndex);
  };

  const renderHeader = () => {
    return <components.ResponsiveHeader goBack={true} cart={true} displayScreenName={true} />;
  };

  const renderRecommened = () => (
    <View style={styles.recommendedSection}>
      <components.ProductCategory 
        title="Recommended" 
        containerStyle={styles.sectionHeader} 
      />
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.COLORS.lightBlue1} />
        </View>
      ) : (
        <components.OptimizedProductList
          data={recommendedProducts?.data?.products}
          numColumns={2}
        />
      )}
    </View>
  );

  const renderCarousel = () => {
    return (
      <View style={styles.carouselContainer}>
        <ScrollView
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={updateCurrentSlideIndex}
        >
          {Array.isArray(product.images) ? (
            product.images.map((item, index) => {
              return (
                <components.OptimizedImage
                  item={{ ...product, images: [item] }}
                  uri={item}
                  key={index}
                  containerStyle={styles.carouselItem}
                  resizeMode="contain"
                />
              );
            })
          ) : (
            <components.OptimizedImage
              uri={product.images}
              containerStyle={styles.carouselItem}
              resizeMode="contain"
            />
          )}
        </ScrollView>
        <View style={styles.pagination}>
          {Array.isArray(product.images) &&
            product.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  currentSlideIndex === index && styles.paginationDotActive,
                ]}
              />
            ))}
        </View>
      </View>
    );
  };

  const renderProductInfo = () => {
    return (
      <View style={{ backgroundColor: theme.COLORS.white }} className="mt-3 py-5">
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ ...theme.FONTS.H3 }} className="mb-2">
            {product.name}
          </Text>
          <Text
            style={{
              ...theme.FONTS.Mulish_400Regular,
              color: theme.COLORS.lig,
              fontSize: 16,
            }}
            className="mb-2"
          >
            Brand:{' '}
            <Text
              style={{
                ...theme.FONTS.Mulish_400Regular,
                color: theme.COLORS.black,
                fontSize: 16,
              }}
            >
              {product.brand}
            </Text>
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }} className="mb-3">
            <View className="w-1/2">
              <Text
                style={{
                  ...theme.FONTS.Mulish_400Regular,
                  color: theme.COLORS.lightGray,
                  fontSize: 16,
                }}
              >
                Volume:
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
                {product?.details?.volume?.map((v, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedVolume(v.volume)}
                    style={{
                      width: 60,
                      height: 40,
                      borderWidth: 1,
                      borderColor: theme.COLORS.lightBlue1,
                      backgroundColor:
                        selectedVolume === v.volume ? theme.COLORS.lightBlue1 : 'white',
                      marginBottom: 8,
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 3,
                    }}
                  >
                    <Text
                      style={{
                        ...theme.FONTS.Mulish_400Regular,
                        color: selectedVolume === v.volume ? 'white' : theme.COLORS.black,
                        fontSize: 14,
                      }}
                    >
                      {v.volume}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View className="w-1/2">
              <Text
                style={{
                  ...theme.FONTS.Mulish_400Regular,
                  color: theme.COLORS.lightGray,
                  fontSize: 16,
                  textAlign: 'left',
                }}
              >
                Alcohol: {''}
                <Text
                  style={{
                    ...theme.FONTS.Mulish_400Regular,
                    color: theme.COLORS.black,
                    fontSize: 16,
                  }}
                >
                  {product.details?.abv}
                </Text>
              </Text>
            </View>
          </View>
          <Text
            style={{
              ...theme.FONTS.Mulish_400Regular,
              color: theme.COLORS.lightGray,
              fontSize: 16,
              textAlign: 'left',
            }}
            className="mb-3"
          >
            Tags: {''}
            <Text
              style={{
                ...theme.FONTS.Mulish_400Regular,
                color: theme.COLORS.lightBlue1,
                fontSize: 16,
              }}
            >
              {product?.tags
                .split(',')
                ?.map((tag) => `#${tag}`)
                .join(' ')}
            </Text>
          </Text>
          <Text className="text-gray-500 mb-3">
            Country Origin:{' '}
            <Text style={{ color: theme.COLORS.lightBlue1 }}>{product?.details?.country}</Text>
          </Text>
          {product?.brand && (
            <TouchableOpacity
              onPress={() => navigation.navigate('BrandProducts', { brand: product.brand })}
              className="mb-3"
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={{
                    ...theme.FONTS.Mulish_400Regular,
                    color: theme.COLORS.lightBlue1,
                    fontSize: 16,
                    textAlign: 'left',
                  }}
                >
                  See All {product.brand} Products
                </Text>
                <svg.ArrowRightSvg />
              </View>
            </TouchableOpacity>
          )}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{
                ...theme.FONTS.Mulish_600SemiBold,
                fontSize: 20,
                color: theme.COLORS.black,
                lineHeight: 20 * 1.5,
              }}
            >
              Rs. {getCurrentPrice()}
            </Text>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                borderRadius: 50,
                borderWidth: 1,
                borderColor: theme.COLORS.lightBlue1,
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  dispatch(
                    removeFromCart({
                      ...product,
                      selectedVolume,
                      price: getCurrentPrice(),
                    }),
                  )
                }
                style={{
                  width: 30,
                  height: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 25,
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
                {itemQuantity()}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  dispatch(
                    addToCart({
                      ...product,
                      selectedVolume,
                      price: getCurrentPrice(),
                    }),
                  )
                }
                style={{
                  width: 30,
                  height: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 25,
                  paddingVertical: 22,
                }}
              >
                <svg.PlusSvg />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: theme.COLORS.lightGray2,
              marginVertical: 20,
            }}
          />
          <Text
            style={{
              ...theme.FONTS.H4,
              color: theme.COLORS.black,
              marginBottom: 14,
            }}
          >
            Description
          </Text>
          <Text
            style={{
              ...theme.FONTS.Mulish_400Regular,
              fontSize: 16,
              lineHeight: 16 * 1.7,
              color: theme.COLORS.lightGray,
              marginBottom: 20,
            }}
          >
            {product.description}
          </Text>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderCarousel()}
        {renderProductInfo()}
        {renderRecommened()}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
};

const createStyles = (getScaledSize) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.lightGray1,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: theme.COLORS.lightGray1,
  },
  carouselContainer: {
    backgroundColor: theme.COLORS.white,
    paddingBottom: getScaledSize(12),
  },
  carouselItem: {
    width: theme.SIZES.width,
    height: getScaledSize(350),
    backgroundColor: theme.COLORS.white,
  },
  carouselWidth: theme.SIZES.width,
  pagination: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: getScaledSize(20),
  },
  paginationDot: {
    width: getScaledSize(8),
    height: getScaledSize(8),
    marginHorizontal: getScaledSize(5),
    borderRadius: getScaledSize(4),
    borderWidth: 2,
    borderColor: theme.COLORS.lightBlue1,
    backgroundColor: theme.COLORS.lightBlue1,
  },
  paginationDotActive: {
    width: getScaledSize(15),
    backgroundColor: theme.COLORS.white,
  },
  recommendedSection: {
    paddingVertical: getScaledSize(20),
    backgroundColor: theme.COLORS.white,
    marginVertical: getScaledSize(12),
  },
  sectionHeader: {
    marginHorizontal: getScaledSize(20),
  },
  loadingContainer: {
    padding: getScaledSize(20),
    alignItems: 'center',
  },
});

export default Product;
