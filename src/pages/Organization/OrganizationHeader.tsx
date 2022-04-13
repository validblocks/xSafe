import React from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { Ui } from '@elrondnetwork/dapp-utils';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Grid, IconButton } from '@mui/material';
import './styles/style.css';

const OrganizationHeader = () => {
  const { address } = useGetAccountInfo();

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
        <h4 className='mb-0'>Organization structure</h4>
      </Grid>
      <Grid item xs={4}>
        <Grid
          className='rounded bg-light pa-1'
          container
          justifyContent='space-between'
          alignItems='center'
        >
          <Grid item xs={2}>
            <img
              className='rounded'
              src='https://picsum.photos/30/30?random=1'
            />
          </Grid>
          <Grid item xs={8}>
            <span className='address'>
              <Ui.Trim text={address} />
            </span>
          </Grid>
          <Grid item xs={2}>
            <div className='wallet-info__copy d-flex justify-content-end'>
              <IconButton
                onClick={() => {
                  navigator.clipboard.writeText(address);
                }}
                component='span'
              >
                <ContentCopyIcon />
              </IconButton>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default OrganizationHeader;
