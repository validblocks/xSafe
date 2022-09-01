import { QueryClient } from 'react-query';
import { QueryKeys } from './queryKeys';

export default function useReactQueryStateByKey(
  queryClient: QueryClient,
  queryKey: QueryKeys,
) {
  return {
    state: queryClient
      .getQueryCache()
      .getAll()
      .filter((cachedValue: any) => cachedValue.queryKey[0] === queryKey)
      .map((cachedValue: any) => cachedValue.state.data)
      .flat(),
  };
}
