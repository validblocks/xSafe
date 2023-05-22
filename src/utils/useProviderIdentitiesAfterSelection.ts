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
import RationalNumber from './RationalNumber';

interface InputParams {
  searchParam?: string;
}

export default function useProviderIdentitiesAfterSelection({
  searchParam,
}: InputParams = {}) {
  const fetchProviders = useCallback(
    (): Promise<IProvider[]> =>
      axios
        .get(`${network.apiAddress}/providers`)
        .then((res) => res.data),
    [],
  );

  const { data: fetchedProviders, refetch: refetchProviders } = useQuery(
    [QueryKeys.FETCHED_PROVIDERS],
    fetchProviders,
    {
      ...USE_QUERY_DEFAULT_CONFIG,
      refetchOnMount: false,
    },
  );

  const buildColumns = useCallback(
    (data: IProviderIdentity[]): IdentityWithColumns[] => data.map((provider: IProviderIdentity) => {
      const providerBeforeIdentityFetch = fetchedProviders?.find(
        (p) => p.identity === provider.identity,
      );

      const stakedAmount = Number(
        RationalNumber.fromBigInteger(
          providerBeforeIdentityFetch?.locked ?? '0',
        ),
      );
      const providerDelegationCap = Number(
        RationalNumber.fromBigInteger(
          providerBeforeIdentityFetch?.delegationCap ?? '0',
        ),
      );

      let filledPercentage = 0;
      if (providerDelegationCap !== 0) {
        filledPercentage = stakedAmount / providerDelegationCap;
        filledPercentage = Math.min(100, filledPercentage);
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
          apr: providerBeforeIdentityFetch?.apr ?? 0,
        },
        aprColumn: {
          apr: providerBeforeIdentityFetch?.apr ?? 0,
        },
        filledColumn: {
          filledPercentage:
              providerBeforeIdentityFetch?.delegationCap !== '0'
                ? shortenedPercentage
                : ('N/A' as any),
        },
      };
    }),
    [fetchedProviders],
  );

  const filterBySearchParam = useCallback(
    (data: IProviderIdentity[]) => {
      if (!searchParam) return data;
      return data.filter((p) =>
        ('identity' in p && p.identity.toLowerCase().trim().includes(searchParam.toLowerCase().trim()))
        || ('name' in p && p.name.toLowerCase().trim().includes(searchParam.toLowerCase().trim()))
        || ('provider' in p && (p.provider as string).toLowerCase().trim().includes(searchParam.toLowerCase().trim())),
      );
    },
    [searchParam],
  );

  const addProvidersWithoutIdentity = useCallback(
    (data: IdentityWithColumns[]) => {
      const newProviders =
        fetchedProviders
          ?.filter((p) => !p.identity)
          .map((provider) => {
            const stakedAmount = Number(
              RationalNumber.fromBigInteger(provider.locked),
            );

            const providerBeforeIdentityFetch = fetchedProviders?.find(
              (p) => p.identity === provider.identity,
            );
            const providerDelegationCap = Number(
              RationalNumber.fromBigInteger(
                providerBeforeIdentityFetch?.delegationCap ?? '0',
              ),
            );

            let filledPercentage = 0;
            if (providerDelegationCap !== 0) {
              filledPercentage = stakedAmount / providerDelegationCap;
              filledPercentage = Math.min(100, filledPercentage);
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
                filledPercentage: providerBeforeIdentityFetch?.delegationCap !== '0'
                  ? shortenedPercentage
                  : ('∞' as any),
              },
            };
          }) ?? [];

      return [...data, ...newProviders];
    },
    [fetchedProviders],
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
        buildColumns,
        addProvidersWithoutIdentity,
        filterBySearchParam,
        shuffle,
      )(data),
    [
      buildColumns,
      addProvidersWithoutIdentity,
      filterBySearchParam,
      shuffle,
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
    refetchProviders,
  };
}
