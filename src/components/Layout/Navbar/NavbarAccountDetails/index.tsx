import React, { useState, useEffect } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import NorthEastRoundedIcon from '@mui/icons-material/NorthEastRounded';
import { Box, Button, Typography } from '@mui/material';

const NavbarAccountDetails = ({ uniqueAddress }: any) => {
  return (
    <Box>
      <Box
        sx={{
          width: '50px',
          height: '50px',
          backgroundColor: '#000',
          margin: 'auto'
        }}
      ></Box>
      <Box sx={{ pt: 1 }}>
        <Typography align='center'>{uniqueAddress}</Typography>
      </Box>
      <Box className='d-flex justify-content-center' sx={{ pt: 1 }}>
        <a href='`https://explorer.elrond.com/${address}`'>
          <ContentCopyIcon />
        </a>
        <ExitToAppRoundedIcon />
      </Box>
      <Box sx={{ pt: 1 }}>
        <h5 className='ex-currency text-center'>199 USD</h5>
      </Box>
      <Box className='d-flex justify-content-center' sx={{ pb: 1 }}>
        <Button variant='contained'>
          <NorthEastRoundedIcon /> New Transaction
        </Button>
      </Box>
    </Box>
  );
};

export default NavbarAccountDetails;
