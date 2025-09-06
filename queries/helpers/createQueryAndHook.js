import { useQuery } from '@tanstack/react-query';

export const createQueryAndHook = ({ queryKey, query }) => {
  return {
    query: (options = {}) => ({
      queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
      ...query(options),
    }),
    hook: (options = {}) => {
      const finalQuery = query(options);
      return useQuery({
        queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
        ...finalQuery,
        ...options,
      });
    },
  };
};
