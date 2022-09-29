import {
  GridExpandMoreIcon,
} from '@mui/x-data-grid';
import BigNumber from '@elrondnetwork/erdjs/node_modules/bignumber.js';
import { useMemo, useState } from 'react';
import { AccordionDetails, AccordionSummary, Box, Button, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import useProviderIdentitiesAfterSelection from 'src/utils/useProviderIdentitiesAfterSelection';
import { IDelegation, IdentityWithColumns, IUndelegatedFunds } from 'src/types/staking';
import { useQueryClient } from 'react-query';
import useReactQueryState from 'src/react-query/useReactQueryState';
import { QueryKeys } from 'src/react-query/queryKeys';
import { Address, Balance, BigUIntValue } from '@elrondnetwork/erdjs/out';
import { getDenominatedBalance } from 'src/utils/balanceUtils';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import { useTranslation } from 'react-i18next';
import { mutateSmartContractCall } from 'src/contracts/MultisigContract';
import ErrorOnFetchIndicator from '../Utils/ErrorOnFetchIndicator';
import LoadingDataIndicator from '../Utils/LoadingDataIndicator';
import ProviderColumn from './ProviderColumn';
import { TransactionAccordion } from '../StyledComponents/transactions';
import { WithdrawButton } from '../Theme/StyledComponents';
import TokenPresentationWithPrice from '../Utils/TokenPresentationWithPrice';
import { HtmlTooltip } from '../Utils/HtmlTooltip';
import CountdownTimer from '../Utils/CountdownTimer';

interface Props {
    searchParam?: string;
}

const useStyles = makeStyles(() => ({
  expanded: { margin: 0 },
  content: {
    margin: 0,
    display: 'flex',
    background: '#fff !important',

    justifyContent: 'space-between',
    '&$expanded': {
      margin: 0,
    },
  },
}));

const ProvidersWithUndelegationDetails = ({ searchParam }: Props) => {
  const config = useMemo(() => ({ searchParam }), [searchParam]);
  const { t } = useTranslation();

  const {
    fetchedProviderIdentities,
    isFetchingProviderIdentities,
    isLoadingProviderIdentities,
    isErrorOnFetchingProviderIdentities,
  } = useProviderIdentitiesAfterSelection(config);

  const classes = useStyles();
  const queryClient = useQueryClient();
  const { getStateByKey } = useReactQueryState(queryClient);
  const fetchedDelegations = getStateByKey(QueryKeys.FETCHED_DELEGATIONS) as IDelegation[];

  const rows = useMemo(() => {
    if (!fetchedProviderIdentities) return [];
    return fetchedProviderIdentities
      .filter((identity) => {
        const delegation = fetchedDelegations
          .find((delegation: IDelegation) => delegation.contract === identity.provider);

        if (!delegation) return false;

        return delegation.userUndelegatedList.length > 0;
      },
      )
      .map((providerIdentity: IdentityWithColumns) => {
        const delegation = fetchedDelegations
          .find((delegation: IDelegation) => delegation.contract === providerIdentity.provider);

        const totalRequestedUndelegations = delegation?.userUndelegatedList
          .reduce((totalSum: number, undelegation: IUndelegatedFunds) => {
            const amount = parseFloat(Balance.fromString(undelegation.amount).toDenominated());
            return totalSum + amount;
          }, 0);

        const withdrawableUndelegations = delegation?.userUndelegatedList
          ?.filter((delegation: IUndelegatedFunds) => delegation.seconds === 0);

        const withdrawableUndelegationsAmount =
          withdrawableUndelegations?.reduce((totalSum: number, undelegation: IUndelegatedFunds) => {
            const amount = parseFloat(Balance.fromString(undelegation.amount).toDenominated());
            return totalSum + amount;
          }, 0);

        const pendingWithdrawals = delegation?.userUndelegatedList
          .filter((delegation: IUndelegatedFunds) => delegation.seconds > 0);

        return {
          ...providerIdentity,
          totalRequestedUndelegations: getDenominatedBalance(totalRequestedUndelegations?.toString() ?? '0', {
            precisionAfterComma: 2, needsDenomination: false,
          }),
          withdrawableUndelegationsAmount: getDenominatedBalance(withdrawableUndelegationsAmount?.toString() ?? '0', {
            precisionAfterComma: 2, needsDenomination: false,
          }),
          pendingWithdrawals,
        };
      });
  }, [fetchedDelegations, fetchedProviderIdentities]);

  const [expanded, setExpanded] = useState<string | false>(false);
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const NOW_IN_MS = new Date().getTime();

  if (isFetchingProviderIdentities || isLoadingProviderIdentities) {
    return (
      <Box
        maxHeight={310}
        minHeight={310}
        sx={{ paddingTop: '2rem' }}
      ><LoadingDataIndicator dataName="provider" />
      </Box>
    );
  }

  if (isErrorOnFetchingProviderIdentities) return <ErrorOnFetchIndicator dataName="provider" />;

  return (
    <Box
      maxHeight={rows.length <= 2 ? 271 : 310}
      minHeight={rows.length <= 2 ? 271 : 310}
      padding={rows.length <= 2 ? 0 : '38px 0'}
      justifyContent={rows.length <= 2 ? 'center' : 'flex-start'}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        overflow: 'scroll',
        scrollSnapAlign: 'start',
        '& > .MuiPaper-root:last-child': {
          mb: '0 !important',
        },
      }}
    >
      {rows.length === 0 ? (
        <Typography
          sx={{
            width: '100%',
            mt: 'calc(50% - 100px)',
            color: 'gray',
            textAlign: 'center',
            fontSize: '22px',
          }}
        >You don't have any funds waiting to be withdrawn at this moment
        </Typography>
      ) : (rows.map((row) => (
        <TransactionAccordion
          key={Math.random()}
          sx={{
            margin: '0 0 12px 0 !important',
            width: '100%',
          }}
          onChange={handleChange(row.identity)}
          expanded={expanded === row.identity}
        >
          <AccordionSummary
            expandIcon={<GridExpandMoreIcon />}
            aria-controls="panel1a-content"
            classes={{
              content: classes.content,
              expanded: classes.expanded,
            }}
            id="panel1a-header"
            sx={{
              outline: 'none !important',
              flexWrap: 'wrap',
              '& .MuiAccordionSummary-expandIconWrapper': {
                width: '100% !important',
                display: row.withdrawableUndelegationsAmount === row.totalRequestedUndelegations ? 'none' : 'flex',
                justifyContent: 'center !important',
                alignItems: 'center !important',
                backgroundColor: '#F3F6FC',
                padding: '0.25rem',
              },
            }}
            className="pl-0 pr-0 m-0 d-flex"
          >
            <Grid
              container
              sx={{
                padding: '0.5rem 1.25rem 0.55rem',
                backgroundColor: '#F3F6FC',
                width: '100% !important',
                border: 'solid 1px #eee',
                borderRadius: '10px',
                transition: 'all .2s linear',
                ':hover': {
                  backgroundColor: '#ffff !important',
                  borderColor: '#4c2ffc',
                  boxShadow: 'inset 0px 0px 6px #4c2ffc2e !important',
                },
              }}
            >
              <Grid
                item
                xs={7}
                md={5}
                maxWidth={'50%'}
                overflow={'scroll'}
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                <ProviderColumn columnData={row.providerColumn} />
              </Grid>
              <Grid
                item
                xs={5}
                md={4}
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
                  <strong>Withdrawable:</strong>
                </div>
                <div className="d-flex align-items-center mt-1">
                  {row.withdrawableUndelegationsAmount} / {row.totalRequestedUndelegations} $EGLD
                </div>
              </Grid>
              <Grid item xs={12} md={3} display={'flex'} alignItems={'center'}>
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
                  disabled={row.withdrawableUndelegationsAmount === 0}
                  className="shadow-sm rounded mr-2"
                  onClick={() => {
                    mutateSmartContractCall(
                      new Address(row.provider),
                      new BigUIntValue(new BigNumber(0)),
                      'withdraw');
                  }}
                > Withdraw
                </WithdrawButton>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: '0', backgroundColor: '#F3F6FC' }}>
            {
                row.pendingWithdrawals?.map((withdrawal: IUndelegatedFunds) => (
                  <Box key={withdrawal.seconds} padding={'1rem'} display="flex" justifyContent={'space-between'}>
                    <Box>
                      <TokenPresentationWithPrice
                        identifier="EGLD"
                        withTokenAmount={false}
                        withTokenValue={false}
                      />
                    </Box>
                    <Box display="flex" alignItems="start" flexDirection={'column'}>
                      <Box>Amount: {' '}</Box>
                      <Box>
                        {`${getDenominatedBalance(withdrawal.amount, {
                          precisionAfterComma: 2,
                        })} $EGLD`}
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                    >
                      <HtmlTooltip
                        disableFocusListener
                        disableTouchListener
                        title={(
                          <Box display={'flex'}>
                            <CountdownTimer targetDate={NOW_IN_MS + withdrawal.seconds * 1000} />
                            <span className="ml-1">{t('left until unbonding ends') as string}</span>
                          </Box>
                        )}
                        placement="top"
                      >
                        <Button
                          sx={{
                            height: '30px',
                            textTransform: 'none',
                            cursor: 'auto !important',
                          }}
                          variant="contained"
                          size="small"
                        >
                          <AccessTimeRoundedIcon fontSize="small" sx={{ marginRight: '0.5rem' }} />
                          Wait
                        </Button>
                      </HtmlTooltip>
                    </Box>
                  </Box>
                ))
            }
          </AccordionDetails>

        </TransactionAccordion>
      )))}

    </Box>
  );
};

export default ProvidersWithUndelegationDetails;
