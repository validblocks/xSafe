import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Looks3OutlinedIcon from '@mui/icons-material/Looks3Outlined';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import DecisionsActionsCards from 'components/DecisionsComponents/decisionsActionsCards';
import CircularStatic from 'components/ProgressBar/progressCircle';
import LinearWithValueLabel from 'components/ProgressBar/progressLinear';

const Decisions = () => {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    boxShadow: 'unset'
  }));

  return (
    <div
      className={
        'd-flex flex-fill justify-content-center align-items-center flex-column decisions-wrapper'
      }
    >
      <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
        <Grid item lg={12} xs={12}>
          <Item sx={{ backgroundColor: 'unset' }}>
            <div
              style={{
                display: 'inline-block',
                float: 'left'
              }}
            >
              <button className='btn address-btn btn-light d-flex flex-row align-items-center inline-class'>
                <ArrowBackIcon />
              </button>
              <p className={'h5 inline-class back-btn-txt'}>
                {'Decisions overview'}
              </p>
            </div>
            <div
              style={{
                display: 'inline-block',
                float: 'right'
              }}
            >
              <button className='btn new-decision-btn address-btn d-flex flex-row align-items-center'>
                <AddIcon /> New decision
              </button>
            </div>
          </Item>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item md={6} xs={12}>
          <Item sx={{ height: '200px', padding: '30px' }}>
            <div className='inline-class circular-bar'>
              <CircularStatic />
            </div>
            <div className='inline-class circle-bar-txt'>
              <Typography align='left' variant='h5'>
                Actions needed
              </Typography>
              <Typography align='left' variant='inherit'>
                Decisions inside organization are waiting for your vote
              </Typography>
            </div>
          </Item>
        </Grid>
        <Grid item md={6} xs={12}>
          <Item sx={{ height: '200px', padding: '30px' }}>
            <Typography className='inline-class'>Payments</Typography>
            <LinearWithValueLabel />
            <Typography className='inline-class'>Organization</Typography>
            <LinearWithValueLabel />
            <Typography className='inline-class'>Tokens</Typography>
            <LinearWithValueLabel />
          </Item>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={0}
        alignItems='center'
        justifyContent='center'
        sx={{ marginBottom: '20px' }}
      >
        <Grid item md={5} xs={12} sx={{ marginTop: '20px' }}>
          <Grid md={6} xs={12} className='decision-state'>
            <Item className='decision-item'>
              Open decisions <Looks3OutlinedIcon />
            </Item>
          </Grid>
          <Grid md={6} xs={12} className='decision-state'>
            <Item className='decision-item'>
              Closed decisions <Looks3OutlinedIcon />
            </Item>
          </Grid>
        </Grid>
      </Grid>
      <DecisionsActionsCards />
    </div>
  );
};

export default Decisions;
