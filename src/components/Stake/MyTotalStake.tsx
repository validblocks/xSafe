import { Text, MultisigCard } from 'src/components/StyledComponents/StyledComponents';
import { useTranslation } from 'react-i18next';
import { QueryKeys } from 'src/react-query/queryKeys';
import { useQuery } from 'react-query';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import axios from 'axios';
import { useCallback, useEffect } from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import LoadingDataIndicator from '../Utils/LoadingDataIndicator';

const MyTotalStake = () => {
  const { t } = useTranslation();
  const { address } = useGetAccountInfo();

  const fetchDelegations = useCallback(() =>
    axios
      .get(`https://delegation-api.elrond.com/accounts/${address}/delegations`)
      .then((res) => res.data), [address]);

  const {
    data: fetchedDelegations,
    isFetching: isFetchingDelegations,
    isLoading: isLoadingDelegations,
    isError: isErrorOnFetchDelegations,
  } = useQuery(
    [
      QueryKeys.FETCHED_DELEGATIONS,
    ],
    fetchDelegations,
    {
      ...USE_QUERY_DEFAULT_CONFIG,
      keepPreviousData: true,
    },
  );

  useEffect(() => {
    console.log({ fetchedDelegations });
  }, [fetchedDelegations]);

  if (isFetchingDelegations ||
    isLoadingDelegations) { return <LoadingDataIndicator dataName="delegation" />; }

  if (isErrorOnFetchDelegations) { return <Text>Error fetching delegations</Text>; }

  return (
    <MultisigCard sx={{
      padding: '15px',
    }}
    >
      <Text fontSize="15px" color="black.main" marginBottom="12px">{t('My Total Stake') as string}:</Text>
      <Text fontSize="24px" fontWeight="bolder">${'124,234.43'}</Text>
    </MultisigCard>
  );
};
export default MyTotalStake;
