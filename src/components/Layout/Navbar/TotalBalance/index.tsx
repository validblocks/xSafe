import { useState, useEffect, useCallback } from 'react';
import { getNetworkProxy, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { operations } from '@elrondnetwork/dapp-utils';
import { Address } from '@elrondnetwork/erdjs/out';
import { Box } from '@mui/material';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { MainButton } from 'src/components/Theme/StyledComponents';
import { network, denomination, decimals } from 'src/config';
import { useOrganizationInfoContext } from 'src/pages/Organization/OrganizationInfoContextProvider';
import { TokenWithPrice } from 'src/pages/Organization/types';
import { organizationTokensSelector } from 'src/redux/selectors/accountSelector';
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
import { setMultisigBalance, setOrganizationTokens } from 'src/redux/slices/accountSlice';
import { CenteredText } from '../navbar-style';

type OrganizationToken = any;

const identifierWithoutUniqueHash = (identifier: string) => identifier.split('-')[0] ?? '';

function TotalBalance() {
  const dispatch = useDispatch();
  const proxy = getNetworkProxy();
  const { address } = useGetAccountInfo();
  const egldPrice = useSelector(priceSelector);
  const { tokenPrices } = useOrganizationInfoContext();
  const [totalUsdValue, setTotalUsdValue] = useState(0);
  const organizationTokens = useSelector(organizationTokensSelector);
  const currentContract = useSelector(currentMultisigContractSelector);

  const getTokenPrice = useCallback(
    (tokenIdentifier: string) => {
      if (!tokenIdentifier) return 0;

      console.log('searching for token price', tokenIdentifier);
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

  const getAllTokensAndEgldBalance = useCallback(async () => {
    const { egldBalance, otherTokens } = await getBalances();
    // eslint-disable-next-line consistent-return
    const allTokens = [
      { ...egldBalance.token, balance: egldBalance.value.toString() },
      ...otherTokens,
    ];

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

        console.log({ tokensWithPrices });
        dispatch(setMultisigBalance(JSON.stringify(egldBalance)));
        dispatch(setOrganizationTokens(tokensWithPrices));
      } catch (error) {
        console.log(error);
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
    if (!organizationTokens) return;
    organizationTokens.forEach((organizationToken: OrganizationToken) => {
      if (organizationToken.valueUsd) {
        arrayOfUsdValues.push(organizationToken.valueUsd);
      }

      if (organizationToken.identifier === 'EGLD') {
        egldTokenPrice = organizationToken.value?.tokenPrice ?? 0;
        egldTokensAmount = Number(organizationToken.value?.amount) ?? 0;

        const egldTotalPrice = egldTokenPrice * egldTokensAmount;
        console.log({ egldTotalPrice });

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
  }, [organizationTokens]);

  useEffect(() => {
    totalValue();
  }, [organizationTokens, totalValue]);

  useEffect(() => {
    dispatch(setValueInUsd(totalUsdValue));
  }, [dispatch, totalUsdValue]);

  const currencyConverted = useSelector(currencyConvertedSelector);

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
        py: 1,
        px: 2,
        display: { sm: 'block', xs: 'flex' },
        justifyContent: { sm: 'center', xs: 'space-around' },
      }}
    >
      <Box sx={{ width: { sm: '100%', xs: '50%' } }}>
        <CenteredText>Total balance:</CenteredText>
        <CenteredText fontSize="16px" fontWeight="bold">
          ≈{currencyConverted?.toFixed(2)}
          {getCurrency}
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
