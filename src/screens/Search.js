import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  useBestsellerProducts,
  useExclusiveProducts,
  useHomeCategories,
  useNewProducts,
  useTextSearch,
} from '../../queries/products';
import { components } from '../components';
import { theme } from '../constants';
import SearchList from './SearchList';

const Search = () => {
  const navigation = useNavigation();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { data: categories } = useHomeCategories();
  const { data: newArrival, isLoadingNewArrival } = useNewProducts();
  const { data: bestSellers, isLoadingBestSellers } = useBestsellerProducts();
  const { data: trending, isLoadingTrending } = useExclusiveProducts();
  const { data: allProducts, isLoadingAllProducts } = useTextSearch({ pageSize: 4 });

  const API_URL =
    Platform.OS === 'android' ? process.env.APP_API_BASE_URL_ANDROID : process.env.APP_API_BASE_URL;

  const renderHeader = () => (
    <components.Header
      burgerMenu={true}
      bag={true}
      search={true}
      onSearchPress={() => setIsSearchVisible(true)}
      containerStyle={{
        borderBottomWidth: 1,
        borderBottomColor: theme.COLORS.lightBlue1,
      }}
    />
  );

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
      <View style={{ padding: 10, flexDirection: 'row', flexWrap: 'wrap' }}>
        {categories?.data?.map((item) => (
          <TouchableOpacity
            key={item?._id?.toString()}
            style={{
              width: '33.33%',
              padding: 5,
            }}
          >
            <View
              style={{
                backgroundColor: theme.COLORS.white,
                height: 70,
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: theme.COLORS.lightBlue2,
                borderWidth: 1,
                borderRadius: 12,
                padding: 2,
              }}
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
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderProductSection = (title, data, isLoading, searchType, horizontal = true) => (
    <View className="px-5 flex flex-col gap-5 py-6">
      <components.ProductCategory
        title={title}
        containerStyle={{ marginHorizontal: 20 }}
        onPress={() => navigation.navigate('CategoryShop', { title, searchType })}
      />
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data?.data?.products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <components.ProductItem width={horizontal ? 220 : undefined} item={item} />
          )}
          horizontal={horizontal}
          showsHorizontalScrollIndicator={false}
          numColumns={horizontal ? undefined : 2}
          scrollEnabled={horizontal}
          contentContainerStyle={{ padding: 10 }}
        />
      )}
    </View>
  );

  const ListHeaderComponent = () => (
    <>
      {renderHeader()}
      {renderCategories()}
      {renderProductSection('All Products', allProducts, isLoadingAllProducts, 'text', false)}
    </>
  );

  const ListFooterComponent = () => (
    <>
      {renderProductSection('Best Sellers', bestSellers, isLoadingBestSellers, 'bestsellers')}
      {renderProductSection('New Arrivals', newArrival, isLoadingNewArrival, 'new')}
      {renderProductSection('Exclusive Products', trending, isLoadingTrending, 'exclusive')}
    </>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={[]} // Empty data array since we're using header/footer for content
        renderItem={null}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />

      <SearchList isVisible={isSearchVisible} onClose={() => setIsSearchVisible(false)} />
    </View>
  );
};

export default Search;
