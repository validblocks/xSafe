import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import { QueryKeys } from 'src/react-query/queryKeys';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { MultiversxApiProvider } from 'src/services/MultiversxApiNetworkProvider';
import { NFTType } from 'src/types/nfts';

interface IUseContractNftsConfig {
  withSearchFilter?: boolean;
  searchParam: string;
  leaveSftsLast?: boolean;
  groupByCollection?: boolean;
}

export const useMultisigNfts = (
  {
    withSearchFilter,
    searchParam,
    leaveSftsLast,
    groupByCollection,
  }: IUseContractNftsConfig = {
    withSearchFilter: false,
    searchParam: '',
    leaveSftsLast: false,
    groupByCollection: false,
  },
) => {
  const currentContract = useSelector(currentMultisigContractSelector);
  const fetchNFTs = useCallback(
    () =>
      currentContract?.address
        ? MultiversxApiProvider.fetchOrganizationNFTs(currentContract?.address)
        : [],
    [currentContract],
  );

  const {
    data: nftList,
    isFetching: isFetchingNFTs,
    isLoading: isLoadingNFTs,
    isError: isErrorOnFetchNFTs,
  } = useQuery([QueryKeys.ALL_ORGANIZATION_NFTS], () => fetchNFTs(), {
    ...USE_QUERY_DEFAULT_CONFIG,
    staleTime: 60000,
  });

  const contractNfts = useMemo(() => {
    let contractNftsResult = nftList?.sort((first: NFTType, second: NFTType) =>
      first.collection.localeCompare(second.collection),
    );

    if (withSearchFilter) {
      contractNftsResult = contractNftsResult?.filter((nft) => {
        const lowerCaseSearchParam = searchParam.toLowerCase();
        return (
          nft.collection.toLowerCase().includes(lowerCaseSearchParam) ||
          nft.name.toLowerCase().includes(lowerCaseSearchParam) ||
          nft.tags
            ?.map((t) => t.toLowerCase())
            .includes(lowerCaseSearchParam) ||
          nft.ticker?.toLowerCase().includes(lowerCaseSearchParam) ||
          nft.metadata?.attributes
            ?.map((i) => i.trait_type.toLowerCase())
            .includes(lowerCaseSearchParam) ||
          nft.metadata?.tags?.toLowerCase().includes(lowerCaseSearchParam)
        );
      });
    }

    if (leaveSftsLast) {
      contractNftsResult = contractNftsResult?.sort((nft) =>
        'balance' in nft ? 1 : -1,
      );
    }

    return contractNftsResult;
  }, [leaveSftsLast, nftList, searchParam, withSearchFilter]);

  const nftsGroupedByCollection = useMemo(() => {
    if (groupByCollection && contractNfts) {
      return (
        contractNfts.reduce((nftCollectionMap, nft) => {
          if (!nftCollectionMap[nft.collection]) {
            nftCollectionMap[nft.collection] = [];
          }
          nftCollectionMap[nft.collection].push(nft);
          return nftCollectionMap;
        }, {} as Record<string, NFTType[]>) ?? ({} as Record<string, NFTType[]>)
      );
    }

    return {} as Record<string, NFTType[]>;
  }, [contractNfts, groupByCollection]);

  return {
    isLoadingNFTs,
    isFetchingNFTs,
    isErrorOnFetchNFTs,
    contractNfts,
    nftsGroupedByCollection,
  };
};
