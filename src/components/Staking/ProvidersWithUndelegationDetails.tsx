import { GridExpandMoreIcon } from '@mui/x-data-grid';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import BigNumber from 'bignumber.js';
import { useMemo, useState } from 'react';
import {
  AccordionDetails,
  Box,
  Grid,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import useProviderIdentitiesAfterSelection from 'src/hooks/useProviderIdentitiesAfterSelection';
import {
  IDelegation,
  IdentityWithColumns,
  IUndelegatedFunds,
} from 'src/types/staking';
import { useQueryClient } from 'react-query';
import useReactQueryState from 'src/react-query/useReactQueryState';
import { QueryKeys } from 'src/react-query/queryKeys';
import { Address, BigUIntValue } from '@multiversx/sdk-core/out';
import { useCustomTranslation } from 'src/hooks/useCustomTranslation';
import { mutateSmartContractCall } from 'src/contracts/MultisigContract';
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTop';
import { useDispatch, useSelector } from 'react-redux';
import { currentMultisigTransactionIdSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { useTrackTransactionStatus } from '@multiversx/sdk-dapp/hooks';
import { setProposeMultiselectSelectedOption } from 'src/redux/slices/modalsSlice';
import ErrorOnFetchIndicator from '../Utils/ErrorOnFetchIndicator';
import LoadingDataIndicator from '../Utils/LoadingDataIndicator';
import ProviderColumn from './ProviderColumn';
import { MainButtonNoShadow, WithdrawButton } from '../Theme/StyledComponents';
import TokenPresentationWithPrice from '../Utils/TokenPresentationWithPrice';
import { HtmlTooltip } from '../Utils/HtmlTooltip';
import CountdownTimer from '../Utils/CountdownTimer';
import * as Styled from './styled';
import { Text } from '../StyledComponents/StyledComponents';
import { Converters } from 'src/utils/Converters';

interface Props {
  searchParam?: string;
}

const useStyles = makeStyles(() => ({
  expanded: {
    margin: 0,
    borderRadius: '0 !important',
    '.MuiAccordionSummary-expandIconWrapper': {
      transition: 'all .2s linear',
      transform: 'rotate(180deg)',
    },
  },
  content: {
    margin: 0,
    display: 'flex',
    justifyContent: 'space-between',
    '&$expanded': {
      margin: 0,
    },
  },
}));

const ProvidersWithUndelegationDetails = ({ searchParam }: Props) => {
  const config = useMemo(() => ({ searchParam }), [searchParam]);
  const t = useCustomTranslation();
  const maxWidth460 = useMediaQuery('(max-width: 460px)');
  const maxWidth600 = useMediaQuery('(max-width: 600px)');

  const {
    fetchedProviderIdentities,
    isFetchingProviderIdentities,
    isLoadingProviderIdentities,
    isErrorOnFetchingProviderIdentities,
    refetchProviders,
  } = useProviderIdentitiesAfterSelection(config);

  const classes = useStyles();
  const queryClient = useQueryClient();
  const { getStateByKey } = useReactQueryState(queryClient);
  const fetchedDelegations = getStateByKey(
    QueryKeys.FETCHED_DELEGATIONS,
  ) as IDelegation[];

  const rows = useMemo(() => {
    if (!fetchedProviderIdentities) {
      console.log('No fetchedProviderIdentities');
      return [];
    }

    const providerIdentitiesWithUndelegations =
      fetchedProviderIdentities.filter((identity) => {
        const delegation = fetchedDelegations.find(
          (delegation: IDelegation) =>
            delegation.contract === identity.provider,
        );

        if (!delegation) return false;

        return delegation.userUndelegatedList?.length > 0;
      });

    return providerIdentitiesWithUndelegations?.map(
      (providerIdentity: IdentityWithColumns) => {
        const delegation = fetchedDelegations.find(
          (delegation: IDelegation) =>
            delegation.contract === providerIdentity.provider,
        );

        const totalRequestedUndelegations =
          delegation?.userUndelegatedList.reduce(
            (totalSum: BigNumber, undelegation: IUndelegatedFunds) => {
              const amount = Converters.denominateWithNDecimals(
                undelegation.amount,
              );
              return totalSum.plus(amount);
            },
            new BigNumber(0),
          );

        const withdrawableUndelegations =
          delegation?.userUndelegatedList?.filter(
            (delegation: IUndelegatedFunds) => delegation.seconds === 0,
          );

        const withdrawableUndelegationsAmount =
          withdrawableUndelegations?.reduce(
            (totalSum: BigNumber, undelegation: IUndelegatedFunds) => {
              const amount = Converters.denominateWithNDecimals(
                undelegation.amount,
              );
              return totalSum.plus(amount);
            },
            new BigNumber(0),
          );

        const pendingWithdrawals = delegation?.userUndelegatedList.filter(
          (delegation: IUndelegatedFunds) => delegation.seconds > 0,
        );

        return {
          ...providerIdentity,
          totalRequestedUndelegations: totalRequestedUndelegations?.valueOf(),
          withdrawableUndelegationsAmount:
            withdrawableUndelegationsAmount?.valueOf(),
          pendingWithdrawals,
        };
      },
    );
  }, [fetchedDelegations, fetchedProviderIdentities]);

  const [expanded, setExpanded] = useState<string | false>(false);
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const NOW_IN_MS = new Date().getTime();

  const transactionId = useSelector(currentMultisigTransactionIdSelector);

  const dispatch = useDispatch();

  useTrackTransactionStatus({
    transactionId,
    onSuccess: () => {
      refetchProviders();
      setIsWithdrawing(false);
    },
    onCancelled: () => {
      refetchProviders();
      setIsWithdrawing(false);
    },
    onTimedOut: () => {
      refetchProviders();
      setIsWithdrawing(false);
    },
    onFail: () => {
      refetchProviders();
      setIsWithdrawing(false);
    },
  });

  if (isFetchingProviderIdentities || isLoadingProviderIdentities) {
    return (
      <Box maxHeight={310} minHeight={310} sx={{ paddingTop: '2rem' }}>
        <LoadingDataIndicator dataName="withdrawal" />
      </Box>
    );
  }

  if (isErrorOnFetchingProviderIdentities)
    return <ErrorOnFetchIndicator dataName="provider" />;

  return (
    <Styled.UndelegationContainer
      justifyContent={rows.length === 0 ? 'center' : 'flex-start'}
    >
      {rows.length === 0 ? (
        <Styled.NoUndelegationsTypography>
          No funds waiting to be withdrawn at this moment
        </Styled.NoUndelegationsTypography>
      ) : (
        rows.map((row) => (
          <Styled.UndelegationAccordion
            key={row.id}
            onChange={handleChange(row.identity)}
            expanded={expanded === row.identity}
            sx={{
              '.MuiButtonBase-root.MuiAccordionSummary-root': {
                px: 0,
                '.MuiPaper-root.MuiAccordion-root': {
                  marginBottom: '100px',
                },
              },
            }}
          >
            <Styled.UndelegationAccordionSummary
              expandIcon={
                expanded === row.identity ? (
                  <ExpandLessRoundedIcon />
                ) : (
                  <GridExpandMoreIcon />
                )
              }
              aria-controls="panel1a-content"
              classes={{
                content: classes.content,
                expanded: classes.expanded,
              }}
              id="panel1a-header"
              sx={{
                '& .MuiAccordionSummary-expandIconWrapper': {
                  transition: 'all .2s linear',
                  transform: 'none !important',
                  display:
                    row.withdrawableUndelegationsAmount ===
                    row.totalRequestedUndelegations
                      ? 'none'
                      : 'flex',
                },
              }}
            >
              <Styled.UndelegationGridContainer
                sx={{
                  borderBottomLeftRadius:
                    row?.pendingWithdrawals?.length === 0 ? '10px' : 0,
                  borderBottomRightRadius:
                    row?.pendingWithdrawals?.length === 0 ? '10px' : 0,
                }}
                justifyContent="space-between"
                container
              >
                <Grid
                  item
                  xs={7}
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}
                >
                  <ProviderColumn columnData={row.providerColumn} />
                </Grid>
                <Grid
                  xs={5}
                  item
                  sx={{
                    padding: '.5rem 1rem',
                    fontSize: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                  }}
                >
                  <div>
                    <Text fontSize={12}>
                      <strong>Withdrawable:</strong>
                    </Text>
                  </div>
                  <div className="d-flex align-items-center mt-1">
                    <Text fontSize={12}>
                      {row.withdrawableUndelegationsAmount} /{' '}
                      {row.totalRequestedUndelegations} $EGLD
                    </Text>
                  </div>
                </Grid>
                <Grid item xs={12} display={'flex'} alignItems={'center'}>
                  <WithdrawButton
                    key="0"
                    variant="outlined"
                    sx={{
                      opacity: '1 !important',
                      height: '30px',
                      width: '100%',
                      p: '.17rem .5rem 0rem !important',
                      mr: '0 !important',
                    }}
                    disabled={
                      row.withdrawableUndelegationsAmount?.valueOf() === '0' ||
                      isWithdrawing
                    }
                    className="shadow-sm rounded mr-2"
                    onClick={() => {
                      setIsWithdrawing(true);
                      mutateSmartContractCall(
                        new Address(row.provider),
                        new BigUIntValue(new BigNumber(0)),
                        'withdraw',
                      );
                      dispatch(setProposeMultiselectSelectedOption(null));
                    }}
                  >
                    <Text fontWeight="600">Withdraw</Text>
                  </WithdrawButton>
                </Grid>
              </Styled.UndelegationGridContainer>
            </Styled.UndelegationAccordionSummary>
            <AccordionDetails
              sx={{
                padding: '0',
                backgroundColor: 'rgba(76, 47, 252, 0.1)',
                borderRadius: '0 0 10px 10px !important',
                border: '1px solid #312870',
                borderTop: 'none',
              }}
            >
              {row.pendingWithdrawals?.map((withdrawal: IUndelegatedFunds) => (
                <Box
                  key={withdrawal.seconds}
                  display="flex"
                  justifyContent={'space-between'}
                  flexWrap="wrap"
                >
                  <Box
                    flex={1}
                    paddingTop="10px"
                    paddingLeft="10px"
                    paddingBottom="10px"
                  >
                    <TokenPresentationWithPrice
                      identifier="EGLD"
                      withTokenAmount={false}
                      withTokenValue={false}
                    />
                  </Box>
                  <Box
                    display="flex"
                    flexDirection={'column'}
                    flex={1}
                    paddingTop="10px"
                    paddingRight={maxWidth460 ? '10px' : '0'}
                    paddingLeft={maxWidth460 ? '14px' : '0'}
                    paddingBottom="10px"
                    alignItems={maxWidth460 ? 'flex-start' : 'center'}
                    borderLeft={maxWidth460 ? '1px solid #312870' : 'none'}
                  >
                    <Box>
                      <Text>Amount: </Text>
                    </Box>
                    <Box>
                      <Text>{`${Converters.denominateWithNDecimals(
                        withdrawal.amount,
                      )} $EGLD`}</Text>
                    </Box>
                  </Box>
                  <Box
                    display="flex"
                    flex={maxWidth460 ? '100%' : 1}
                    alignItems="center"
                    borderTop={maxWidth460 ? '1px solid #312870' : 'none'}
                    paddingTop="10px"
                    paddingRight={maxWidth460 ? '0' : '10px'}
                    paddingBottom={maxWidth460 ? '10px' : '10px'}
                    paddingLeft={maxWidth460 ? '10px' : '10px'}
                    justifyContent="center"
                  >
                    {!maxWidth600 ? (
                      <HtmlTooltip
                        disableFocusListener
                        disableTouchListener
                        title={
                          <Box display="flex" alignItems="center">
                            <CountdownTimer
                              targetDate={NOW_IN_MS + withdrawal.seconds * 1000}
                            />
                            <Typography
                              component="span"
                              sx={{ ml: 0.25 }}
                              fontSize={11}
                            >
                              {' '}
                              {t('left until unbonding ends') as string}
                            </Typography>
                          </Box>
                        }
                        placement="top"
                      >
                        <MainButtonNoShadow
                          sx={{
                            height: '30px',
                            textTransform: 'none',
                            cursor: 'auto !important',
                            paddingLeft: '5px !important',
                            paddingBottom: '5px !important',
                          }}
                          variant="contained"
                          size="small"
                        >
                          <HourglassTopRoundedIcon sx={{ mr: '3px' }} />
                          <Text fontSize="12px">Unbonding</Text>
                        </MainButtonNoShadow>
                      </HtmlTooltip>
                    ) : (
                      <Box width="100%" display="flex" justifyContent="center">
                        <Box
                          display={maxWidth460 ? 'flex' : 'block'}
                          width="100%"
                          justifyContent="center"
                        >
                          <Text mr={1}>Unbonding in:</Text>
                          <Box display="flex" alignItems="center">
                            <HourglassTopRoundedIcon
                              sx={{ fontSize: '1rem', marginRight: '3px' }}
                            />
                            <CountdownTimer
                              targetDate={NOW_IN_MS + withdrawal.seconds * 1000}
                            />
                          </Box>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              ))}
            </AccordionDetails>
          </Styled.UndelegationAccordion>
        ))
      )}
    </Styled.UndelegationContainer>
  );
};

export default ProvidersWithUndelegationDetails;
