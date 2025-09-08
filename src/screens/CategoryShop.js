import { MaterialIcons } from '@expo/vector-icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useRoute } from '@react-navigation/native';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useDispatch } from 'react-redux';
import { fetchCategories, products as productsQuery } from '../../queries/products/products';
import { components } from '../components';
import { theme } from '../constants';
import { setLoading } from '../store/cartSlice';
import { svg } from '../svg';

const sortOptions = [
  { id: 'nameAsc', label: 'Name (A-Z)', icon: 'arrow-up', type: 'name' },
  { id: 'nameDesc', label: 'Name (Z-A)', icon: 'arrow-down', type: 'name' },
  { id: 'priceLow', label: 'Price (Low to High)', icon: 'arrow-up', type: 'price' },
  { id: 'priceHigh', label: 'Price (High to Low)', icon: 'arrow-down', type: 'price' },
];

const getSort = (string) => {
  switch (string) {
    case 'nameAsc':
      return { name: 'asc' };
    case 'nameDesc':
      return { name: 'desc' };
    case 'priceLow':
      return { price: 'asc' };
    case 'priceHigh':
      return { price: 'desc' };
    default:
      return {};
  }
};

const CategoryShop = () => {
  const route = useRoute();
  const { title, id, subCategories, searchType, type } = route.params || {};

  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 80000]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryItems, setCategoryItems] = useState([]);
  const [subCategoryItems, setSubCategoryItems] = useState([]);
  const [isSubCategoryDropdownOpen, setIsSubCategoryDropdownOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [sortIds, setSortIds] = useState([]);

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['products', 'categories'],
    queryFn: async () => await fetchCategories().queryFn(),
    enabled: searchType === 'category',
  });

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const handleCancel = () => {
    setSearchQuery('');
  };

  useEffect(() => {
    if (categories?.data) {
      setCategoryItems(
        categories.data.map((cat) => ({
          label: cat.name,
          value: cat._id,
          subcategories: cat.subcategories,
        })),
      );
    }
  }, [categories]);

  useEffect(() => {
    if (selectedCategory) {
      const category = categoryItems.find((cat) => cat.value === selectedCategory);
      if (category?.subcategories) {
        setSubCategoryItems(
          category.subcategories.map((subCat) => ({
            label: subCat.name.split(',')[0],
            value: subCat._id,
          })),
        );
      }
    } else if (subCategories) {
      setSubCategoryItems(
        subCategories.map((subCat) => ({
          label: subCat.name.split(',')[0],
          value: subCat._id,
        })),
      );
    }
  }, [selectedCategory, subCategories]);

  const { data, isLoading, fetchNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
    queryKey: ['products', 'category', searchType],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await productsQuery({
        filters: {
          ...(searchType === 'category'
            ? selectedCategory && { category: selectedCategory }
            : id && type !== 'source' && { category: id }),
          ...(searchType === 'category'
            ? selectedSubCategory && { subCategory: selectedSubCategory }
            : selectedSubCategory && type !== 'source' && { subCategory: selectedSubCategory }),
          ...(searchType === 'exclusive' && { isFeatured: true }),
          ...(selectedPriceRange && {
            minPrice: selectedPriceRange[0],
            maxPrice: selectedPriceRange[1],
          }),
          ...(type === 'source' && { source: title }),
        },
        sort: {
          ...(sortIds.length > 0 &&
            sortIds.map((id) => getSort(id)).reduce((acc, sort) => ({ ...acc, ...sort }))),
        },
        page: pageParam,
        ...(searchQuery.length > 0 && { query: searchQuery }),
        searchType: searchType === 'category' ? 'text' : searchType || 'text',
      }).queryFn();
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined;
    },
    refetchOnWindowFocus: false,
    initialPageParam: 1,
  });

  useEffect(() => {
    dispatch(setLoading(isLoading || categoriesLoading));
  }, [isLoading, categoriesLoading]);

  const initialProducts =
    data?.pages.flatMap((page) =>
      (page?.products || []).map((product) => ({
        ...product,
        effectivePrice: product.salePrice > 0 ? product.salePrice : product.regularPrice,
      })),
    ) || [];

  const processedProducts = useMemo(() => {
    if (!initialProducts) return [];
    return initialProducts.map((product) => ({
      ...product,
      effectivePrice: product.salePrice > 0 ? product.salePrice : product.regularPrice,
    }));
  }, [initialProducts]);

  useEffect(() => {
    refetch();
  }, [id, refetch, sortIds, selectedCategory, selectedSubCategory, searchType, searchQuery]);

  const resetFilters = () => {
    setSelectedPriceRange([0, 80000]);
    setSortIds([]);
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setIsPriceFilterOpen(false);
    setIsSortModalOpen(false);
  };

  const handleSortSelection = (optionId) => {
    setSortIds([optionId]);
    setIsSortModalOpen(false);
  };

  const renderHeader = () => <components.Header title={title} goBack={true} bag={true} />;

  const renderFilterAndSort = () => (
    <View
      style={{
        zIndex: 10,
        elevation: 10,
      }}
    >
      {searchType === 'category' && (
        <View
          style={{
            zIndex: 20,
            elevation: 20,
            marginHorizontal: 10,
            marginBottom: 10,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <View
              style={{
                zIndex: 1000,
                elevation: 1000,
                flex: 1,
              }}
            >
              <DropDownPicker
                open={isCategoryDropdownOpen}
                value={selectedCategory}
                items={categoryItems}
                setOpen={setIsCategoryDropdownOpen}
                setValue={setSelectedCategory}
                setItems={setCategoryItems}
                placeholder="Select Category"
                style={{
                  borderColor: theme.COLORS.lightGray1,
                }}
                containerStyle={{
                  zIndex: 20,
                  elevation: 20,
                }}
                dropDownContainerStyle={{
                  borderColor: theme.COLORS.lightGray1,
                  zIndex: 20,
                  elevation: 20,
                }}
              />
            </View>

            {selectedCategory && (
              <TouchableOpacity
                onPress={() => {
                  setIsCategoryDropdownOpen(false);
                  setSelectedCategory(null);
                  setSelectedSubCategory(null);
                }}
                style={{
                  padding: 5,
                }}
              >
                <MaterialIcons name="clear" size={24} color="gray" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {((searchType === 'category' && selectedCategory) || subCategories?.length > 0) && (
        <View
          style={{
            zIndex: 20,
            elevation: 20,
            marginHorizontal: 10,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <View
              style={{
                zIndex: 1000,
                elevation: 1000,
                flex: 1,
              }}
            >
              <DropDownPicker
                open={isSubCategoryDropdownOpen}
                value={selectedSubCategory}
                items={subCategoryItems}
                setOpen={setIsSubCategoryDropdownOpen}
                setValue={setSelectedSubCategory}
                setItems={setSubCategoryItems}
                placeholder="Select Subcategory"
                style={{
                  borderColor: theme.COLORS.lightGray1,
                }}
                containerStyle={{
                  zIndex: 20,
                  elevation: 20,
                }}
                dropDownContainerStyle={{
                  borderColor: theme.COLORS.lightGray1,
                  zIndex: 20,
                  elevation: 20,
                }}
              />
            </View>

            {selectedSubCategory && (
              <TouchableOpacity
                onPress={() => {
                  setIsSubCategoryDropdownOpen(false);
                  setSelectedSubCategory(null);
                }}
                style={{
                  padding: 5,
                }}
              >
                <MaterialIcons name="clear" size={24} color="gray" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <View
        style={{
          marginTop: 12,
          marginBottom: 9,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 20,
          zIndex: 10,
          elevation: 10,
        }}
      >
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={() => setIsPriceFilterOpen(true)}
        >
          <svg.SettingsSvg />
          {(selectedPriceRange[0] > 0 || selectedPriceRange[1] < 30000) && (
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: theme.COLORS.primary,
                position: 'absolute',
                top: 0,
                right: 0,
              }}
            />
          )}
        </TouchableOpacity>
        {['text', 'category'].includes(searchType) && (
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => setIsSortModalOpen(true)}
          >
            <svg.SortingSvg />
            {sortIds.length > 0 && (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: theme.COLORS.primary,
                  position: 'absolute',
                  top: 0,
                  right: 0,
                }}
              />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderPrice = () => (
    <View style={{ marginBottom: 5 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            ...theme.FONTS.H6,
            color: theme.COLORS.black,
          }}
        >
          Price Range: Rs.{selectedPriceRange[0]} - Rs.{selectedPriceRange[1]}
        </Text>
      </View>

      <MultiSlider
        values={selectedPriceRange}
        min={0}
        max={80000}
        step={100}
        sliderLength={theme.SIZES.width - 40}
        onValuesChange={(values) => {
          setSelectedPriceRange(values);
        }}
        selectedStyle={{
          backgroundColor: theme.COLORS.black,
        }}
        unselectedStyle={{
          backgroundColor: '#DBE3F5',
        }}
        containerStyle={{
          height: 20,
        }}
        trackStyle={{
          height: 3,
        }}
        markerStyle={{
          height: 15,
          width: 15,
          borderRadius: 15 / 2,
          backgroundColor: theme.COLORS.black,
        }}
      />

      <View style={{ marginTop: 40 }}>
        <components.Button
          title="Apply Filters"
          onPress={() => {
            setIsPriceFilterOpen(false);
            refetch();
          }}
        />
      </View>
    </View>
  );

  const renderProducts = () => (
    <FlatList
      data={processedProducts}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => {
        return <components.ProductItem item={item} />;
      }}
      numColumns={2}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      removeClippedSubviews={true}
      contentContainerStyle={[styles.productListContainer]}
      onEndReached={() => !isFetchingNextPage && fetchNextPage()}
      ListEmptyComponent={
        <Text style={{}}>No products found within the selected price range.</Text>
      }
    />
  );

  const renderSearch = () => {
    return (
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        {renderHeader()}
        {renderSearch()}
        {renderFilterAndSort()}
        {processedProducts.length === 0 ? (
          <Text style={styles.loadingText}>Loading products...</Text>
        ) : (
          renderProducts()
        )}
      </View>

      <Modal
        visible={isPriceFilterOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsPriceFilterOpen(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <View
            style={{
              backgroundColor: theme.COLORS.white,
              padding: 20,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
            <View className="flex flex-row justify-between">
              <Text style={{ ...theme.FONTS.H5 }} className="mb-4">
                Filter by Price
              </Text>
              <TouchableOpacity onPress={resetFilters}>
                <Text>Reset</Text>
              </TouchableOpacity>
            </View>
            {renderPrice()}
          </View>
        </View>
      </Modal>

      <Modal
        visible={isSortModalOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsSortModalOpen(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <View
            style={{
              backgroundColor: theme.COLORS.white,
              padding: 20,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
            <View className="flex flex-row justify-between">
              <Text className="mb-3" style={{ ...theme.FONTS.H4 }}>
                Sort by
              </Text>
              <TouchableOpacity onPress={resetFilters}>
                <Text>Reset</Text>
              </TouchableOpacity>
            </View>

            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleSortSelection(option.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                }}
              >
                <Text style={{ ...theme.FONTS.H5, flex: 1 }}>{option.label}</Text>
                {sortIds.includes(option.id) && <svg.CheckSvg />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CategoryShop;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  innerContainer: {
    flex: 1,
  },
  productListContainer: {
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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
});
