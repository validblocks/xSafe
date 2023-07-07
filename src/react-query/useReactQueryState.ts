import { QueryClient } from 'react-query';
import { QueryKeys } from './queryKeys';

export default function useReactQueryState(queryClient: QueryClient) {
  const getStateByKey = (stateIdentifier: QueryKeys): unknown[] =>
    queryClient.getQueryData(QueryKeys[stateIdentifier]) ?? [];

  const getItemByKey = (
    stateIdentifier: QueryKeys,
    itemIdentifierKey: string,
    itemIdentifier: string,
  ) =>
    getStateByKey(stateIdentifier).filter(
      (item: any) => item[itemIdentifierKey] === itemIdentifier,
    )[0];

  return {
    getStateByKey,
    getItemByKey,
  };
}
