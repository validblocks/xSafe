import React, { useState, useEffect, useCallback } from 'react';
import { getNetworkProxy } from '@elrondnetwork/dapp-core';
import { operations, Ui } from '@elrondnetwork/dapp-utils';
import { Address } from '@elrondnetwork/erdjs/out';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Box, Typography, Button } from '@mui/material';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import ChangeCurrency from 'components/ChangeCurrency';
import { network } from 'config';
import { useOrganizationInfoContext } from 'pages/Organization/OrganizationInfoContextProvider';
import { TokenWithPrice } from 'pages/Organization/types';
import { organizationTokensSelector } from 'redux/selectors/accountSelector';
import { priceSelector } from 'redux/selectors/economicsSelector';
import { currentMultisigContractSelector } from 'redux/selectors/multisigContractsSelectors';
import {
  setMultisigBalance,
  setOrganizationTokens
} from 'redux/slices/accountSlice';
import { setProposeMultiselectSelectedOption } from 'redux/slices/modalsSlice';
import { ProposalsTypes } from 'types/Proposals';
import './totalBalance.scss';

const TotalBalance = () => {
  const dispatch = useDispatch();

  const [totalUsdValue, setTotalUsdValue] = useState(0);

  const organizationTokens = useSelector(organizationTokensSelector);
  const egldPrice = useSelector(priceSelector);

  const [openedCurencySelect, setOpenedCurencySelect] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const onAddBoardMember = () =>
    dispatch(
      setProposeMultiselectSelectedOption({
        option: ProposalsTypes.multiselect_proposal_options
      })
    );
  const currentContract = useSelector(currentMultisigContractSelector);
  const {
    tokenPrices,
    membersCountState: [membersCount]
  } = useOrganizationInfoContext();
  const proxy = getNetworkProxy();
  const getTokenPrice = useCallback(
    (tokenIdentifier: string) =>
      tokenPrices.find((tokenWithPrice: TokenWithPrice) => {
        return tokenWithPrice.symbol == tokenIdentifier;
      })?.price ?? egldPrice,
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

      if (!currentContract?.address)
        return () => {
          isMounted = false;
        };

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
            input: egldTotalPrice.toString(),
            denomination: 18,
            decimals: 4,
            showLastNonZeroDecimal: true
          });
          arrayOfUsdValues.push(Number(denominatedEgldPrice));
        }
      });
    }

    if (arrayOfUsdValues.length > 0) {
      setTotalUsdValue(
        arrayOfUsdValues.reduce((x: number, y: number) => x + y)
      );
    }
  };

  const closeCurrencyDropdown = (data: boolean) => {
    setOpenedCurencySelect(data);
  };

  const setCurrency = (data: string) => {
    setSelectedCurrency(data);
  };

  useEffect(() => {
    totalValue();
  }, []);

  return (
    <Box sx={{ pt: 1 }}>
      <Typography className='text-center total-balance-text'>
        Total balance:
      </Typography>
      <Box className='d-flex justify-content-center'>
        <Typography
          className='ex-currency text-center'
          sx={{ fontWeight: 'bold' }}
        >
          ≈{totalUsdValue.toFixed(2)}
          {selectedCurrency}
        </Typography>
        {openedCurencySelect === true && (
          <Box>
            <ArrowDropUpIcon
              onClick={() => {
                setOpenedCurencySelect(false);
              }}
            />
            <ChangeCurrency
              closeCurrencyDropdown={closeCurrencyDropdown}
              setCurrencyFromChild={setCurrency}
            />
          </Box>
        )}
        {openedCurencySelect === false && (
          <Box>
            <ArrowDropDownIcon
              onClick={() => {
                setOpenedCurencySelect(true);
              }}
            />
          </Box>
        )}
      </Box>
      <Box className='d-flex justify-content-center' sx={{ pb: 1 }}>
        <Button
          className='new-transfer-btn'
          variant='outlined'
          onClick={onAddBoardMember}
        >
          New Transaction
        </Button>
      </Box>
    </Box>
  );
};
export default TotalBalance;
