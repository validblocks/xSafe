import { useState, useEffect, useCallback } from 'react';
import { getNetworkProxy, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { operations } from '@elrondnetwork/dapp-utils';
import { Address, Token } from '@elrondnetwork/erdjs/out';
import { Box } from '@mui/material';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { MainButton } from 'src/components/Theme/StyledComponents';
import { network, denomination, decimals } from 'src/config';
import { useOrganizationInfoContext } from 'src/pages/Organization/OrganizationInfoContextProvider';
import { OrganizationToken, TokenTableRowItem, TokenWithPrice } from 'src/pages/Organization/types';
import { tokenTableRowsSelector } from 'src/redux/selectors/accountSelector';
import {
  currencyConvertedSelector,
  selectedCurrencySelector,
} from 'src/redux/selectors/currencySelector';
import { priceSelector } from 'src/redux/selectors/economicsSelector';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { setValueInUsd } from 'src/redux/slices/currencySlice';
import { setProposeMultiselectSelectedOption } from 'src/redux/slices/modalsSlice';
import { ProposalsTypes } from 'src/types/Proposals';
import useCurrency from 'src/utils/useCurrency';
import Divider from '@mui/material/Divider';
import { setMultisigBalance, setOrganizationTokens, setTokenTableRows, StateType } from 'src/redux/slices/accountSlice';
import { MultisigContractInfoType } from 'src/types/multisigContracts';
import { CenteredText } from '../navbar-style';

const identifierWithoutUniqueHash = (identifier: string) => identifier.split('-')[0] ?? '';
export const DECIMAL_POINTS_UI = 2;

function TotalBalance() {
  const dispatch = useDispatch();
  const proxy = getNetworkProxy();
  const { address } = useGetAccountInfo();
  const egldPrice = useSelector(priceSelector);
  const { tokenPrices } = useOrganizationInfoContext();
  const [totalUsdValue, setTotalUsdValue] = useState(0);
  const tokenTableRows = useSelector<StateType, TokenTableRowItem[]>(tokenTableRowsSelector);
  const currentContract = useSelector<StateType, MultisigContractInfoType>(currentMultisigContractSelector);

  const getTokenPrice = useCallback(
    (tokenIdentifier: string) => {
      if (!tokenIdentifier) return 0;

      return tokenPrices.find(
        (tokenWithPrice: TokenWithPrice) =>
          tokenWithPrice.id === tokenIdentifier,
      )?.price ?? egldPrice;
    },
    [egldPrice, tokenPrices],
  );
  const fetchTokenPhotoUrl = useCallback(async (tokenIdentifier: string) => {
    if (tokenIdentifier === 'EGLD') return '';

    const { data } = await axios.get(
      `${network.apiAddress}/tokens/${tokenIdentifier}`,
    );

    return data.assets.pngUrl;
  }, []);

  const getBalances = useCallback(async () => {
    const getEgldBalancePromise = proxy.getAccount(new Address(currentContract?.address));
    const getAllOtherTokensPromise = axios.get(
      `${network.apiAddress}/accounts/${currentContract?.address}/tokens`,
    );

    const [{ balance: egldBalance }, { data: otherTokens }] =
      await Promise.all([getEgldBalancePromise, getAllOtherTokensPromise]);

    return {
      egldBalance,
      otherTokens,
    };
  }, [currentContract, proxy]);

  const getAllTokensAndEgldBalance = useCallback(async (): Promise<{ allTokens: Token[], egldBalance: any }> => {
    const { egldBalance, otherTokens } = await getBalances();
    // eslint-disable-next-line consistent-return
    const allTokens = [
      { ...egldBalance.token, balance: egldBalance.value.toString() },
      ...otherTokens,
    ];

    console.log({ allTokens });

    return { allTokens, egldBalance };
  }, [getBalances]);

  const getTokensWithPrices = useCallback(async (allTokens: any[]) => {
    const tokensWithPrices = [];

    for (const [idx, token] of Object.entries(allTokens)) {
      const currentTokenPrice = getTokenPrice(token.identifier);

      delete token.owner;

      // eslint-disable-next-line no-await-in-loop
      const photoUrl = await fetchTokenPhotoUrl(token.identifier);

      tokensWithPrices.push({
        ...token,
        id: idx,
        presentation: {
          tokenIdentifier: token.identifier,
          photoUrl,
        },
        balanceDetails: {
          photoUrl,
          identifier: identifierWithoutUniqueHash(token.identifier),
          amount: token.balance as string,
          decimals: token.decimals as number,
        },
        value: {
          tokenPrice: currentTokenPrice,
          decimals: token.decimals as number,
          amount: token.balance as string,
        },
      });
    }
    return tokensWithPrices;
  }, [fetchTokenPhotoUrl, getTokenPrice]);

  useEffect(() => {
    let isMounted = true;
    if (!address || !currentContract?.address) {
      return () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        isMounted = false;
      };
    }
    (async function getTokens() {
      let isMounted = true;

      if (!currentContract?.address) {
        return () => {
          isMounted = false;
        };
      }

      try {
        const { egldBalance, allTokens } = await getAllTokensAndEgldBalance();
        const tokensWithPrices = await getTokensWithPrices(allTokens);

        if (!isMounted) {
          return () => {
            isMounted = false;
          };
        }

        const organizationTokens: OrganizationToken[] = tokensWithPrices.map(({
          identifier, balanceDetails, value }: TokenTableRowItem) => ({
          prettyIdentifier: identifier?.split('-')[0] ?? '',
          identifier: identifier ?? '',
          photoUrl: balanceDetails?.photoUrl ?? '',
          tokenPrice: `$${parseFloat(Number(value?.tokenPrice as string).toFixed(DECIMAL_POINTS_UI))}`,
          tokenAmount: `${parseFloat(
            Number(operations.denominate({
              input: value?.amount as string,
              denomination: balanceDetails?.decimals as number,
              decimals: balanceDetails?.decimals as number,
              showLastNonZeroDecimal: true,
            })).toFixed(DECIMAL_POINTS_UI),
          )}`,
          tokenValue: `$${parseFloat(
            Number(Number(operations.denominate({
              input: value?.amount as string,
              denomination: balanceDetails?.decimals as number,
              decimals: balanceDetails?.decimals as number,
              showLastNonZeroDecimal: true,
            })) * (value?.tokenPrice as number)).toFixed(DECIMAL_POINTS_UI),
          )}`,
        }));

        dispatch(setMultisigBalance(JSON.stringify(egldBalance)));
        dispatch(setTokenTableRows(tokensWithPrices));
        dispatch(setOrganizationTokens(organizationTokens));
      } catch (error) {
        console.error(error);
      }

      return true;
    }());

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return () => { isMounted = false; };
  }, [currentContract?.address, address, getAllTokensAndEgldBalance, getTokensWithPrices, dispatch]);

  const totalValue = useCallback(() => {
    const arrayOfUsdValues: number[] = [];
    let egldTokenPrice = 0;
    let egldTokensAmount = 0;
    if (!tokenTableRows) return;
    tokenTableRows.forEach((organizationToken: TokenTableRowItem) => {
      if (organizationToken.valueUsd) {
        arrayOfUsdValues.push(organizationToken.valueUsd);
      }

      if (organizationToken.identifier === 'EGLD') {
        egldTokenPrice = parseFloat(Number(organizationToken.value?.tokenPrice).toString()) ?? 0;
        egldTokensAmount = Number(organizationToken.value?.amount) ?? 0;

        const denominatedEgldPrice = parseFloat(operations.denominate({
          input: egldTokensAmount.toString(),
          denomination,
          decimals,
          showLastNonZeroDecimal: true,
        })) * egldTokenPrice;
        arrayOfUsdValues.push(Number(denominatedEgldPrice));
      }
    });

    if (arrayOfUsdValues.length > 0) {
      setTotalUsdValue(
        arrayOfUsdValues.reduce((x: number, y: number) => x + y),
      );
    }
  }, [tokenTableRows]);

  useEffect(() => {
    totalValue();
  }, [tokenTableRows, totalValue]);

  useEffect(() => {
    dispatch(setValueInUsd(totalUsdValue));
  }, [dispatch, totalUsdValue]);

  const currencyConverted = useSelector<StateType, number>(currencyConvertedSelector);

  const onAddBoardMember = () =>
    dispatch(
      setProposeMultiselectSelectedOption({
        option: ProposalsTypes.multiselect_proposal_options,
      }),
    );

  const getCurrency = useSelector(selectedCurrencySelector);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useCurrency(totalUsdValue, getCurrency, dispatch);
  }, [totalUsdValue]);

  return (
    <Box
      sx={{
        py: 2,
        px: 2,
        display: { sm: 'block', xs: 'flex' },
        justifyContent: { sm: 'center', xs: 'space-around' },
      }}
    >
      <Box sx={{ width: { sm: '100%', xs: '50%' } }}>
        <CenteredText fontSize="12px">Your Total Balance:</CenteredText>
        <CenteredText fontSize="16px" fontWeight="bold">
          {currencyConverted?.toFixed(2)} {getCurrency}
        </CenteredText>
      </Box>
      <Divider orientation="vertical" flexItem />
      <Box
        className="d-flex justify-content-center"
        sx={{ width: { sm: '100%', xs: '50%' }, py: 1 }}
      >
        <MainButton variant="outlined" onClick={onAddBoardMember}>
          New Transaction
        </MainButton>
      </Box>
    </Box>
  );
}
export default TotalBalance;
