import React, { useState, useEffect, useCallback } from 'react';
import { getNetworkProxy } from '@elrondnetwork/dapp-core';
import { operations, Ui } from '@elrondnetwork/dapp-utils';
import { Address } from '@elrondnetwork/erdjs/out';
import { Box, Typography, Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import ChangeCurrency from 'components/ChangeCurrency';
import ThemeColor from 'components/ThemeColor';
import { network } from 'config';
import { useOrganizationInfoContext } from 'pages/Organization/OrganizationInfoContextProvider';
import { TokenWithPrice } from 'pages/Organization/types';
import { organizationTokensSelector } from 'redux/selectors/accountSelector';
import { priceSelector } from 'redux/selectors/economicsSelector';
import { currentMultisigContractSelector } from 'redux/selectors/multisigContractsSelectors';
import { safeNameStoredSelector } from 'redux/selectors/safeNameSelector';
import {
  setMultisigBalance,
  setOrganizationTokens
} from 'redux/slices/accountSlice';
import { setSafeName } from 'redux/slices/safeNameSlice';

const SafeSettings = () => {
  const dispatch = useDispatch();

  const [totalUsdValue, setTotalUsdValue] = useState(0);

  const organizationTokens = useSelector(organizationTokensSelector);
  const safeName = useSelector(safeNameStoredSelector);
  useEffect(() => {
    setName(safeName);
  }, [safeName]);
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

  const setCurrency = (data: string) => {
    setSelectedCurrency(data);
  };

  useEffect(() => {
    totalValue();
  }, []);

  const [name, setName] = React.useState('');

  const changeSafeName = (event: any) => {
    setName(event.target.value);
  };

  const saveUpdates = () => {
    dispatch(setSafeName(name));
  };

  return (
    <Box>
      <Typography sx={{ mb: 1, fontSize: '18px' }} className='bold-text'>
        Your safe name:
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Here you can change the name of your Safe.
      </Typography>
      <Typography sx={{ mb: 3 }} className='note-wrapper'>
        <span>
          <span className='bold-text'>Note:</span>This name is only stored
          locally. (You&apos;re the only one who&apos;s seeing it)
        </span>
      </Typography>
      <TextField
        id='outlined-basic'
        label='Safe Name'
        variant='outlined'
        onChange={changeSafeName}
        value={name}
        sx={{ width: 250 }}
      />
      <Typography sx={{ mb: 1, mt: 2, fontSize: '18px' }} className='bold-text'>
        Default Currency
      </Typography>

      <Typography sx={{ mb: 2 }}>
        Pick a default currency for your Safe.
      </Typography>
      <ChangeCurrency setCurrencyFromChild={setCurrency} test={totalUsdValue} />
      <Typography sx={{ mb: 1, mt: 2, fontSize: '18px' }} className='bold-text'>
        Appearance
      </Typography>

      <Typography sx={{ mb: 2 }}>
        You can choose between a dark and a light theme.
      </Typography>
      <ThemeColor />
      <Button
        className='new-transfer-btn'
        variant='outlined'
        sx={{ display: 'block', mt: 5 }}
        onClick={saveUpdates}
      >
        Save Updates
      </Button>
    </Box>
  );
};

export default SafeSettings;
