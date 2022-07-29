import { Box, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setProposeMultiselectSelectedOption } from 'src/redux/slices/modalsSlice';
import { ProposalsTypes } from 'src/types/Proposals';
import { ReactComponent as AssetActionIcon } from 'src/assets/img/arrow-back-sharp.svg';
import { QueryKeys } from 'src/react-query/queryKeys';
import { useQuery } from 'react-query';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { IDelegation } from 'src/types/staking';
import { Balance } from '@elrondnetwork/erdjs/out';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useProviderIdentitiesAfterSelection from 'src/utils/useProviderIdentitiesAfterSelection';
import LoadingDataIndicator from '../Utils/LoadingDataIndicator';
import ErrorOnFetchIndicator from '../Utils/ErrorOnFetchIndicator';
import AmountWithTitleCard from '../Utils/AmountWithTitleCard';
import { MainButton } from '../Theme/StyledComponents';
import ActiveDelegationsTable from './ActiveDelegationsTable';

const MyStake = () => {
  const dispatch = useDispatch();
  const handleOptionSelected = (
    option: ProposalsTypes,
  ) => {
    dispatch(setProposeMultiselectSelectedOption({ option }));
  };

  const { address } = useGetAccountInfo();

  const currentContract = useSelector(currentMultisigContractSelector);

  const {
    fetchedProviderIdentities,
    isFetchingProviderIdentities,
    isLoadingProviderIdentities,
    isErrorOnFetchingProviderIdentities,
  } = useProviderIdentitiesAfterSelection();

  const [totalActiveStake, setTotalActiveStake] = useState<string>('0');
  const [totalClaimableRewards, setTotalClaimableRewards] = useState<string>('0');

  const fetchDelegations = useCallback(() =>
    axios
      .get(`https://devnet-delegation-api.elrond.com/accounts/${currentContract.address}/delegations`)
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
    if (!fetchedDelegations) return;

    console.log({ fetchedDelegations });
    console.log({ fetchedProviderIdentities });

    const totalActiveStake = fetchedDelegations.reduce((totalSum: number, delegation: IDelegation) =>
      totalSum + parseFloat(Balance.fromString(delegation.userActiveStake).toDenominated()), 0);

    const allClaimableRewards = fetchedDelegations.reduce((totalSum: number, delegation: IDelegation) =>
      totalSum + parseFloat(Balance.fromString(delegation.claimableRewards).toDenominated()), 0);
    setTotalClaimableRewards(Number(allClaimableRewards).toFixed(2));

    setTotalActiveStake(Number(totalActiveStake).toFixed(2));
  }, [fetchedDelegations, fetchedProviderIdentities]);

  if (isFetchingDelegations ||
    isLoadingDelegations) { return <LoadingDataIndicator dataName="delegation" />; }

  if (isErrorOnFetchDelegations) { return <ErrorOnFetchIndicator dataName="delegation" />; }
  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%', padding: '12px 0', gap: '12px' }}>
        <AmountWithTitleCard
          amountValue={totalActiveStake}
          amountUnityMeasure={'EGLD'}
          title={'My Total Stake'}
          actionButton={(
            <MainButton
              key="0"
              variant="outlined"
              sx={{
                fontSize: '16px',
                fontWeight: '400 !important',
                paddingLeft: '4px !important',
                width: '100%',
                marginTop: '1rem',
              }}
              className="shadow-sm rounded mr-2"
              onClick={() =>
                handleOptionSelected(ProposalsTypes.stake_tokens)
              }
            >
              <AssetActionIcon width="30px" height="30px" /> Stake
            </MainButton>
)}
        />
        <AmountWithTitleCard
          amountValue={totalClaimableRewards}
          amountUnityMeasure={'EGLD'}
          actionButton={(
            <Button
              disabled
              sx={{
                background: '#eee !important',
                border: '1px solid #ddd !important',
                padding: '0.5rem',
                marginTop: '1rem',
                width: '100%',
              }}
            >
              <InfoOutlinedIcon sx={{ marginRight: '5px' }} /> from 2 Providers
            </Button>
)}
          title={'My Claimable Rewards'}
        />
      </Box>
      <Box>
        {/* <AssetsTable hasStakingActions /> */}
        <ActiveDelegationsTable
          rows={fetchedProviderIdentities as any}
          isFetching={isFetchingProviderIdentities}
          isLoading={isLoadingProviderIdentities}
          isError={isErrorOnFetchingProviderIdentities}
        />
      </Box>
    </>
  );
};

export default MyStake;
