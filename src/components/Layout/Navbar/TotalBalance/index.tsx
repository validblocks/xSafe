import { useState, useCallback, useMemo, useEffect } from 'react';
import { getAccountBalance as getAccount } from '@elrondnetwork/dapp-core/utils/account';
import { TokenPayment } from '@elrondnetwork/erdjs/out';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import BoltIcon from '@mui/icons-material/Bolt';
import { AccountButton, NewTransactionButton } from 'src/components/Theme/StyledComponents';
import { OrganizationToken, TokenTableRowItem } from 'src/pages/Organization/types';
import {
  selectedCurrencySelector,
} from 'src/redux/selectors/currencySelector';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { setValueInUsd } from 'src/redux/slices/currencySlice';
import { setProposeModalSelectedOption, setProposeMultiselectSelectedOption } from 'src/redux/slices/modalsSlice';
import { ProposalsTypes } from 'src/types/Proposals';
import Divider from '@mui/material/Divider';
import {
  setMultisigBalance,
  setOrganizationTokens,
  setTokenTableRows,
  setTotalUsdBalance,
  StateType,
} from 'src/redux/slices/accountGeneralInfoSlice';
import { MultisigContractInfoType } from 'src/types/multisigContracts';
import { ElrondApiProvider } from 'src/services/ElrondApiNetworkProvider';
import { useQuery, useQueryClient } from 'react-query';
import { QueryKeys } from 'src/react-query/queryKeys';
import { priceSelector } from 'src/redux/selectors/economicsSelector';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import useCurrencyConversion from 'src/utils/useCurrencyConversion';
import { useOrganizationInfoContext } from 'src/pages/Organization/OrganizationInfoContextProvider';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { useGetLoginInfo } from '@elrondnetwork/dapp-core/hooks';
import { CenteredText } from '../navbar-style';
import * as Styled from '../styled';

export const identifierWithoutUniqueHash = (identifier: string) => identifier?.split('-')[0] ?? '';
export const DECIMAL_POINTS_UI = 3;

function TotalBalance() {
  const dispatch = useDispatch();
  const [totalUsdValue, setTotalUsdValue] = useState(0);

  const currentContract = useSelector<StateType, MultisigContractInfoType>(currentMultisigContractSelector);

  const fetchAddressEsdts = useCallback(
    () => ElrondApiProvider.getAddressTokens(currentContract?.address),
    [currentContract],
  );

  const fetchAddressEgld = useCallback(
    () => getAccount(currentContract?.address),
    [currentContract],
  );

  const fetchNFTs = useCallback(
    () => ElrondApiProvider.fetchOrganizationNFTs(currentContract?.address),
    [currentContract],
  );

  const {
    data: _nftList,
    refetch: refetchNFTs,
  } = useQuery(
    [
      QueryKeys.ALL_ORGANIZATION_NFTS,
    ],
    fetchNFTs,
    {
      ...USE_QUERY_DEFAULT_CONFIG,
    },
  );

  const {
    data: addressTokens,
    refetch: refetchAddressTokens,
  } = useQuery(
    [
      QueryKeys.ADDRESS_ESDT_TOKENS,
    ],
    fetchAddressEsdts,
    {
      ...USE_QUERY_DEFAULT_CONFIG,
    },
  );

  const {
    data: egldBalanceDetails,
    refetch: refetchEgldBalaneDetails,
  } = useQuery(
    [
      QueryKeys.ADDRESS_EGLD_TOKENS,
    ],
    fetchAddressEgld,
    {
      ...USE_QUERY_DEFAULT_CONFIG,
      enabled: !!addressTokens,
      select: (data) => data,
    },
  );

  const queryClient = useQueryClient();
  const { isLoggedIn } = useGetLoginInfo();

  useEffect(() => {
    if (!currentContract?.address) return;

    refetchAddressTokens();
    refetchEgldBalaneDetails();
    refetchNFTs();
  }, [currentContract?.address, queryClient, refetchAddressTokens, refetchEgldBalaneDetails, refetchNFTs]);

  useEffect(() => {
    if (!addressTokens) return;
    refetchEgldBalaneDetails();
  }, [addressTokens, refetchEgldBalaneDetails]);

  const egldPrice = useSelector(priceSelector);

  const newTokensWithPrices = useMemo(() => {
    if (!addressTokens || !egldBalanceDetails) { return null; }
    const egldRow = {
      id: 'EGLD',
      tokenIdentifier: 'EGLD',
      identifier: 'EGLD',
      balance: egldBalanceDetails,
      presentation: {
        tokenIdentifier: 'EGLD',
        photoUrl: '',
      },
      balanceDetails: {
        identifier: 'EGLD',
        photoUrl: '',
        amount: egldBalanceDetails,
        decimals: 3,
      },
      value: {
        tokenPrice: egldPrice,
        decimals: 3,
        amount: egldBalanceDetails,
      },
    };
    // delete egldRow.owner;

    const allTokens = [egldRow, ...addressTokens?.map((token: any) => ({
      ...token,
      id: token.identifier,
      presentation: {
        tokenIdentifier: token.identifier,
        photoUrl: token.assets?.svgUrl,
      },
      balanceDetails: {
        photoUrl: token.assets?.svgUrl,
        identifier: identifierWithoutUniqueHash(token.identifier),
        amount: token.balance as string,
        decimals: token.decimals as number,
      },
      value: {
        tokenPrice: parseFloat(token.price?.toString()),
        decimals: token.decimals as number,
        amount: token.balance as string,
      },
    }))];

    return allTokens;
  }, [addressTokens, egldBalanceDetails, egldPrice]);

  useEffect(() => {
    if (
      !currentContract?.address
      || !newTokensWithPrices
      || !egldBalanceDetails
    ) {
      return;
    }

    (function getTokens() {
      let isMounted = true;

      if (!currentContract?.address || !newTokensWithPrices || !egldBalanceDetails || !isMounted) {
        return () => {
          isMounted = false;
        };
      }

      try {
        const organizationTokens: OrganizationToken[] = newTokensWithPrices.map(({
          identifier, balanceDetails, value }: TokenTableRowItem) => {
          const amountAsRationalNumber = TokenPayment.egldFromBigInteger(
            value?.amount as string,
          ).toRationalNumber();

          const denominatedAmountForCalcs = Number(amountAsRationalNumber);
          const priceAsNumber = value?.tokenPrice as number;
          const totalUsdValue = Number(Number(denominatedAmountForCalcs * priceAsNumber).toFixed(2));
          const tokenPrice = parseFloat(Number(priceAsNumber).toPrecision(4));

          return ({
            prettyIdentifier: identifier?.split('-')[0] ?? '',
            identifier: identifier ?? '',
            photoUrl: balanceDetails?.photoUrl ?? '',
            tokenPrice,
            tokenAmount: Number(denominatedAmountForCalcs).toLocaleString(),
            tokenValue: totalUsdValue,
          });
        });

        const persistedBalance = JSON.stringify(TokenPayment.egldFromBigInteger(egldBalanceDetails));

        dispatch(setMultisigBalance(persistedBalance));
        dispatch(setTokenTableRows(newTokensWithPrices));
        dispatch(setOrganizationTokens(organizationTokens));
      } catch (error) {
        console.error(error);
      }

      return true;
    }());
  }, [currentContract?.address, dispatch, egldBalanceDetails, newTokensWithPrices]);

  const totalValue = useCallback(() => {
    if (!newTokensWithPrices) return;

    const totalAssetsValue = newTokensWithPrices
      ?.reduce((acc: number, token: TokenTableRowItem) =>
        acc + (parseFloat(token?.valueUsd?.toString() ?? '0')), 0);

    const totalEgldValue = Number(
      TokenPayment.egldFromBigInteger(egldBalanceDetails ?? 0).toRationalNumber(),
    ) * egldPrice ?? '0';
    setTotalUsdValue(
      totalAssetsValue + totalEgldValue,
    );
    dispatch(setTotalUsdBalance(totalAssetsValue + totalEgldValue));
  }, [egldBalanceDetails, egldPrice, newTokensWithPrices]);

  useEffect(() => {
    if (!totalValue) return;
    totalValue();
  }, [totalValue]);

  useEffect(() => {
    dispatch(setValueInUsd(totalUsdValue));
  }, [dispatch, totalUsdValue]);

  const onNewTransactionClick = () =>
    dispatch(
      setProposeMultiselectSelectedOption({
        option: ProposalsTypes.send_token,
      }),
    );

  const getCurrency = useSelector(selectedCurrencySelector);
  const totalUsdValueConverted = useCurrencyConversion(totalUsdValue);

  const { isInReadOnlyMode } = useOrganizationInfoContext();
  const [multisigAllCoinsValue, setMultisigAllCoinsValue] = useState('0');

  useEffect(() => {
    const totalValue = (Number(parseFloat(totalUsdValueConverted.toFixed(2))).toLocaleString());
    setMultisigAllCoinsValue(totalValue);
  }, [totalUsdValueConverted]);

  const handleConnectClick = () => {
    dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.connect_wallet,
      }),
    );
  };

  return (
    <Box
      sx={{
        pt: 0.5,
        pb: 2,
        px: 2,
        display: { sm: 'block', xs: 'flex' },
        justifyContent: { sm: 'center', xs: 'space-around' },
      }}
    >
      <Styled.TotalBalanceBox sx={{ width: { sm: '100%', xs: '50%' } }}>
        <CenteredText fontSize="14px">Your Total Balance:</CenteredText>
        <CenteredText fontSize="16px" fontWeight="bolder">
          {
            Number.isNaN(multisigAllCoinsValue) ?
              <CircularProgress /> :
              `${isLoggedIn ? multisigAllCoinsValue : 0} ${getCurrency}`
          }
        </CenteredText>
      </Styled.TotalBalanceBox>
      <Divider orientation="vertical" flexItem />
      <Box
        className="d-flex justify-content-center align-items-center"
        sx={{ width: { sm: '100%', xs: '50%' }, py: 1 }}
      >
        {!isInReadOnlyMode ? (
          <NewTransactionButton variant="outlined" onClick={onNewTransactionClick}>
            Send Token
          </NewTransactionButton>
        ) : (
          <Text height={'40px'} display="flex" alignItems={'center'}>
            {isLoggedIn ? 'Read-Only Mode' : (
              <AccountButton
                variant="outlined"
                onClick={handleConnectClick}
                size="large"
              >
                <Box className="d-flex">
                  <BoltIcon />
                  <Typography sx={{ textTransform: isLoggedIn ? 'lowercase' : 'none' }}>
                    Connect
                  </Typography>
                </Box>
              </AccountButton>
            )}
          </Text>
        )}
      </Box>
    </Box>
  );
}
export default TotalBalance;
