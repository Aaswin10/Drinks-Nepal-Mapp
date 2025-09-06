import { Platform } from 'react-native';
import axios from '../../src/middlewares/axiosConfig';
import { fetchGet } from '../helpers/utils';

const productSearchUrl =
  Platform.OS === 'android'
    ? `${process.env.APP_API_URL_ANDROID}/products/search`
    : `${process.env.APP_API_URL}/products/search`;

const categoriesUrl =
  Platform.OS === 'android'
    ? `${process.env.APP_API_URL_ANDROID}/products/categories`
    : `${process.env.APP_API_URL}/products/categories`;

const homeCategoriesUrl =
  Platform.OS === 'android'
    ? `${process.env.APP_API_URL_ANDROID}/products/home-categories`
    : `${process.env.APP_API_URL}/products/home-categories`;

const bannerImageUrl =
  Platform.OS === 'android'
    ? `${process.env.APP_API_URL_ANDROID}/config/banners`
    : `${process.env.APP_API_URL}/config/banners`;

const defaultParams = {
  page: 1,
  pageSize: 10,
};

export const fetchProducts = async (params) => {
  const { data } = await axios.post(productSearchUrl, params);
  return data;
};

export const products = (options = {}) => ({
  queryFn: async () => {
    const { searchType, userId, page, pageSize, query, filters, sort } = options;

    const params = {
      ...defaultParams,
      searchType,
      page,
      pageSize,
      ...(filters && { filters }),
      ...(sort && { sort }),
      ...(userId && { userId }),
      ...(query && { query }),
    };
    return fetchProducts(params);
  },
});

export const fetchCategories = () => ({
  queryFn: async () => {
    return fetchGet(categoriesUrl);
  },
});

export const fetchHomeCategories = () => ({
  queryFn: async () => {
    return fetchGet(homeCategoriesUrl);
  },
});

export const fetchBannerImageUrl = () => ({
  queryFn: async () => {
    try {
      const response = await fetchGet(bannerImageUrl);
      // Return empty array if no banners found
      return response?.data?.banners || [];
    } catch (error) {
      console.error('Error fetching banners:', error);
      return [];
    }
  },
});
