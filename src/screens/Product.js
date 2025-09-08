import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../store/cartSlice';

import { useRecommendedProducts } from '../../queries/products';
import { components } from '../components';
import { theme } from '../constants';
import { svg } from '../svg';

const Product = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { product } = route.params;

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
    const currentIndex = Math.round(contentOffsetX / theme.SIZES.width);
    setCurrentSlideIndex(currentIndex);
  };

  const renderHeader = () => {
    return <components.Header goBack={true} bag={true} displayScreenName={true} cart={true} />;
  };

  const renderRecommened = () => (
    <View style={{ paddingVertical: 20, backgroundColor: theme.COLORS.white }} className="my-3">
      <components.ProductCategory title="Recommended" containerStyle={{ marginHorizontal: 20 }} />
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={recommendedProducts?.data?.products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <components.ProductItem item={item} />}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={{ padding: 10 }}
        />
      )}
    </View>
  );

  const renderCarousel = () => {
    return (
      <View style={{ backgroundColor: theme.COLORS.white }} className="pb-3">
        <ScrollView
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={updateCurrentSlideIndex}
        >
          {Array.isArray(product.images) ? (
            product.images.map((item, index) => {
              return (
                <components.ImageItem
                  item={{ ...product, images: [item] }}
                  key={index}
                  containerStyle={{
                    width: theme.SIZES.width,
                    height: 350,
                    backgroundColor: theme.COLORS.white,
                  }}
                  resizeMode="contain"
                />
              );
            })
          ) : (
            <components.ImageItem
              item={product.images}
              containerStyle={{
                width: theme.SIZES.width,
                height: 350,
                backgroundColor: theme.COLORS.white,
              }}
              resizeMode="contain"
            />
          )}
        </ScrollView>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}
        >
          {Array.isArray(product.images) &&
            product.images.map((_, index) => (
              <View
                key={index}
                style={{
                  width: currentSlideIndex === index ? 15 : 8,
                  height: 8,
                  marginHorizontal: 5,
                  borderRadius: 50,
                  borderWidth: 2,
                  borderColor: theme.COLORS.lightBlue1,
                  marginTop: 20,
                  backgroundColor:
                    currentSlideIndex === index ? theme.COLORS.white : theme.COLORS.lightBlue1,
                }}
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
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: theme.COLORS.lightGray1,
        }}
        showsVerticalScrollIndicator={false}
      >
        {renderCarousel()}
        {renderProductInfo()}
        {renderRecommened()}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.lightGray1 }}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
};

export default Product;
