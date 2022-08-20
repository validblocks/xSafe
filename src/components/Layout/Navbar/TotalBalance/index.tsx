import { useState, useCallback, useMemo } from 'react';
import { getNetworkProxy, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { Address, Balance } from '@elrondnetwork/erdjs/out';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { NewTransactionButton } from 'src/components/Theme/StyledComponents';
import { OrganizationToken, TokenTableRowItem } from 'src/pages/Organization/types';
import { tokenTableRowsSelector } from 'src/redux/selectors/accountSelector';
import {
  currencyConvertedSelector,
  selectedCurrencySelector,
} from 'src/redux/selectors/currencySelector';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { setValueInUsd } from 'src/redux/slices/currencySlice';
import { setProposeMultiselectSelectedOption } from 'src/redux/slices/modalsSlice';
import { ProposalsTypes } from 'src/types/Proposals';
import useCurrency from 'src/utils/useCurrency';
import Divider from '@mui/material/Divider';
import { setMultisigBalance, setOrganizationTokens, setTokenTableRows, StateType } from 'src/redux/slices/accountSlice';
import { MultisigContractInfoType } from 'src/types/multisigContracts';
import { operations } from '@elrondnetwork/dapp-utils';
import { ElrondApiProvider } from 'src/services/ElrondApiNetworkProvider';
import { useEffectDebugger } from 'src/utils/useEffectDebugger';
import { useQuery } from 'react-query';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import { QueryKeys } from 'src/react-query/queryKeys';
import { priceSelector } from 'src/redux/selectors/economicsSelector';
import { CenteredText } from '../navbar-style';

const identifierWithoutUniqueHash = (identifier: string) => identifier?.split('-')[0] ?? '';
export const DECIMAL_POINTS_UI = 3;

function TotalBalance() {
  const dispatch = useDispatch();
  const proxy = getNetworkProxy();
  const { address } = useGetAccountInfo();
  const [totalUsdValue, setTotalUsdValue] = useState(0);
  const tokenTableRows = useSelector<StateType, TokenTableRowItem[]>(tokenTableRowsSelector);
  const currentContract = useSelector<StateType, MultisigContractInfoType>(currentMultisigContractSelector);

  const {
    data: addressTokens,
  } = useQuery(
    [
      QueryKeys.ADDRESS_TOKENS,
    ],
    () => ElrondApiProvider.getAddressTokens(currentContract?.address),
    {
      ...USE_QUERY_DEFAULT_CONFIG,
      keepPreviousData: true,
      refetchOnMount: false,
    },
  );

  const {
    data: egldBalanceDetails,
  } = useQuery(
    [
      'EGLD_TOKENS',
    ],
    () => proxy.getAccount(new Address(currentContract?.address)),
    {
      ...USE_QUERY_DEFAULT_CONFIG,
      keepPreviousData: true,
      refetchOnMount: false,
      select: (data) => data.balance,
    },
  );

  // const {
  //   data: addressTokensWithDetails,
  // } = useQuery(
  //   [
  //     'QueryKeys.ADDRESS_TOKENS_DETAILS',
  //   ],
  //   () => ElrondApiProvider.getTokenDetailsForIdentifiers(
  //     addressTokens.map((token: Token) => token.identifier),
  //   ),
  //   {
  //     ...USE_QUERY_DEFAULT_CONFIG,
  //     keepPreviousData: true,
  //     refetchOnMount: false,
  //     enabled: !!addressTokens,
  //   },
  // );

  console.log({ addressTokens });
  console.log({ egldBalanceDetails });

  const egldPrice = useSelector(priceSelector);

  const newTokensWithPrices = useMemo(() => {
    if (!addressTokens || !egldBalanceDetails) { return null; }
    const allTokens = addressTokens?.map((token: any) => ({
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
        tokenPrice: parseFloat(token.price.toString()),
        decimals: token.decimals as number,
        amount: token.balance as string,
      },
    }));

    allTokens.push({
      id: 'EGLD',
      tokenIdentifier: egldBalanceDetails?.token.identifier ?? 'EGLD',
      ...egldBalanceDetails?.token,
      balance: egldBalanceDetails?.value.toString(),
      presentation: {
        tokenIdentifier: egldBalanceDetails?.token.identifier,
        photoUrl: '',
      },
      balanceDetails: {
        identifier: 'EGLD',
        amount: egldBalanceDetails?.token.balance as string,
        decimals: egldBalanceDetails?.token.decimals as number,
      },
      value: {
        tokenPrice: egldPrice,
        decimals: egldBalanceDetails?.token.decimals as number,
        amount: egldBalanceDetails?.token.balance as string,
      },
    });

    return allTokens;
  }, [addressTokens, egldBalanceDetails, egldPrice]);

  console.log('totalBalance');

  useEffectDebugger(() => {
    let isMounted = true;
    if (
      !address
      || !currentContract?.address
      || !newTokensWithPrices
    ) {
      return () => {
        isMounted = false;
      };
    }

    (async function getTokens() {
      let isMounted = true;

      if (!currentContract?.address || !isMounted) {
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

        console.log({ newTokensWithPrices });

        dispatch(setMultisigBalance(JSON.stringify(egldBalanceDetails)));
        dispatch(setTokenTableRows(newTokensWithPrices));
        dispatch(setOrganizationTokens(organizationTokens));
      } catch (error) {
        console.error(error);
      }

      return true;
    }());

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return () => { isMounted = false; };
  }, [currentContract?.address, address, dispatch, newTokensWithPrices]);

  const totalValue = useCallback(() => {
    if (!newTokensWithPrices) return;

    // const arrayOfUsdValues: number[] = [];
    // let egldTokenPrice = 0;
    // let egldTokensAmount = 0;
    // tokenTableRows.forEach((organizationToken: TokenTableRowItem) => {
    //   if (organizationToken.valueUsd) {
    //     arrayOfUsdValues.push(organizationToken.valueUsd);
    //   }

    //   if (organizationToken.identifier === 'EGLD') {
    //     egldTokenPrice = parseFloat(Number(organizationToken.value?.tokenPrice).toString()) ?? 0;
    //     egldTokensAmount = Number(organizationToken.value?.amount) ?? 0;

    //     const denominatedEgldPrice = Number(
    //       Balance.fromString(egldTokensAmount.toString()).toDenominated(),
    //     ) * egldTokenPrice;
    //     arrayOfUsdValues.push(Number(denominatedEgldPrice));
    //   }
    // });

    const totalAssetsValue = newTokensWithPrices
      ?.reduce((acc: number, token: TokenTableRowItem) =>
        acc + (parseFloat(token?.valueUsd?.toString() ?? '0')), 0);

    console.log({ totalAssetsValue });
    setTotalUsdValue(
      totalAssetsValue,
    );
  }, [newTokensWithPrices]);

  useEffectDebugger(() => {
    if (!tokenTableRows || !totalValue) return;
    totalValue();
  }, [tokenTableRows, totalValue], ['tokenTableRows', 'totalValue']);

  useEffectDebugger(() => {
    dispatch(setValueInUsd(totalUsdValue));
  }, [dispatch, totalUsdValue], ['dispatch', 'totalUsdValue']);

  const currencyConverted = useSelector<StateType, number>(currencyConvertedSelector);
  console.log({ currencyConverted });
  const onAddBoardMember = () =>
    dispatch(
      setProposeMultiselectSelectedOption({
        option: ProposalsTypes.multiselect_proposal_options,
      }),
    );

  const getCurrency = useSelector(selectedCurrencySelector);

  useEffectDebugger(() => {
    console.log({ totalUsdValue });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useCurrency(totalUsdValue, getCurrency, dispatch);
  }, [dispatch, getCurrency, totalUsdValue], ['dispatch', 'getCurrency', 'totalUsdValue']);

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
          {currencyConverted?.toFixed(2)} {getCurrency}
        </CenteredText>
      </Box>
      <Divider orientation="vertical" flexItem />
      <Box
        className="d-flex justify-content-center"
        sx={{ width: { sm: '100%', xs: '50%' }, py: 1 }}
      >
        <NewTransactionButton variant="outlined" onClick={onAddBoardMember}>
          New Transaction
        </NewTransactionButton>
      </Box>
    </Box>
  );
}
export default TotalBalance;
