/* eslint-disable no-nested-ternary */
import { Box, Button, Grid, useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setProposeMultiselectSelectedOption } from 'src/redux/slices/modalsSlice';
import { ProposalsTypes } from 'src/types/Proposals';
import { QueryKeys } from 'src/react-query/queryKeys';
import { useQuery } from 'react-query';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import { KeyboardEvent, useEffect, useState } from 'react';
import { useTheme } from 'styled-components';
import {
  currentMultisigContractSelector,
  currentMultisigTransactionIdSelector,
} from 'src/redux/selectors/multisigContractsSelectors';
import {
  IDelegation,
  IdentityWithColumns,
  IUndelegatedFunds,
} from 'src/types/staking';
import useProviderIdentitiesAfterSelection from 'src/utils/useProviderIdentitiesAfterSelection';
import { getDenominatedBalance } from 'src/utils/balanceUtils';
import { activeDelegationsRowsSelector } from 'src/redux/selectors/accountSelector';
import { setActiveDelegationRows } from 'src/redux/slices/accountGeneralInfoSlice';
import axios from 'axios';
import { useTrackTransactionStatus } from '@multiversx/sdk-dapp/hooks';
import { xSafeApiUrl } from 'src/config';
import RationalNumber from 'src/utils/RationalNumber';
import ErrorOnFetchIndicator from '../Utils/ErrorOnFetchIndicator';
import AmountWithTitleCard from '../Utils/AmountWithTitleCard';
import { MainButton } from '../Theme/StyledComponents';
import ActiveDelegationsTable from './ActiveDelegationsTable';

const MyStake = () => {
  const theme: any = useTheme();
  const dispatch = useDispatch();
  const handleOptionSelected = (option: ProposalsTypes) => {
    dispatch(setProposeMultiselectSelectedOption({ option }));
  };

  const currentContract = useSelector(currentMultisigContractSelector);

  const {
    fetchedProviderIdentities,
    isFetchingProviderIdentities,
    isLoadingProviderIdentities,
    isErrorOnFetchingProviderIdentities,
  } = useProviderIdentitiesAfterSelection();

  const [totalActiveStake, setTotalActiveStake] = useState(0);
  const [totalClaimableRewards, setTotalClaimableRewards] =
    useState<string>('0');
  const [totalUndelegatedFunds, setTotalUndelegatedFunds] =
    useState(0);

  const activeDelegationsRows = useSelector(activeDelegationsRowsSelector);

  const fetchDelegations = () =>
    axios.get(`${xSafeApiUrl}/delegations/${currentContract?.address}`).then((r) => r.data);

  const {
    data: fetchedDelegations,
    isFetching: isFetchingDelegations,
    isLoading: isLoadingDelegations,
    isError: isErrorOnFetchDelegations,
    refetch: refetchDelegations,
  } = useQuery([QueryKeys.FETCHED_DELEGATIONS], fetchDelegations, {
    ...USE_QUERY_DEFAULT_CONFIG,
    keepPreviousData: true,
    refetchOnMount: true,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!fetchedDelegations || !fetchedProviderIdentities) return;

    const totalActiveStake = fetchedDelegations.reduce(
      (totalSum: number, delegation: IDelegation) =>
        totalSum +
        parseFloat(
          RationalNumber.fromBigInteger(delegation?.userActiveStake ?? 0),
        ),
      0,
    );

    const allClaimableRewards = fetchedDelegations.reduce(
      (totalSum: number, delegation: IDelegation) =>
        totalSum +
        parseFloat(
          RationalNumber.fromBigInteger(delegation?.claimableRewards ?? 0),
        ),
      0,
    );

    const allClaimableRewardsString = getDenominatedBalance<string>(
      allClaimableRewards,
      { precisionAfterComma: 4, needsDenomination: false },
    );
    setTotalClaimableRewards(allClaimableRewardsString);

    const contractUndelegations = fetchedDelegations.reduce(
      (acc: IUndelegatedFunds[], delegation: IDelegation) => [
        ...acc,
        ...delegation.userUndelegatedList,
      ],
      [],
    );

    const totalUndelegations = contractUndelegations.reduce(
      (totalSum: number, undelegation: IUndelegatedFunds) => {
        const amount = parseFloat(
          RationalNumber.fromBigInteger(undelegation?.amount ?? 0),
        );
        return totalSum + amount;
      },
      0,
    );

    setTotalUndelegatedFunds(
      getDenominatedBalance<number>(totalUndelegations, {
        precisionAfterComma: 5,
        needsDenomination: false,
      }),
    );

    const activeDelegationsRows =
      fetchedProviderIdentities
        ?.filter((providerIdentity: IdentityWithColumns) =>
          fetchedDelegations.some(
            (delegation: IDelegation) =>
              delegation.contract === providerIdentity.provider,
          ),
        )
        .map((providerIdentity: IdentityWithColumns) => {
          const delegation = fetchedDelegations.find(
            (delegation: IDelegation) =>
              delegation.contract === providerIdentity.provider,
          );

          const delegatedAmount = delegation
            ? getDenominatedBalance<string>(delegation.userActiveStake, {
              precisionAfterComma: 4,
            })
            : '0';

          const claimableRewards =
            getDenominatedBalance<number>(delegation.claimableRewards, {
              precisionAfterComma: 4,
            }) ?? '0';

          return {
            ...providerIdentity,
            delegatedColumn: {
              delegatedAmount,
            },
            claimableRewardsColumn: {
              claimableRewards,
            },
          };
        }) ?? [];

    dispatch(setActiveDelegationRows(activeDelegationsRows));

    setTotalActiveStake(
      getDenominatedBalance<number>(totalActiveStake, {
        precisionAfterComma: 4,
        needsDenomination: false,
      }),
    );
  }, [dispatch, fetchedDelegations, fetchedProviderIdentities]);

  const maxWidth804 = useMediaQuery('(max-width:804px)');
  const widthBetween805and1038 = useMediaQuery('(min-width: 805px) and (max-width: 1038px)');

  const currentMultisigTransactionId = useSelector(currentMultisigTransactionIdSelector);
  useTrackTransactionStatus({
    transactionId: currentMultisigTransactionId,
    onSuccess: () => {
      refetchDelegations();
    },
  });

  const allClaimableRewards = Number(RationalNumber.fromBigInteger(totalClaimableRewards));

  if (isErrorOnFetchDelegations) {
    return <ErrorOnFetchIndicator dataName="delegation" />;
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          width: '100%',
          gap: '12px',
        }}
      >
        <Grid container gap={'12px'} marginBottom={'12px'}>
          <Grid item width={maxWidth804 ? '100%' : widthBetween805and1038 ? '48.8%' : 'auto'}>
            <AmountWithTitleCard
              amountValue={totalActiveStake}
              amountUnityMeasure={'EGLD'}
              title={'My Total Stake'}
              actionButton={(
                <MainButton
                  key="0"
                  variant="outlined"
                  size="medium"
                  sx={{
                    fontSize: '14px',
                    fontWeight: '400 !important',
                    width: '100%',
                    marginTop: '1rem',
                  }}
                  className="shadow-sm rounded"
                  onClick={() =>
                    handleOptionSelected(ProposalsTypes.stake_tokens)
                  }
                  onKeyDown={(e: KeyboardEvent) => e.preventDefault()}
                  onKeyUp={(e: KeyboardEvent) => e.preventDefault()}
                >
                  Stake
                </MainButton>
              )}
              isLoading={isLoadingDelegations || isFetchingDelegations}

            />
          </Grid>
          <Grid item width={maxWidth804 ? '100%' : widthBetween805and1038 ? '48.8%' : 'auto'}>
            <AmountWithTitleCard
              amountValue={allClaimableRewards}
              amountUnityMeasure={'EGLD'}
              actionButton={(
                <Button
                  variant="outlined"
                  size="medium"
                  disabled
                  sx={{
                    backgroundColor: theme.palette.background.disabled,
                    border: `solid 1px ${theme.palette.background.disabledBorder} !important`,
                    color: `${theme.palette.text.disabled} !important`,
                    boxShadow: 'none',
                    padding: '5px 10px 3px',
                    marginTop: '1rem',
                    width: '100%',
                    textTransform: 'capitalize',
                    fontSize: '14px',
                  }}
                >
                  {`from ${activeDelegationsRows?.length ?? '0'} Providers`}
                </Button>
              )}
              title={'My Claimable Rewards'}
              isLoading={isLoadingDelegations || isFetchingDelegations}

            />
          </Grid>
          <Grid item width={maxWidth804 ? '100%' : widthBetween805and1038 ? '48.8%' : 'auto'}>
            <AmountWithTitleCard
              amountValue={totalUndelegatedFunds}
              amountUnityMeasure={'EGLD'}
              isLoading={isLoadingDelegations || isFetchingDelegations}
              actionButton={(
                <MainButton
                  key="0"
                  variant="outlined"
                  sx={{
                    fontSize: '14px',
                    fontWeight: '400 !important',
                    paddingLeft: '4px !important',
                    width: '100%',
                    marginTop: '1rem',
                  }}
                  className="shadow-sm rounded mr-2"
                  onClick={() =>
                    handleOptionSelected(ProposalsTypes.withdraw_funds)
                  }
                  onKeyDown={(e) => e.preventDefault()}
                  onKeyUp={(e) => e.preventDefault()}
                >
                  Details
                </MainButton>
              )}
              title={'My Undelegated Funds'}
            />
          </Grid>
        </Grid>
      </Box>
      <Box>
        <ActiveDelegationsTable
          isFetching={isFetchingProviderIdentities}
          isLoading={isLoadingProviderIdentities}
          isError={isErrorOnFetchingProviderIdentities}
        />
      </Box>
    </>
  );
};

export default MyStake;
