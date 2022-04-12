import React from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { Ui } from '@elrondnetwork/dapp-utils';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button, Grid, IconButton } from '@mui/material';
import './styles/style.css';

const OrganizationTokensHeader = () => {
  return (
    <Grid
      container
      direction='row'
      justifyContent='space-between'
      alignItems='center'
    >
      <Grid className='d-flex align-items-center' item xs={4}>
        <IconButton>
          <ArrowBackIcon />
        </IconButton>
        <h4 className='mb-0'>Organization tokens</h4>
      </Grid>
      <Grid item xs={2} className='d-flex justify-content-end'>
        <Button color='warning' variant='contained'>
          {' '}
          + New Token
        </Button>
      </Grid>
    </Grid>
  );
};

export default OrganizationTokensHeader;
