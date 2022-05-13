import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import './SafeOptions.scss';
import { useDispatch } from 'react-redux';
import OtherSafe from 'assets/img/other-safe.png';
import Safe from 'assets/img/safe.png';
import addressShorthand from 'helpers/addressShorthand';
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
  return (
    <Box
      className='safe-options-wrapper'
      onBlur={() => {
        closeSafeDropdown(false);
      }}
    >
      <Typography sx={{ p: 2 }} align='left'>
        Safe Options
      </Typography>
      <Divider />
      <Box sx={{ p: 2, pl: 0 }}>
        <Button onClick={addSafe} sx={{ pl: 0 }}>
          <AddIcon />
          Add a new safe
        </Button>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }} className='d-flex align-items-center'>
        <img src={Safe} width='60px' height='60px' />
        <Box sx={{ ml: 2 }}>
          <Typography align='left'>My Safe</Typography>
          <Typography align='left'>{shortAddress}</Typography>
          <Typography align='left'>14,590 USD</Typography>
        </Box>
        <Box>
          <Checkbox {...label} defaultChecked />
        </Box>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }} className='d-flex align-items-center'>
        <img src={OtherSafe} width='60px' height='60px' />
        <Box sx={{ ml: 2 }}>
          <Typography align='left'>My Other Safe</Typography>
          <Typography align='left'>{shortAddress}</Typography>
          <Typography align='left'>14,590 USD</Typography>
        </Box>
        <Box>
          <Checkbox {...label} />
        </Box>
      </Box>
    </Box>
  );
};

export default SafeOptions;
