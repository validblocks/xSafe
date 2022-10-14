import { Box, Button, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setProposeMultiselectSelectedOption } from 'src/redux/slices/modalsSlice';
import { ProposalsTypes } from 'src/types/Proposals';
import { ReactComponent as AssetActionIcon } from 'src/assets/img/arrow-back-sharp.svg';
import { QueryKeys } from 'src/react-query/queryKeys';
import { useQuery } from 'react-query';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import { useEffect, useState } from 'react';
import { useTheme } from 'styled-components';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import {
  IDelegation,
  IdentityWithColumns,
  IUndelegatedFunds,
} from 'src/types/staking';
import { Balance } from '@elrondnetwork/erdjs';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useProviderIdentitiesAfterSelection from 'src/utils/useProviderIdentitiesAfterSelection';
import { getDenominatedBalance } from 'src/utils/balanceUtils';
import { activeDelegationsRowsSelector } from 'src/redux/selectors/accountSelector';
import { setActiveDelegationRows } from 'src/redux/slices/accountSlice';
import axios from 'axios';
import LoadingDataIndicator from '../Utils/LoadingDataIndicator';
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

  const [totalActiveStake, setTotalActiveStake] = useState<string>('0');
  const [totalClaimableRewards, setTotalClaimableRewards] =
    useState<string>('0');
  const [totalUndelegatedFunds, setTotalUndelegatedFunds] =
    useState<string>('0');

  const activeDelegationsRows = useSelector(activeDelegationsRowsSelector);

  const fetchDelegations = () =>
    axios.get(`http://localhost:3000/proxy?route=https://devnet-delegation-api.elrond.com/accounts/${currentContract?.address}/delegations?forceRefresh=true`).then((r) => r.data);

  const {
    data: fetchedDelegations,
    isFetching: isFetchingDelegations,
    isLoading: isLoadingDelegations,
    isError: isErrorOnFetchDelegations,
  } = useQuery([QueryKeys.FETCHED_DELEGATIONS], fetchDelegations, {
    ...USE_QUERY_DEFAULT_CONFIG,
    keepPreviousData: true,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!fetchedDelegations || !fetchedProviderIdentities) return;

    const totalActiveStake = fetchedDelegations.reduce(
      (totalSum: number, delegation: IDelegation) =>
        totalSum +
        parseFloat(
          Balance.fromString(delegation.userActiveStake).toDenominated(),
        ),
      0,
    );

    const allClaimableRewards = fetchedDelegations.reduce(
      (totalSum: number, delegation: IDelegation) =>
        totalSum +
        parseFloat(
          Balance.fromString(delegation.claimableRewards).toDenominated(),
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
          Balance.fromString(undelegation.amount).toDenominated(),
        );
        return totalSum + amount;
      },
      0,
    );

    setTotalUndelegatedFunds(
      getDenominatedBalance<string>(totalUndelegations, {
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
      getDenominatedBalance<string>(totalActiveStake, {
        precisionAfterComma: 4,
        needsDenomination: false,
      }),
    );
  }, [dispatch, fetchedDelegations, fetchedProviderIdentities]);

  if (isFetchingDelegations || isLoadingDelegations) {
    return <LoadingDataIndicator dataName="delegation" />;
  }

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
          padding: '12px 0',
          gap: '12px',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={4}>
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
                    paddingLeft: '4px !important',
                    width: '100%',
                    marginTop: '1rem',
                  }}
                  className="shadow-sm rounded mr-2"
                  onClick={() =>
                    handleOptionSelected(ProposalsTypes.stake_tokens)
                  }
                >
                  <AssetActionIcon width="25px" height="25px" /> Stake
                </MainButton>
              )}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AmountWithTitleCard
              amountValue={getDenominatedBalance(totalClaimableRewards, {
                needsDenomination: false,
                precisionAfterComma: 5,
              })}
              amountUnityMeasure={'EGLD'}
              actionButton={(
                <Button
                  disabled
                  sx={{
                    backgroundColor: theme.palette.background.disabled,
                    borderColor: theme.palette.background.disabled,
                    color: `${theme.palette.text.disabled} !important`,
                    boxShadow: 'none',
                    padding: '0.5rem',
                    marginTop: '1rem',
                    width: '100%',
                  }}
                >
                  <InfoOutlinedIcon sx={{ marginRight: '5px' }} />
                  {`from ${activeDelegationsRows?.length ?? '0'} Providers`}
                </Button>
              )}
              title={'My Claimable Rewards'}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AmountWithTitleCard
              amountValue={totalUndelegatedFunds}
              amountUnityMeasure={'EGLD'}
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
                >
                  <AssetActionIcon width="25px" height="25px" /> Details
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
