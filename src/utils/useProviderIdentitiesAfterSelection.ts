import { Balance } from '@elrondnetwork/erdjs/out';
import axios from 'axios';
import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { network } from 'src/config';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import { QueryKeys } from 'src/react-query/queryKeys';
import {
  IdentityWithColumns,
  IProvider,
  IProviderIdentity,
} from 'src/types/staking';
import { getDenominatedBalance } from './balanceUtils';
import pipe from './compose';

interface InputParams {
  searchParam?: string;
}

export default function useProviderIdentitiesAfterSelection({
  searchParam,
}: InputParams = {}) {
  const fetchProviders = useCallback(
    (): Promise<IProvider[]> =>
      axios.get(network.apiAddress).then((res) => res.data),
    [],
  );

  const { data: fetchedProviders } = useQuery(
    [QueryKeys.FETCHED_PROVIDERS],
    fetchProviders,
    {
      ...USE_QUERY_DEFAULT_CONFIG,
      refetchOnMount: false,
    },
  );

  const buildColumns = useCallback(
    (data: IProviderIdentity[]): IdentityWithColumns[] =>
      data.map((provider: IProviderIdentity) => {
        const stakedAmount = Number(
          Balance.fromString(provider.locked).toDenominated(),
        );

        const providerBeforeIdentityFetch = fetchedProviders?.find(
          (p) => p.identity === provider.identity,
        );
        const providerDelegationCap = Number(
          Balance.fromString(
            providerBeforeIdentityFetch?.delegationCap ?? '0',
          ).toDenominated(),
        );

        let filledPercentage = 0;
        if (providerDelegationCap !== 0) {
          filledPercentage = stakedAmount / providerDelegationCap;
        }

        const shortenedPercentage = getDenominatedBalance<number>(
          (filledPercentage * 100).toString(),
          {
            precisionAfterComma: 1,
            needsDenomination: false,
          },
        );

        return {
          ...provider,
          provider: providerBeforeIdentityFetch?.provider ?? '',
          numNodes: providerBeforeIdentityFetch?.numNodes ?? 0,
          id: provider.identity,
          providerColumn: {
            avatar: provider.avatar,
            name: provider.name,
            website: provider.website,
            apr: provider.apr ?? 0,
          },
          aprColumn: {
            apr: provider.apr ?? 0,
          },
          filledColumn: {
            filledPercentage: shortenedPercentage,
          },
        };
      }),
    [fetchedProviders],
  );

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

  const addProvidersWithoutIdentity = useCallback(
    (data: IdentityWithColumns[]) => {
      const newProviders =
        fetchedProviders
          ?.filter((p) => !p.identity)
          .map((provider) => {
            const stakedAmount = Number(
              Balance.fromString(provider.locked).toDenominated(),
            );

            const providerBeforeIdentityFetch = fetchedProviders?.find(
              (p) => p.identity === provider.identity,
            );
            const providerDelegationCap = Number(
              Balance.fromString(
                providerBeforeIdentityFetch?.delegationCap ?? '0',
              ).toDenominated(),
            );

            let filledPercentage = 0;
            if (providerDelegationCap !== 0) {
              filledPercentage = stakedAmount / providerDelegationCap;
            }

            const shortenedPercentage = getDenominatedBalance<number>(
              (filledPercentage * 100).toString(),
              {
                precisionAfterComma: 1,
                needsDenomination: false,
              },
            );

            return {
              ...provider,
              id: provider.provider,
              providerColumn: {
                avatar: '#',
                name: provider.provider,
                website: '',
                apr: provider.apr ?? 0,
              },
              aprColumn: {
                apr: provider.apr ?? 0,
              },
              filledColumn: {
                filledPercentage: shortenedPercentage,
              },
            };
          }) ?? [];

      return [...data, ...newProviders];
    },
    [fetchedProviders],
  );

  const filterBySearchParam = useCallback(
    (data: IProviderIdentity[]) => {
      if (!searchParam) return data;
      return data.filter((p) =>
        p.identity.toLowerCase().includes(searchParam.toLowerCase()),
      );
    },
    [searchParam],
  );

  const shuffle = useCallback((inputArray: IdentityWithColumns[]) => {
    const array = inputArray.slice();
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }, []);

  const fetchProviderIdentities = useCallback(() => {
    const providerIds = fetchedProviders
      ?.map((provider: IProvider) => provider.identity)
      .join(',');
    return axios
      .get(`${network.apiAddress}/identities?identities=${providerIds}`)
      .then((res) => res.data);
  }, [fetchedProviders]);

  const select = useCallback(
    (data: IProviderIdentity[]) =>
      pipe(
        filterBySearchParam,
        buildColumns,
        addProvidersWithoutIdentity,
        shuffle,
        bringValidBlocksFirst,
      )(data),
    [
      filterBySearchParam,
      buildColumns,
      addProvidersWithoutIdentity,
      shuffle,
      bringValidBlocksFirst,
    ],
  );
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
      enabled: !!fetchedProviders,
      refetchOnMount: false,
      select,
    },
  );

  return {
    fetchedProviderIdentities,
    isFetchingProviderIdentities,
    isLoadingProviderIdentities,
    isErrorOnFetchingProviderIdentities,
  };
}
