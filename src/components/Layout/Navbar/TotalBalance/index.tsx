import { useCallback, useMemo, useEffect } from 'react';
import { getAccountBalance as getAccount } from '@multiversx/sdk-dapp/utils/account';
import {
  Box,
  CircularProgress,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import BoltIcon from '@mui/icons-material/Bolt';
import {
  AccountButton,
  NewTransactionButton,
} from 'src/components/Theme/StyledComponents';
import { OrganizationToken, TokenTableRowItem } from 'src/types/organization';
import { selectedCurrencySelector } from 'src/redux/selectors/currencySelector';
import {
  currentMultisigContractSelector,
  currentMultisigTransactionIdSelector,
} from 'src/redux/selectors/multisigContractsSelectors';
import { setValueInUsd } from 'src/redux/slices/currencySlice';
import {
  setProposeModalSelectedOption,
  setProposeMultiselectSelectedOption,
} from 'src/redux/slices/modalsSlice';
import {
  ModalTypes,
  ProposalsTypes,
} from 'src/types/multisig/proposals/Proposals';
import Divider from '@mui/material/Divider';
import {
  setOrganizationTokens,
  setTokenTableRows,
  setTotalUsdBalance,
} from 'src/redux/slices/accountGeneralInfoSlice';
import { MultiversxApiProvider } from 'src/services/MultiversxApiNetworkProvider';
import { useQuery, useQueryClient } from 'react-query';
import { QueryKeys } from 'src/react-query/queryKeys';
import { priceSelector } from 'src/redux/selectors/economicsSelector';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import useCurrencyConversion from 'src/hooks/useCurrencyConversion';
import { useOrganizationInfoContext } from 'src/components/Providers/OrganizationInfoContextProvider';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { CenteredText } from '../navbar-style';
import * as Styled from '../styled';
import { useSendTokenButtonMinWidth } from './useSendTokenButtonMinWidth';
import UnknownOwnerMobileWarning from './UnknownOwnerMobileWarning';
import { AccountBalanceWallet } from '@mui/icons-material';
import { useCustomTheme } from 'src/hooks/useCustomTheme';
import { TokenType } from '@multiversx/sdk-dapp/types/tokens.types';
import { Converters } from 'src/utils/Converters';
import BigNumber from 'bignumber.js';
import { useMultisigBalance } from 'src/hooks/useMultisigBalance';
import {
  useGetLoginInfo,
  useTrackTransactionStatus,
} from 'src/hooks/sdkDappHooks';

const identifierWithoutUniqueHash = (identifier: string) =>
  identifier?.split('-')[0] ?? '';
export const DECIMAL_POINTS_UI = 3;

const createEgldRow = (multisigEgldBalance: string, egldPrice: number) => {
  const multisigEgldBalanceBigNumber = new BigNumber(multisigEgldBalance);
  return {
    id: 'EGLD',
    tokenIdentifier: 'EGLD',
    identifier: 'EGLD',
    balance: multisigEgldBalanceBigNumber,
    presentation: {
      tokenIdentifier: 'EGLD',
      photoUrl: '',
    },
    balanceDetails: {
      identifier: 'EGLD',
      photoUrl: '',
      amount: multisigEgldBalanceBigNumber,
      decimals: 18,
    },
    value: {
      tokenPrice: new BigNumber(egldPrice),
      decimals: 18,
      amount: multisigEgldBalanceBigNumber,
    },
  };
};

const transformToken = (token: TokenType): TokenTableRowItem => {
  const { assets: _, ...rest } = token;
  return {
    ...rest,
    id: token.identifier,
    valueUsd: new BigNumber(token.valueUsd ?? 0),
    presentation: {
      tokenIdentifier: token.identifier,
      photoUrl: token.assets?.svgUrl ?? '',
    },
    balanceDetails: {
      photoUrl: token.assets?.svgUrl ?? '',
      identifier: identifierWithoutUniqueHash(token.identifier),
      amount: new BigNumber(token.balance ?? 0),
      decimals: token.identifier === 'EGLD' ? 18 : token.decimals ?? 18,
      tokenPrice: new BigNumber(token.price ?? 0),
    },
    value: {
      tokenPrice: new BigNumber(token.price ?? 0),
      decimals: token.identifier === 'EGLD' ? 18 : token.decimals ?? 18,
      amount: new BigNumber(token.balance ?? 0),
      photoUrl: token.assets?.svgUrl ?? '',
      identifier: token.identifier,
    },
  };
};

const createOrganizationToken = (
  token: TokenTableRowItem,
): OrganizationToken => {
  const denominatedAmountString = Converters.denominateWithNDecimals(
    BigNumber.isBigNumber(token.value.amount) ? token.value?.amount : 0,
    token.identifier === 'EGLD' ? 18 : token.value?.decimals ?? 18,
  );
  const denominatedAmountForCalcs = new BigNumber(denominatedAmountString);

  const priceAsBigNumber = token.value.tokenPrice;
  const totalUsdValue =
    token.balanceDetails && 'usdValue' in token.balanceDetails
      ? new BigNumber(token.balanceDetails.usdValue as string)
      : denominatedAmountForCalcs.times(priceAsBigNumber);

  return {
    prettyIdentifier: token.identifier?.split('-')[0] ?? '',
    identifier: token.identifier ?? '',
    photoUrl: token.balanceDetails?.photoUrl ?? '',
    tokenPrice: priceAsBigNumber,
    balanceLocaleString: Number(denominatedAmountForCalcs).toLocaleString('EN'),
    balance: denominatedAmountForCalcs,
    tokenValue: totalUsdValue,
    decimals: token.decimals ?? 18,
  };
};

function TotalBalance() {
  const theme = useCustomTheme();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { isLoggedIn } = useGetLoginInfo();
  const minWidth600 = useMediaQuery('(min-width:600px)');
  const maxWidth600 = useMediaQuery('(max-width:600px)');
  const { dynamicMinWidth } = useSendTokenButtonMinWidth();
  const { isInReadOnlyMode } = useOrganizationInfoContext();
  const selectedCurrency = useSelector(selectedCurrencySelector);

  const egldPrice = useSelector(priceSelector);

  const currentContract = useSelector(currentMultisigContractSelector);

  const getMultisigEsdts = useCallback(() => {
    console.log('getMultisigEsdts');
    return MultiversxApiProvider.getAddressTokens(currentContract?.address);
  }, [currentContract]);

  const getMultisigEgldBalance = useCallback(
    () => getAccount(currentContract?.address),
    [currentContract],
  );

  const fetchNFTs = useCallback(
    () => MultiversxApiProvider.fetchOrganizationNFTs(currentContract?.address),
    [currentContract],
  );

  const { refetch: refetchMultisigNfts } = useQuery(
    [QueryKeys.ALL_ORGANIZATION_NFTS],
    fetchNFTs,
    USE_QUERY_DEFAULT_CONFIG,
  );

  const { data: multisigEsdts, refetch: refetchMultisigEsdts } = useQuery(
    [QueryKeys.ADDRESS_ESDT_TOKENS],
    getMultisigEsdts,
    USE_QUERY_DEFAULT_CONFIG,
  );

  const { data: multisigEgldBalance, refetch: refetchMultisigEgldBalance } =
    useQuery([QueryKeys.ADDRESS_EGLD_TOKENS], getMultisigEgldBalance, {
      ...USE_QUERY_DEFAULT_CONFIG,
      enabled: !!multisigEsdts,
    });

  const { multisigTotalUsdValue } = useMultisigBalance();
  const multisigValueInSelectedCurrency = useCurrencyConversion(
    multisigTotalUsdValue.toNumber(),
  );

  // Remove live updates for now
  // useSocketSubscribe(SocketEvent.INVOLVED_IN_TX, () => {
  //   console.log('NEW TRANSACTIONS THROUGH WS!');
  //   refetchMultisigEsdts();
  //   refetchMultisigEgldBalance();
  //   refetchMultisigNfts();
  //   queryClient.invalidateQueries(QueryKeys.NFT_COUNT);
  // });

  const currentMultisigTransactionId = useSelector(
    currentMultisigTransactionIdSelector,
  );

  useTrackTransactionStatus({
    transactionId: currentMultisigTransactionId,
    onSuccess: () => {
      refetchMultisigEsdts();
      refetchMultisigEgldBalance();
      refetchMultisigNfts();
    },
  });

  useEffect(() => {
    if (!currentContract?.address) return;

    refetchMultisigEsdts();
    refetchMultisigEgldBalance();
    refetchMultisigNfts();
  }, [
    currentContract?.address,
    queryClient,
    refetchMultisigEsdts,
    refetchMultisigEgldBalance,
    refetchMultisigNfts,
  ]);

  const newTokensWithPrices = useMemo(() => {
    if (!multisigEsdts || !multisigEgldBalance) {
      return null;
    }

    const egldRow = createEgldRow(multisigEgldBalance, egldPrice);
    const allTokens = [egldRow, ...multisigEsdts.map(transformToken)];

    return allTokens;
  }, [multisigEsdts, multisigEgldBalance, egldPrice]);

  useEffect(() => {
    if (!currentContract?.address || !newTokensWithPrices) {
      return;
    }

    const safeTokens = newTokensWithPrices.map(createOrganizationToken);

    dispatch(setTokenTableRows(newTokensWithPrices));
    dispatch(setOrganizationTokens(safeTokens));
  }, [currentContract?.address, dispatch, newTokensWithPrices]);

  useEffect(() => {
    dispatch(setValueInUsd(multisigTotalUsdValue?.toNumber()));
    dispatch(setTotalUsdBalance(multisigTotalUsdValue.toNumber()));
  }, [dispatch, multisigTotalUsdValue]);

  const displayableTotalMultisigValue = useMemo(() => {
    return Number(
      parseFloat(multisigValueInSelectedCurrency.toFixed(2)),
    ).toLocaleString('EN');
  }, [multisigValueInSelectedCurrency]);

  const onNewTransactionClick = useCallback(
    () =>
      dispatch(
        setProposeMultiselectSelectedOption({
          option: ProposalsTypes.send_token,
        }),
      ),
    [dispatch],
  );

  const handleConnectClick = useCallback(() => {
    dispatch(
      setProposeModalSelectedOption({
        option: ModalTypes.connect_wallet,
      }),
    );
  }, [dispatch]);

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
      <Styled.TotalBalanceBox
        sx={{
          width: { sm: '100%', xs: '50%' },
          paddingLeft: minWidth600 ? '0' : '16px',
        }}
      >
        <CenteredText fontSize="14px">Your Total Balance:</CenteredText>
        <Box
          display="flex"
          alignItems="center"
          justifyContent={maxWidth600 ? 'start' : 'center'}
        >
          <AccountBalanceWallet
            sx={{
              color: theme.palette.text.primary,
              width: '1.25rem',
              marginRight: '0.25rem',
            }}
          />
          <CenteredText fontSize="16px" fontWeight="bolder">
            {Number.isNaN(displayableTotalMultisigValue) ? (
              <CircularProgress />
            ) : (
              `${
                isLoggedIn ? displayableTotalMultisigValue : 0
              } ${selectedCurrency}`
            )}
          </CenteredText>
        </Box>
      </Styled.TotalBalanceBox>
      <Divider
        orientation="vertical"
        flexItem
        sx={{ borderColor: '#9393931a !important' }}
      />
      <Box
        className="d-flex align-items-center"
        sx={{
          width: { sm: '100%', xs: '50%' },
          py: 1,
          pr: minWidth600 ? '0' : '16px',
          justifyContent: minWidth600 ? 'center' : 'flex-end',
        }}
      >
        {!isInReadOnlyMode ||
        (isLoggedIn &&
          (!currentContract?.address || currentContract?.address === '')) ? (
          <Box display="flex" alignItems="center">
            <NewTransactionButton
              variant="outlined"
              onClick={onNewTransactionClick}
              onKeyDown={(e) => e.preventDefault()}
              onKeyUp={(e) => e.preventDefault()}
              sx={{ minWidth: `${dynamicMinWidth}px !important` }}
              disabled={
                !currentContract?.address || currentContract?.address === ''
              }
            >
              Send Token
            </NewTransactionButton>
            <UnknownOwnerMobileWarning />
          </Box>
        ) : (
          <Text height={'40px'} display="flex" alignItems={'center'}>
            {isLoggedIn ? (
              currentContract?.address && currentContract?.address !== '' ? (
                'Read-Only Mode'
              ) : (
                <NewTransactionButton
                  variant="outlined"
                  onClick={onNewTransactionClick}
                  onKeyDown={(e) => e.preventDefault()}
                  onKeyUp={(e) => e.preventDefault()}
                  disabled
                >
                  Send Token
                </NewTransactionButton>
              )
            ) : (
              <AccountButton
                variant="outlined"
                onClick={handleConnectClick}
                size="large"
              >
                <Box className="d-flex">
                  <BoltIcon />
                  <Typography
                    sx={{ textTransform: isLoggedIn ? 'lowercase' : 'none' }}
                  >
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
