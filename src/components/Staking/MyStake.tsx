/* eslint-disable no-nested-ternary */
import { Box, Button, Grid, useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setProposeMultiselectSelectedOption } from 'src/redux/slices/modalsSlice';
import { ProposalsTypes } from 'src/types/multisig/proposals/Proposals';
import { QueryKeys } from 'src/react-query/queryKeys';
import { useQuery } from 'react-query';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import { KeyboardEvent, useCallback, useEffect, useState } from 'react';
import { useCustomTheme } from 'src/hooks/useCustomTheme';
import {
  currentMultisigContractSelector,
  currentMultisigTransactionIdSelector,
} from 'src/redux/selectors/multisigContractsSelectors';
import {
  IDelegation,
  IdentityWithColumns,
  IUndelegatedFunds,
} from 'src/types/staking';
import useProviderIdentitiesAfterSelection from 'src/hooks/useProviderIdentitiesAfterSelection';
import { activeDelegationsRowsSelector } from 'src/redux/selectors/accountSelector';
import { setActiveDelegationRows } from 'src/redux/slices/accountGeneralInfoSlice';
import { useTrackTransactionStatus } from 'src/hooks/sdkDappHooks';
import ErrorOnFetchIndicator from '../Utils/ErrorOnFetchIndicator';
import AmountWithTitleCard from '../Utils/AmountWithTitleCard';
import { MainButton } from '../Theme/StyledComponents';
import ActiveDelegationsTable from './ActiveDelegationsTable';
import { SafeApi } from 'src/services/xSafeApiProvider';
import { Converters } from 'src/utils/Converters';
import BigNumber from 'bignumber.js';

const MyStake = () => {
  const theme = useCustomTheme();
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

  const [totalActiveStake, setTotalActiveStake] = useState<BigNumber>(
    new BigNumber(0),
  );
  const [totalClaimableRewards, setTotalClaimableRewards] = useState<BigNumber>(
    new BigNumber(0),
  );
  const [totalUndelegatedFunds, setTotalUndelegatedFunds] = useState<BigNumber>(
    new BigNumber(0),
  );

  const activeDelegationsRows = useSelector(activeDelegationsRowsSelector);

  const fetchDelegations = useCallback(
    () => SafeApi.getAddressDelegations(currentContract?.address),
    [currentContract?.address],
  );

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
    enabled: !!(currentContract?.address && currentContract?.address !== ''),
  });

  useEffect(() => {
    if (
      !fetchedDelegations ||
      !fetchedProviderIdentities ||
      !(fetchedDelegations instanceof Array)
    )
      return;

    const totalActiveStake: BigNumber = fetchedDelegations?.reduce(
      (totalSum: BigNumber, delegation: IDelegation) =>
        totalSum.plus(
          BigNumber(
            Converters.denominateWithNDecimals(
              delegation?.userActiveStake ?? 0,
            ),
          ),
        ),
      new BigNumber(0),
    );

    const allClaimableRewards: BigNumber = fetchedDelegations?.reduce(
      (totalSum: BigNumber, delegation: IDelegation) =>
        totalSum.plus(
          BigNumber(
            Converters.denominateWithNDecimals(
              delegation?.claimableRewards ?? 0,
            ),
          ),
        ),
      new BigNumber(0),
    );

    const contractUndelegations = fetchedDelegations?.reduce(
      (acc: IUndelegatedFunds[], delegation: IDelegation) =>
        'userUndelegatedList' in delegation
          ? [...acc, ...delegation.userUndelegatedList]
          : [...acc],
      [],
    );

    const totalUndelegations: BigNumber = contractUndelegations.reduce(
      (totalSum: BigNumber, undelegation: IUndelegatedFunds) => {
        const amount = Converters.denominateWithNDecimals(
          undelegation?.amount ?? 0,
        );
        return totalSum.plus(new BigNumber(amount));
      },
      new BigNumber(0),
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
            ? Converters.denominateWithNDecimals(delegation.userActiveStake)
            : '0';

          const claimableRewards = Converters.denominateWithNDecimals(
            delegation.claimableRewards ?? '0',
          );

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

    setTotalActiveStake(totalActiveStake);
    setTotalUndelegatedFunds(totalUndelegations);
    setTotalClaimableRewards(allClaimableRewards);
  }, [
    dispatch,
    fetchDelegations,
    fetchedDelegations,
    fetchedProviderIdentities,
  ]);

  const maxWidth804 = useMediaQuery('(max-width:804px)');
  const widthBetween805and1038 = useMediaQuery(
    '(min-width: 805px) and (max-width: 1038px)',
  );

  const currentMultisigTransactionId = useSelector(
    currentMultisigTransactionIdSelector,
  );
  useTrackTransactionStatus({
    transactionId: currentMultisigTransactionId,
    onSuccess: () => {
      refetchDelegations();
    },
  });

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
          <Grid
            item
            width={
              maxWidth804 ? '100%' : widthBetween805and1038 ? '48.8%' : 'auto'
            }
          >
            <AmountWithTitleCard
              amountValue={totalActiveStake}
              amountUnityMeasure={'EGLD'}
              title={'My Total Stake'}
              actionButton={
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
              }
              isLoading={isLoadingDelegations || isFetchingDelegations}
            />
          </Grid>
          <Grid
            item
            width={
              maxWidth804 ? '100%' : widthBetween805and1038 ? '48.8%' : 'auto'
            }
          >
            <AmountWithTitleCard
              amountValue={totalClaimableRewards}
              amountUnityMeasure={'EGLD'}
              actionButton={
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
              }
              title={'My Claimable Rewards'}
              isLoading={isLoadingDelegations || isFetchingDelegations}
            />
          </Grid>
          <Grid
            item
            width={
              maxWidth804 ? '100%' : widthBetween805and1038 ? '48.8%' : 'auto'
            }
          >
            <AmountWithTitleCard
              amountValue={totalUndelegatedFunds}
              amountUnityMeasure={'EGLD'}
              isLoading={isLoadingDelegations || isFetchingDelegations}
              actionButton={
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
              }
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
