import { useState, useCallback, useMemo, useEffect } from 'react';
import { getNetworkProxy } from '@elrondnetwork/dapp-core';
import { Address, Balance } from '@elrondnetwork/erdjs/out';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { NewTransactionButton } from 'src/components/Theme/StyledComponents';
import { OrganizationToken, TokenTableRowItem } from 'src/pages/Organization/types';
import {
  selectedCurrencySelector,
} from 'src/redux/selectors/currencySelector';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { setValueInUsd } from 'src/redux/slices/currencySlice';
import { setProposeMultiselectSelectedOption } from 'src/redux/slices/modalsSlice';
import { ProposalsTypes } from 'src/types/Proposals';
import Divider from '@mui/material/Divider';
import { setMultisigBalance, setOrganizationTokens, setTokenTableRows, StateType } from 'src/redux/slices/accountSlice';
import { MultisigContractInfoType } from 'src/types/multisigContracts';
import { operations } from '@elrondnetwork/dapp-utils';
import { ElrondApiProvider } from 'src/services/ElrondApiNetworkProvider';
import { useQuery } from 'react-query';
import { QueryKeys } from 'src/react-query/queryKeys';
import { priceSelector } from 'src/redux/selectors/economicsSelector';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import useCurrencyConversion from 'src/utils/useCurrencyConversion';
import { isInReadOnlyModeSelector } from 'src/redux/selectors/accountSelector';
import { CenteredText } from '../navbar-style';

export const identifierWithoutUniqueHash = (identifier: string) => identifier?.split('-')[0] ?? '';
export const DECIMAL_POINTS_UI = 3;

function TotalBalance() {
  const dispatch = useDispatch();
  const proxy = getNetworkProxy();
  const [totalUsdValue, setTotalUsdValue] = useState(0);

  const currentContract = useSelector<StateType, MultisigContractInfoType>(currentMultisigContractSelector);

  const fetchAddressEsdts = useCallback(
    () => ElrondApiProvider.getAddressTokens(currentContract?.address),
    [currentContract, currentContract?.address],
  );

  const fetchAddressEgld = useCallback(
    () => proxy.getAccount(new Address(currentContract?.address)),
    [currentContract, currentContract?.address, proxy],
  );

  // const queryClient = useQueryClient();
  // useEffect(() => {
  //   queryClient.invalidateQueries(QueryKeys.ADDRESS_ESDT_TOKENS);
  // }, [currentContract]);

  console.log('rendering total balance', currentContract?.address);

  const {
    data: addressTokens,
  } = useQuery(
    [
      QueryKeys.ADDRESS_ESDT_TOKENS,
    ],
    fetchAddressEsdts,
    {
      ...USE_QUERY_DEFAULT_CONFIG,
      refetchOnReconnect: true,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
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
      refetchOnReconnect: true,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      enabled: !!addressTokens,
      select: (data) => data.balance,
    },
  );

  console.log({ addressTokens });
  useEffect(() => {
    if (!addressTokens) return;
    refetchEgldBalaneDetails();
  }, [addressTokens, refetchEgldBalaneDetails]);

  const egldPrice = useSelector(priceSelector);

  const newTokensWithPrices = useMemo(() => {
    if (!addressTokens || !egldBalanceDetails) { return null; }
    const egldRow = {
      id: 'EGLD',
      ...egldBalanceDetails?.token,
      tokenIdentifier: egldBalanceDetails?.token.identifier ?? 'EGLD',
      balance: egldBalanceDetails?.value?.toString(),
      presentation: {
        tokenIdentifier: egldBalanceDetails?.token.identifier,
        photoUrl: '',
      },
      balanceDetails: {
        identifier: 'EGLD',
        photoUrl: '',
        amount: egldBalanceDetails?.value?.toString(),
        decimals: egldBalanceDetails?.token.decimals as number,
      },
      value: {
        tokenPrice: egldPrice,
        decimals: egldBalanceDetails?.token.decimals as number,
        amount: egldBalanceDetails?.value?.toString(),
      },
    };
    delete egldRow.owner;

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
    console.log('enter useE');
    if (
      !currentContract?.address
      || !newTokensWithPrices
      || !egldBalanceDetails
    ) {
      console.log('returning in use effect');
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
          const balance = Balance.fromString(value?.amount as string).toString();

          const amountAfterDenomination = operations.denominate({
            input: balance,
            denomination: balanceDetails?.decimals as number,
            decimals: balanceDetails?.decimals as number,
            showLastNonZeroDecimal: true,
          });

          const denominatedAmountForCalcs = Number(amountAfterDenomination.replaceAll(',', ''));
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

        const persistedBalance = JSON.stringify(egldBalanceDetails);

        console.log('setting TTR ', newTokensWithPrices);
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

    const totalEgldValue = Number(egldBalanceDetails?.toDenominated()) * egldPrice ?? '0';
    setTotalUsdValue(
      totalAssetsValue + totalEgldValue,
    );
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
        option: ProposalsTypes.multiselect_proposal_options,
      }),
    );

  const getCurrency = useSelector(selectedCurrencySelector);
  const totalUsdValueConverted = useCurrencyConversion(totalUsdValue);

  const isInReadOnlyMode = useSelector(isInReadOnlyModeSelector);

  console.log({ isInReadOnlyMode });

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
      <Box sx={{ width: { sm: '100%', xs: '50%' } }}>
        <CenteredText fontSize="14px">Your Total Balance:</CenteredText>
        <CenteredText fontSize="16px" fontWeight="bolder">
          {(Number(parseFloat(totalUsdValueConverted.toFixed(2))).toLocaleString())} {getCurrency}
        </CenteredText>
      </Box>
      <Divider orientation="vertical" flexItem />
      {!isInReadOnlyMode && (
      <Box
        className="d-flex justify-content-center"
        sx={{ width: { sm: '100%', xs: '50%' }, py: 1 }}
      >
        <NewTransactionButton variant="outlined" onClick={onNewTransactionClick}>
          New Transaction
        </NewTransactionButton>
      </Box>
      )}
    </Box>
  );
}
export default TotalBalance;
