import React from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { Ui } from '@elrondnetwork/dapp-utils';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button, Grid, IconButton } from '@mui/material';
import './styles/style.css';
import { useDispatch } from 'react-redux';
import { setProposeModalSelectedOption } from 'redux/slices/modalsSlice';
import { ProposalsTypes } from 'types/Proposals';

const OrganizationTokensHeader = () => {
  const dispatch = useDispatch();
  const onIssueToken = () =>
    dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.issue_token
      })
    );
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
        <Button onClick={onIssueToken} color='warning' variant='contained'>
          {' '}
          + New Token
        </Button>
      </Grid>
    </Grid>
  );
};

export default OrganizationTokensHeader;
