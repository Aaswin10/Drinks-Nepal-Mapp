import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { components } from '../components';
import { theme } from '../constants';
import { svg } from '../svg';

const Shop = () => {
  const route = useRoute();
  const { title, products: initialProducts } = route.params || {};

  const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 80000]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentSort, setCurrentSort] = useState(null);

  const sortOptions = [
    { id: 'nameAsc', label: 'Name (A-Z)', icon: 'arrow-up' },
    { id: 'nameDesc', label: 'Name (Z-A)', icon: 'arrow-down' },
    { id: 'priceLow', label: 'Price (Low to High)', icon: 'arrow-up' },
    { id: 'priceHigh', label: 'Price (High to Low)', icon: 'arrow-down' },
  ];

  useEffect(() => {
    if (
      initialProducts &&
      initialProducts.data?.products &&
      initialProducts.data?.products.length > 0
    ) {
      console.log('Initial products received:', initialProducts);
      const processedProducts = initialProducts.data.products.map((product) => ({
        ...product,
        effectivePrice: product.salePrice > 0 ? product.salePrice : product.regularPrice,
      }));
      console.log('Processed products:', processedProducts);
      setProducts(processedProducts);
      setFilteredProducts(processedProducts);
    }
  }, [initialProducts]);

  const applySort = (sortId) => {
    console.log('Applying sort:', sortId);
    console.log('Current filtered products:', filteredProducts);

    let sortedProducts = [...filteredProducts];

    try {
      switch (sortId) {
        case 'nameAsc':
          sortedProducts.sort((a, b) => {
            if (!a.name || !b.name) {
              console.log('Missing name in product:', { a, b });
              return 0;
            }
            return a.name.toString().localeCompare(b.name.toString());
          });
          break;
        case 'nameDesc':
          sortedProducts.sort((a, b) => {
            if (!a.name || !b.name) {
              console.log('Missing name in product:', { a, b });
              return 0;
            }
            return b.name.toString().localeCompare(a.name.toString());
          });
          break;
        case 'priceLow':
          sortedProducts.sort((a, b) => {
            const priceA = Number(a.effectivePrice) || 0;
            const priceB = Number(b.effectivePrice) || 0;
            return priceA - priceB;
          });
          break;
        case 'priceHigh':
          sortedProducts.sort((a, b) => {
            const priceA = Number(a.effectivePrice) || 0;
            const priceB = Number(b.effectivePrice) || 0;
            return priceB - priceA;
          });
          break;
        default:
          break;
      }

      console.log('Sorted products:', sortedProducts);

      const [minPrice, maxPrice] = selectedPriceRange;
      sortedProducts = sortedProducts.filter((product) => {
        const productPrice = Number(product.effectivePrice) || 0;
        return productPrice >= minPrice && productPrice <= maxPrice;
      });

      console.log('Filtered products after sorting and price filter:', sortedProducts);

      setFilteredProducts(sortedProducts);
      setCurrentSort(sortId);
      setIsSortModalOpen(false);
    } catch (error) {
      console.error('Error during sorting:', error);
    }
  };

  const applyPriceFilter = () => {
    const [minPrice, maxPrice] = selectedPriceRange;
    console.log('Applying price filter:', { minPrice, maxPrice });

    const updatedProducts = products.filter((product) => {
      const productPrice = Number(product.effectivePrice) || 0;
      return productPrice >= minPrice && productPrice <= maxPrice;
    });

    console.log('Filtered products:', updatedProducts);
    setFilteredProducts(updatedProducts);

    if (currentSort) {
      console.log('Reapplying current sort:', currentSort);
      applySort(currentSort);
    }

    setIsPriceFilterOpen(false);
  };

  const resetFilters = () => {
    console.log('Resetting all filters and sorts');
    setSelectedPriceRange([0, 80000]);
    setCurrentSort(null);
    setFilteredProducts(products);
    setIsPriceFilterOpen(false);
    setIsSortModalOpen(false);
  };

  const renderHeader = () => <components.Header title={title} goBack={true} bag={true} />;

  const renderFilterAndSort = () => (
    <View
      style={{
        marginTop: 12,
        marginBottom: 9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 20,
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
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center' }}
        onPress={() => setIsSortModalOpen(true)}
      >
        <svg.SortingSvg />
        {currentSort && (
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
        max={30000}
        step={100}
        sliderLength={theme.SIZES.width - 40}
        onValuesChange={(values) => {
          console.log('Price range changed:', values);
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
        <components.Button title="Apply Filters" onPress={applyPriceFilter} />
      </View>
    </View>
  );

  const renderProducts = () => (
    <FlatList
      data={filteredProducts}
      keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
      renderItem={({ item }) => {
        console.log('Rendering product:', item.name, item.effectivePrice);
        return <components.ProductItem item={item} />;
      }}
      numColumns={2}
      contentContainerStyle={{ padding: 10 }}
      ListEmptyComponent={
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          No products found within the selected price range.
        </Text>
      }
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.white }}>
      <View style={{ flex: 1 }}>
        {renderHeader()}
        {renderFilterAndSort()}
        {products.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading products...</Text>
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
                onPress={() => applySort(option.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                }}
              >
                <Text style={{ ...theme.FONTS.H5, flex: 1 }}>{option.label}</Text>
                {currentSort === option.id && <svg.CheckSvg />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Shop;
