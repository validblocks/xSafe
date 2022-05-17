import React, { useState, useEffect } from 'react';
import { operations, Ui } from '@elrondnetwork/dapp-utils';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ChangeCurrency from 'components/ChangeCurrency';
import { organizationTokensSelector } from 'redux/selectors/accountSelector';

const TotalBalance = () => {
  const [totalUsdValue, setTotalUsdValue] = useState(0);

  const organizationTokens = useSelector(organizationTokensSelector);

  const [openedCurencySelect, setOpenedCurencySelect] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

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
      <Typography className='text-center'>Total balance:</Typography>
      <Box className='d-flex justify-content-center'>
        <h5 className='ex-currency text-center'>
          ≈{totalUsdValue.toFixed(2)}
          {selectedCurrency}
        </h5>
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
    </Box>
  );
};
export default TotalBalance;
