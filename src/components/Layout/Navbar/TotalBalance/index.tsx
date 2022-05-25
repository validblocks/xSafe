import React, { useState, useEffect, useCallback } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Box, Typography, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  currencyConvertedSelector,
  selectedCurrencySelector
} from 'redux/selectors/currencySelector';
import { setProposeMultiselectSelectedOption } from 'redux/slices/modalsSlice';
import { ProposalsTypes } from 'types/Proposals';
import './totalBalance.scss';

const TotalBalance = () => {
  const dispatch = useDispatch();

  const currencyConverted = useSelector(currencyConvertedSelector);

  const [selectedCurrency, setSelectedCurrency] = useState('');
  const setCurrency = (data: string) => {
    setSelectedCurrency(data);
  };
  const onAddBoardMember = () =>
    dispatch(
      setProposeMultiselectSelectedOption({
        option: ProposalsTypes.multiselect_proposal_options
      })
    );

  const getCurrency = useSelector(selectedCurrencySelector);

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
          ≈{currencyConverted?.toFixed(2)}
          {getCurrency}
        </Typography>
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
