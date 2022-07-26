import { operations } from '@elrondnetwork/dapp-utils';
import axios from 'axios';
import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { denomination, decimals } from 'src/config';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import { QueryKeys } from 'src/react-query/queryKeys';
import {
  IdentityWithColumns,
  IProvider,
  IProviderIdentity,
} from 'src/types/staking';
import pipe from './compose';

interface InputParams {
  searchParam?: string;
}

export default function useProviderIdentitiesAfterSelection({
  searchParam,
}: InputParams = {}) {
  const fetchProviders = useCallback(
    (): Promise<IProvider[]> =>
      axios.get('https://api.elrond.com/providers').then((res) => res.data),
    [],
  );

  const { data: fetchedProviders } = useQuery(
    [QueryKeys.FETCHED_PROVIDERS],
    fetchProviders,
    {
      ...USE_QUERY_DEFAULT_CONFIG,
      keepPreviousData: true,
      refetchOnMount: false,
    },
  );

  const buildColumns = useCallback(
    (data: IProviderIdentity[]): IdentityWithColumns[] =>
      data.map((provider: IProviderIdentity) => {
        const stakedAmount = Number(
          operations
            .denominate({
              input: provider.locked,
              denomination,
              decimals,
              showLastNonZeroDecimal: true,
            })
            .replaceAll(',', ''),
        );

        const providerBeforeIdentityFetch = fetchedProviders?.find(
          (p) => p.identity === provider.identity,
        );
        const delegationCap = providerBeforeIdentityFetch?.delegationCap;

        const denominatedDelegationCap = operations.denominate({
          input: delegationCap ?? '1',
          denomination,
          decimals,
          showLastNonZeroDecimal: true,
        });

        const delegationCapForCalculations = Number(
          denominatedDelegationCap.replaceAll(',', ''),
        );

        let filledPercentage = Number(
          Number((stakedAmount / delegationCapForCalculations) * 100).toFixed(
            1,
          ),
        );
        if (filledPercentage > 100) filledPercentage = 100;

        return {
          ...provider,
          numNodes: providerBeforeIdentityFetch?.numNodes ?? 0,
          id: provider.identity,
          providerColumn: {
            avatar: provider.avatar,
            name: provider.name,
            website: provider.website,
          },
          aprColumn: {
            apr: provider.apr ?? 0,
          },
          filledColumn: {
            filledPercentage,
          },
        };
      }),
    [fetchedProviders],
  );

  const _sortAfterNodes = useCallback(
    (data: IdentityWithColumns[]) =>
      data.sort((a, b) => b.numNodes - a.numNodes),
    [],
  );

  console.log('custom hook called');

  //   const needsReshuffle = useSelector(needsReshuffleSelector);
  //   const dispatch = useDispatch();

  const _sortRandom = useCallback((data: IdentityWithColumns[]) => {
    // if (needsReshuffle) {
    //   dispatch(setNeedsReshuffle(false));
    console.log('returning sorted data');
    return data.sort(() => Math.random() - 0.5);
    // }
    // console.log('returning unsorted data');
    // return data;
  }, []);

  const bringValidBlocksFirst = useCallback((data: IdentityWithColumns[]) => {
    const validBlocksIndex = data.findIndex(
      (p) => p.identity === 'validblocks',
    );
    if (validBlocksIndex > -1) {
      const validBlocks = data.splice(validBlocksIndex, 1);
      data.unshift(validBlocks[0]);
    }
    return data;
  }, []);

  const filterBySearchParam = useCallback(
    (data: IProviderIdentity[]) => {
      if (!searchParam) return data;
      return data.filter((p) =>
        p.identity.toLowerCase().includes(searchParam.toLowerCase()),
      );
    },
    [searchParam],
  );

  const _shuffle = useCallback((inputArray: any[]) => {
    const array = inputArray.slice();
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }, []);

  const fetchProviderIdentities = () => {
    const providerIds = fetchedProviders
      ?.map((provider: IProvider) => provider.identity)
      .join(',');
    return axios
      .get(`https://api.elrond.com/identities?identities=${providerIds}`)
      .then((res) => res.data);
  };

  const {
    data: fetchedProviderIdentities,
    isFetching: isFetchingProviderIdentities,
    isLoading: isLoadingProviderIdentities,
    isError: isErrorOnFetchingProviderIdentities,
  } = useQuery(
    [QueryKeys.FETCHED_PROVIDER_IDENTITIES],
    fetchProviderIdentities,
    {
      ...USE_QUERY_DEFAULT_CONFIG,
      keepPreviousData: true,
      enabled: !!fetchedProviders,
      refetchOnMount: false,
      select: (data: IProviderIdentity[]) =>
        pipe(
          filterBySearchParam,
          buildColumns,
          _sortRandom,
          bringValidBlocksFirst,
        )(data),
    },
  );

  return {
    fetchedProviderIdentities,
    isFetchingProviderIdentities,
    isLoadingProviderIdentities,
    isErrorOnFetchingProviderIdentities,
  };
}
