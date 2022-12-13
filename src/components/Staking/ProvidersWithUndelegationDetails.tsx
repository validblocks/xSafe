import {
  GridExpandMoreIcon,
} from '@mui/x-data-grid';
import BigNumber from '@elrondnetwork/erdjs/node_modules/bignumber.js';
import { useMemo, useState } from 'react';
import { AccordionDetails, Box, Button, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import useProviderIdentitiesAfterSelection from 'src/utils/useProviderIdentitiesAfterSelection';
import { IDelegation, IdentityWithColumns, IUndelegatedFunds } from 'src/types/staking';
import { useQueryClient } from 'react-query';
import useReactQueryState from 'src/react-query/useReactQueryState';
import { QueryKeys } from 'src/react-query/queryKeys';
import { Address, BigUIntValue, TokenPayment } from '@elrondnetwork/erdjs/out';
import { getDenominatedBalance } from 'src/utils/balanceUtils';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import { useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { mutateSmartContractCall } from 'src/contracts/MultisigContract';
import ErrorOnFetchIndicator from '../Utils/ErrorOnFetchIndicator';
import LoadingDataIndicator from '../Utils/LoadingDataIndicator';
import ProviderColumn from './ProviderColumn';
import { WithdrawButton } from '../Theme/StyledComponents';
import TokenPresentationWithPrice from '../Utils/TokenPresentationWithPrice';
import { HtmlTooltip } from '../Utils/HtmlTooltip';
import CountdownTimer from '../Utils/CountdownTimer';
import * as Styled from './styled';
import { Text } from '../StyledComponents/StyledComponents';

interface Props {
    searchParam?: string;
}

const useStyles = makeStyles(() => ({
  expanded: { margin: 0 },
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
  const theme: any = useTheme();
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
            const amount = parseFloat(TokenPayment.egldFromBigInteger(undelegation.amount).toRationalNumber());
            return totalSum + amount;
          }, 0);

        const withdrawableUndelegations = delegation?.userUndelegatedList
          ?.filter((delegation: IUndelegatedFunds) => delegation.seconds === 0);

        const withdrawableUndelegationsAmount =
          withdrawableUndelegations?.reduce((totalSum: number, undelegation: IUndelegatedFunds) => {
            const amount = parseFloat(TokenPayment.egldFromBigInteger(undelegation.amount).toRationalNumber());
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
      ><LoadingDataIndicator dataName="withdrawal" />
      </Box>
    );
  }

  if (isErrorOnFetchingProviderIdentities) return <ErrorOnFetchIndicator dataName="provider" />;

  return (
    <Styled.UndelegationContainer
      maxHeight={rows.length <= 2 ? 271 : 310}
      minHeight={rows.length <= 2 ? 271 : 310}
      padding={rows.length <= 2 ? 0 : '38px 0'}
      justifyContent={rows.length <= 2 ? 'center' : 'flex-start'}
    >
      {rows.length === 0 ? (
        <Styled.NoUndelegationsTypography>No funds waiting to be withdrawn at this moment
        </Styled.NoUndelegationsTypography>
      ) : (rows.map((row) => (
        <Styled.UndelegationAccordion
          key={row.id}
          onChange={handleChange(row.identity)}
          expanded={expanded === row.identity}
        >
          <Styled.UndelegationAccordionSummary
            expandIcon={<GridExpandMoreIcon />}
            aria-controls="panel1a-content"
            classes={{
              content: classes.content,
              expanded: classes.expanded,
            }}
            id="panel1a-header"
            sx={{
              '& .MuiAccordionSummary-expandIconWrapper': {
                display: row.withdrawableUndelegationsAmount === row.totalRequestedUndelegations ? 'none' : 'flex',

              },
            }}
          >
            <Styled.UndelegationGridContainer
              container
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
                  <Text fontSize={12}><strong>Withdrawable:</strong></Text>
                </div>
                <div className="d-flex align-items-center mt-1">
                  <Text fontSize={12}>{row.withdrawableUndelegationsAmount} / {row.totalRequestedUndelegations} $EGLD</Text>
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
            </Styled.UndelegationGridContainer>
          </Styled.UndelegationAccordionSummary>
          <AccordionDetails sx={{ padding: '0', backgroundColor: theme.palette.background.accordion }}>
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
                      <Box><Text>Amount: {' '}</Text></Box>
                      <Box>
                        <Text>
                          {`${getDenominatedBalance(withdrawal.amount, {
                            precisionAfterComma: 2,
                          })} $EGLD`}
                        </Text>
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
        </Styled.UndelegationAccordion>
      )))}

    </Styled.UndelegationContainer>
  );
};

export default ProvidersWithUndelegationDetails;
