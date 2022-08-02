import { QueryClient } from 'react-query';
import { QueryKeys } from 'src/react-query/queryKeys';
import useReactQueryStateByKey from 'src/react-query/state';

export default function useNft(
  queryClient: QueryClient,
  nftIdentifier: string,
) {
  const { state } = useReactQueryStateByKey(queryClient, QueryKeys.ALL_NFTS);

  const searchedNft = state.find((nft) => nft.identifier === nftIdentifier);

  return {
    searchedNft,
  };
}
