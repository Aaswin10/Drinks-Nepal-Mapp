import { createQueryAndHook } from '../helpers/createQueryAndHook';
import { fetchBannerImageUrl, fetchCategories, fetchHomeCategories, products } from './products';

export const { hook: useTextSearch } = createQueryAndHook({
  queryKey: ['products', 'text'],
  query: (options) => products({ ...options, searchType: 'text' }),
});

export const { hook: useTrendingProducts } = createQueryAndHook({
  queryKey: ['products', 'trending'],
  query: (options) => products({ ...options, searchType: 'trending' }),
});

export const { hook: useExclusiveProducts } = createQueryAndHook({
  queryKey: ['products', 'exclusive'],
  query: (options) =>
    products({
      ...options,
      searchType: 'text',
      filters: { ...options?.filters, isFeatured: true },
    }),
});

export const { hook: useBestsellerProducts } = createQueryAndHook({
  queryKey: ['products', 'bestsellers'],
  query: (options) => products({ ...options, searchType: 'bestsellers' }),
});

export const { hook: useNewProducts } = createQueryAndHook({
  queryKey: ['products', 'new'],
  query: (options) => products({ ...options, searchType: 'new' }),
});

export const { hook: useRecommendedProducts } = createQueryAndHook({
  queryKey: ['products', 'recommended'],
  query: (options) => products({ ...options, searchType: 'recommended' }),
});

export const { hook: useCategories } = createQueryAndHook({
  queryKey: ['products', 'categories'],
  query: fetchCategories,
});

export const { hook: useHomeCategories } = createQueryAndHook({
  queryKey: ['products', 'home-categories'],
  query: fetchHomeCategories,
});

export const { hook: useBannerImageUrl } = createQueryAndHook({
  queryKey: ['products', 'banner-image-url'],
  query: fetchBannerImageUrl,
});
