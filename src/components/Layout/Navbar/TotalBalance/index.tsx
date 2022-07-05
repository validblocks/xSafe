import { useState, useEffect, useCallback } from 'react';
import { getNetworkProxy, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { operations } from '@elrondnetwork/dapp-utils';
import { Address } from '@elrondnetwork/erdjs/out';
import { Box } from '@mui/material';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { MainButton } from 'src/components/Theme/StyledComponents';
import { network } from 'src/config';
import { useOrganizationInfoContext } from 'src/pages/Organization/OrganizationInfoContextProvider';
import { TokenWithPrice } from 'src/pages/Organization/types';
import { organizationTokensSelector } from 'src/redux/selectors/accountSelector';
import {
  currencyConvertedSelector,
  selectedCurrencySelector,
} from 'src/redux/selectors/currencySelector';
import { priceSelector } from 'src/redux/selectors/economicsSelector';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import {
  setMultisigBalance,
} from 'src/redux/slices/accountSlice';
import { setValueInUsd } from 'src/redux/slices/currencySlice';
import { setProposeMultiselectSelectedOption } from 'src/redux/slices/modalsSlice';
import { ProposalsTypes } from 'src/types/Proposals';
import useCurrency from 'src/utils/useCurrency';
import Divider from '@mui/material/Divider';
import { CenteredText } from '../navbar-style';

type OrganizationToken = any;

const TotalBalance = () => {
  const dispatch = useDispatch();

  const [totalUsdValue, setTotalUsdValue] = useState(0);
  const organizationTokens = useSelector(organizationTokensSelector);
  const egldPrice = useSelector(priceSelector);

  const currentContract = useSelector(currentMultisigContractSelector);
  const { tokenPrices } = useOrganizationInfoContext();
  const { address } = useGetAccountInfo();
  const proxy = getNetworkProxy();
  const getTokenPrice = useCallback(
    (tokenIdentifier: string) =>
      tokenPrices.find(
        (tokenWithPrice: TokenWithPrice) =>
          tokenWithPrice.symbol === tokenIdentifier,
      )?.price ?? egldPrice,
    [],
  );
  const fetchTokenPhotoUrl = useCallback(async (tokenIdentifier: string) => {
    const { data } = await axios.get(
      `${network.apiAddress}/tokens/${tokenIdentifier}`,
    );

    return data.assets.pngUrl;
  }, []);

  useEffect(() => {
    if (!address || !currentContract?.address) return;
    // eslint-disable-next-line consistent-return, wrap-iife
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
        `${network.apiAddress}/accounts/${currentContract?.address}/tokens`,
      );

      try {
        const [{ balance: egldBalance }, { data: otherTokens }] =
          await Promise.all([getEgldBalancePromise, getAllOtherTokensPromise]);

        // eslint-disable-next-line consistent-return
        if (!isMounted) return;

        dispatch(setMultisigBalance(JSON.stringify(egldBalance)));

        const allTokens = [
          { ...egldBalance.token, balance: egldBalance.value.toString() },
          ...otherTokens,
        ];

        const tokensWithPrices = [];

        for (const [idx, token] of Object.entries(allTokens)) {
          const priceOfCurrentToken = getTokenPrice(token.identifier ?? '');

          const { _owner, ...tokenWithoutOwner } = token;

          let photoUrl = '';

          if (token.identifier !== 'EGLD') {
            // eslint-disable-next-line no-await-in-loop
            photoUrl = await fetchTokenPhotoUrl(token.identifier as string);
          }

          tokensWithPrices.push({
            ...tokenWithoutOwner,
            presentation: {
              tokenIdentifier: token.identifier,
              photoUrl,
            },
            id: idx,
            balanceDetails: {
              photoUrl,
              identifier: token.identifier?.split('-')[0] ?? '',
              amount: token.balance as string,
              decimals: token.decimals as number,
            },
            value: {
              tokenPrice: priceOfCurrentToken,
              decimals: token.decimals as number,
              amount: token.balance as string,
            },
          });
        }

        // dispatch(setOrganizationTokens(tokensWithPrices));
      } catch (error) {
        console.log(error);
      }
    })();
  }, [currentContract, address, currentContract.address]);

  const totalValue = () => {
    const arrayOfUsdValues: Array<number> = [];
    let egldTokenPrice: any = 0;
    let egldTokensAmount = 0;
    if (organizationTokens) {
      organizationTokens.forEach((el: OrganizationToken) => {
        if (el.valueUsd) {
          arrayOfUsdValues.push(el.valueUsd);
        }

        if (el.identifier === 'EGLD') {
          egldTokenPrice = el.value?.tokenPrice ? el.value?.tokenPrice : 0;
          egldTokensAmount = el.value?.amount ? Number(el.value?.amount) : 0;

          const egldTotalPrice = egldTokenPrice * egldTokensAmount;

          const denominatedEgldPrice = operations.denominate({
            input: egldTotalPrice.toString(),
            denomination: 18,
            decimals: 4,
            showLastNonZeroDecimal: true,
          });
          arrayOfUsdValues.push(Number(denominatedEgldPrice));
        }
      });
    }

    if (arrayOfUsdValues.length > 0) {
      setTotalUsdValue(
        arrayOfUsdValues.reduce((x: number, y: number) => x + y),
      );
    }
  };

  useEffect(() => {
    totalValue();
  }, []);

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
};
export default TotalBalance;
