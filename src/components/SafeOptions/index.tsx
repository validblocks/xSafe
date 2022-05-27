import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import './SafeOptions.scss';
import { useDispatch, useSelector } from 'react-redux';
import OtherSafe from 'assets/img/other-safe.png';
import Safe from 'assets/img/safe.png';
import addressShorthand from 'helpers/addressShorthand';
import {
  currencyConvertedSelector,
  selectedCurrencySelector
} from 'redux/selectors/currencySelector';
import { setProposeMultiselectSelectedOption } from 'redux/slices/modalsSlice';
import { ProposalsTypes } from 'types/Proposals';

const SafeOptions = ({ closeSafeDropdown }: any) => {
  const dispatch = useDispatch();
  const [shortAddress, setShortAddress] = useState('');
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  useEffect(() => {
    setShortAddress(addressShorthand);
  }, [addressShorthand]);

  const addSafe = () =>
    dispatch(
      setProposeMultiselectSelectedOption({
        option: ProposalsTypes.add_proposer
      })
    );

  const currencyConverted = useSelector(currencyConvertedSelector);
  const getCurrency = useSelector(selectedCurrencySelector);

  return (
    <Box
      className='safe-options-wrapper'
      // onBlur={() => {
      //   closeSafeDropdown(false);
      // }}
    >
      <Typography sx={{ p: 2 }} align='left'>
        Safe Options
      </Typography>
      <Divider />
      <Box sx={{ p: 2, pl: 0 }} className='add-safe-wrapper'>
        <Button onClick={addSafe} sx={{ color: '#4C2FFC' }}>
          <AddIcon sx={{ mr: 1 }} />
          Add a new safe
        </Button>
      </Box>
      <Divider />
      <Button sx={{ p: 0 }}>
        <Box sx={{ p: 1 }} className='d-flex align-items-center'>
          <img src={Safe} width='60px' height='60px' />
          <Box sx={{ ml: 2 }} className='active-wallet-wrapper'>
            <Typography align='left' className='bold'>
              My Safe
            </Typography>
            <Typography align='left'>{shortAddress}</Typography>
            <Typography align='left' className='bold'>
              ≈{currencyConverted.toFixed(2)}
              {getCurrency}
            </Typography>
          </Box>
          <Box>
            <Checkbox {...label} disabled checked />
          </Box>
        </Box>
      </Button>
      <Divider />
      <Button sx={{ p: 0 }}>
        <Box sx={{ p: 1 }} className='d-flex align-items-center'>
          <img src={OtherSafe} width='60px' height='60px' />
          <Box sx={{ ml: 2 }} className='inactive-wallet-wrapper'>
            <Typography align='left' className='bold'>
              My Other Safe
            </Typography>
            <Typography align='left'>{shortAddress}</Typography>
            <Typography align='left' className='bold'>
              14,590 USD
            </Typography>
          </Box>
        </Box>
      </Button>
    </Box>
  );
};

export default SafeOptions;
