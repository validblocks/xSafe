import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import { QueryKeys } from 'src/react-query/queryKeys';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { StateType } from 'src/redux/slices/accountGeneralInfoSlice';
import { ElrondApiProvider } from 'src/services/ElrondApiNetworkProvider';
import { MultisigContractInfoType } from 'src/types/multisigContracts';
import { NFTType } from 'src/types/nfts';

interface IUseContractNftsConfig {
  withSearchFilter?: boolean;
  searchParam: string;
}

export const useContractNFTs = (
  { withSearchFilter, searchParam }: IUseContractNftsConfig = {
    withSearchFilter: false,
    searchParam: '',
  },
) => {
  const currentContract = useSelector<StateType, MultisigContractInfoType>(
    currentMultisigContractSelector,
  );
  const fetchNFTs = useCallback(
    () => ElrondApiProvider.fetchOrganizationNFTs(currentContract?.address),
    [currentContract],
  );

  const {
    data: nftList,
    isFetching: isFetchingNFTs,
    isLoading: isLoadingNFTs,
    isError: isErrorOnFetchNFTs,
  } = useQuery(
    [QueryKeys.ALL_ORGANIZATION_NFTS],
    () => fetchNFTs(),
    USE_QUERY_DEFAULT_CONFIG,
  );

  let contractNfts = nftList?.sort((first: NFTType, second: NFTType) =>
    first.collection.localeCompare(second.collection),
  );

  if (withSearchFilter) {
    contractNfts = contractNfts?.filter((nft) => {
      const lowerCaseSearchParam = searchParam.toLowerCase();
      return (
        nft.collection.toLowerCase().includes(lowerCaseSearchParam) ||
        nft.name.toLowerCase().includes(lowerCaseSearchParam) ||
        nft.tags?.map((t) => t.toLowerCase()).includes(lowerCaseSearchParam) ||
        nft.ticker?.toLowerCase().includes(lowerCaseSearchParam) ||
        nft.metadata?.attributes
          ?.map((i) => i.trait_type.toLowerCase())
          .includes(lowerCaseSearchParam) ||
        nft.metadata?.tags?.toLowerCase().includes(lowerCaseSearchParam)
      );
    });
  }

  return {
    isFetchingNFTs,
    isLoadingNFTs,
    isErrorOnFetchNFTs,
    contractNfts,
  };
};
