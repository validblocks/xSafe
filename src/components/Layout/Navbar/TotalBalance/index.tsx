import React, { useState, useEffect, useCallback } from 'react';
import { getNetworkProxy } from '@elrondnetwork/dapp-core';
import { operations, Ui } from '@elrondnetwork/dapp-utils';
import { Address } from '@elrondnetwork/erdjs/out';
import { Box, Typography, Button } from '@mui/material';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { MainButton } from 'components/Theme/StyledComponents';
import { network } from 'config';
import { useOrganizationInfoContext } from 'pages/Organization/OrganizationInfoContextProvider';
import { TokenWithPrice } from 'pages/Organization/types';
import { organizationTokensSelector } from 'redux/selectors/accountSelector';
import {
  currencyConvertedSelector,
  selectedCurrencySelector
} from 'redux/selectors/currencySelector';
import { priceSelector } from 'redux/selectors/economicsSelector';
import { currentMultisigContractSelector } from 'redux/selectors/multisigContractsSelectors';
import {
  setMultisigBalance,
  setOrganizationTokens
} from 'redux/slices/accountSlice';
import { setValueInUsd } from 'redux/slices/currencySlice';
import { setProposeMultiselectSelectedOption } from 'redux/slices/modalsSlice';
import { ProposalsTypes } from 'types/Proposals';
import useCurrency from 'utils/useCurrency';
import { CenteredText } from '../navbar-style';

function TotalBalance() {
  const dispatch = useDispatch();

  const [totalUsdValue, setTotalUsdValue] = useState(0);
  const organizationTokens = useSelector(organizationTokensSelector);
  const egldPrice = useSelector(priceSelector);

  const [selectedCurrency, setSelectedCurrency] = useState('');

  const currentContract = useSelector(currentMultisigContractSelector);
  const {
    tokenPrices,
    membersCountState: [membersCount]
  } = useOrganizationInfoContext();
  const proxy = getNetworkProxy();
  const getTokenPrice = useCallback(
    (tokenIdentifier: string) =>
      tokenPrices.find(
        (tokenWithPrice: TokenWithPrice) =>
          tokenWithPrice.symbol == tokenIdentifier
      )?.price ?? egldPrice,
    []
  );
  const fetchTokenPhotoUrl = useCallback(async (tokenIdentifier: string) => {
    const { data } = await axios.get(
      `${network.apiAddress}/tokens/${tokenIdentifier}`
    );

    return data.assets.pngUrl;
  }, []);

  useEffect(() => {
    (async function getTokens() {
      let isMounted = true;

      if (!currentContract?.address) {
        return () => {
          isMounted = false;
        };
      }

      const getEgldBalancePromise = currentContract?.address
        ? proxy.getAccount(new Address(currentContract?.address))
        : {};

      const getAllOtherTokensPromise = axios.get(
        `${network.apiAddress}/accounts/${currentContract?.address}/tokens`
      );

      try {
        const [{ balance: egldBalance }, { data: otherTokens }] =
          await Promise.all([getEgldBalancePromise, getAllOtherTokensPromise]);

        if (!isMounted) return;

        dispatch(setMultisigBalance(JSON.stringify(egldBalance)));

        const allTokens = [
          { ...egldBalance.token, balance: egldBalance.value.toString() },
          ...otherTokens
        ];

        const tokensWithPrices = [];

        for (const [idx, token] of Object.entries(allTokens)) {
          const priceOfCurrentToken = getTokenPrice(token.identifier ?? '');

          const { owner, ...tokenWithoutOwner } = token;

          let photoUrl = '';

          if (token.identifier !== 'EGLD')
            photoUrl = await fetchTokenPhotoUrl(token.identifier as string);

          tokensWithPrices.push({
            ...tokenWithoutOwner,
            presentation: {
              tokenIdentifier: token.identifier,
              photoUrl
            },
            id: idx,
            balanceDetails: {
              photoUrl,
              identifier: token.identifier?.split('-')[0] ?? '',
              amount: token.balance as string,
              decimals: token.decimals as number
            },
            value: {
              tokenPrice: priceOfCurrentToken,
              decimals: token.decimals as number,
              amount: token.balance as string
            }
          });
        }

        dispatch(setOrganizationTokens(tokensWithPrices));
      } catch (error) {
        console.log(error);
      }
    })();
  }, [currentContract]);

  const totalValue = () => {
    let isMounted = true;
    const arrayOfUsdValues: Array<number> = [];
    let egldTokenPrice: any = 0;
    let egldTokensAmount = 0;
    if (organizationTokens) {
      organizationTokens.map((el) => {
        if (el.valueUsd) {
          arrayOfUsdValues.push(el.valueUsd);
        }

        if (el.identifier === 'EGLD') {
          egldTokenPrice = el.value?.tokenPrice ? el.value?.tokenPrice : 0;
          egldTokensAmount = el.value?.amount ? Number(el.value?.amount) : 0;

          const egldTotalPrice = egldTokenPrice * egldTokensAmount;

          const denominatedEgldPrice = operations.denominate({
            input: egldTotalPrice.toString() ?? '0',
            denomination: 18,
            decimals: 4,
            showLastNonZeroDecimal: true
          });
          arrayOfUsdValues.push(Number(denominatedEgldPrice));
        }
      });
    }

    if (arrayOfUsdValues && arrayOfUsdValues.length > 0) {
      isMounted &&
        setTotalUsdValue(
          arrayOfUsdValues.reduce((x: number, y: number) => x + y)
        );
    }

    return () => {
      isMounted = false;
    };
  };

  useEffect(() => {
    totalValue();
  }, []);

  useEffect(() => {
    dispatch(setValueInUsd(totalUsdValue));
  }, [totalUsdValue]);

  const currencyConverted = useSelector(currencyConvertedSelector);

  const onAddBoardMember = () =>
    dispatch(
      setProposeMultiselectSelectedOption({
        option: ProposalsTypes.multiselect_proposal_options
      })
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
        justifyContent: { sm: 'center', xs: 'space-around' }
      }}
    >
      <Box sx={{ width: { sm: '100%', xs: '50%' } }}>
        <CenteredText>Total balance:</CenteredText>
        <CenteredText fontSize='16px' fontWeight='bold'>
          ≈{currencyConverted?.toFixed(2)}
          {getCurrency}
        </CenteredText>
      </Box>
      <Divider orientation='vertical' flexItem />
      <Box
        className='d-flex justify-content-center'
        sx={{ width: { sm: '100%', xs: '50%' }, py: 1 }}
      >
        <MainButton variant='outlined' onClick={onAddBoardMember}>
          New Transaction
        </MainButton>
      </Box>
    </Box>
  );
}
export default TotalBalance;
