import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import { useDispatch, useSelector } from 'react-redux';
import OtherSafe from 'assets/img/other-safe.png';
import Safe from 'assets/img/safe.png';
import { TypographyBold } from 'components/Theme/StyledComponents';
import addressShorthand from 'helpers/addressShorthand';
import {
  currencyConvertedSelector,
  selectedCurrencySelector
} from 'redux/selectors/currencySelector';
import { setProposeMultiselectSelectedOption } from 'redux/slices/modalsSlice';
import { ProposalsTypes } from 'types/Proposals';
import {
  ActiveWallet,
  AddSafe,
  AddSafeWrapper,
  InactiveWallet,
  SafeOptionsWrapper
} from './safe-style';

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
    <SafeOptionsWrapper
    // onBlur={() => {
    //   closeSafeDropdown(false);
    // }}
    >
      <Typography sx={{ p: 2 }} align='left'>
        Safe Options
      </Typography>
      <Divider />
      <AddSafeWrapper sx={{ p: 2, pl: 0 }}>
        <AddSafe onClick={addSafe}>
          <AddIcon sx={{ mr: 1 }} />
          Add a new safe
        </AddSafe>
      </AddSafeWrapper>
      <Divider />
      <Button sx={{ p: 0 }}>
        <Box sx={{ p: 1 }} className='d-flex align-items-center'>
          <img src={Safe} width='60px' height='60px' />
          <ActiveWallet sx={{ ml: 2 }}>
            <TypographyBold align='left'>My Safe</TypographyBold>
            <Typography align='left'>{shortAddress}</Typography>
            <TypographyBold align='left'>
              ≈{currencyConverted.toFixed(2)}
              {getCurrency}
            </TypographyBold>
          </ActiveWallet>
          <Box>
            <Checkbox {...label} disabled checked />
          </Box>
        </Box>
      </Button>
      <Divider />
      <Button sx={{ p: 0 }}>
        <Box sx={{ p: 1 }} className='d-flex align-items-center'>
          <img src={OtherSafe} width='60px' height='60px' />
          <InactiveWallet sx={{ ml: 2 }}>
            <TypographyBold align='left'>My Other Safe</TypographyBold>
            <Typography align='left'>{shortAddress}</Typography>
            <TypographyBold align='left'>14,590 USD</TypographyBold>
          </InactiveWallet>
        </Box>
      </Button>
    </SafeOptionsWrapper>
  );
};

export default SafeOptions;
