import React, { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
// import '@/assets/sass/pages/decisions.scss';

const DecisionActions = () => {
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
        'd-flex flex-fill justify-content-center align-items-center flex-column'
      }
    >
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item lg={12} xs={12}>
          <Item sx={{ backgroundColor: 'unset' }} className='display-flex'>
            <div className='display-flex-center'>
              <button className='btn display-flex-center'>
                <ArrowBackIcon />
              </button>
              <p className={'h5 display-flex-center'}>{'Decisions overview'}</p>
            </div>
            <div>
              <button className='btn new-decision-btn address-btn d-flex flex-row align-items-center'>
                New decision
              </button>
            </div>
          </Item>
        </Grid>
      </Grid>
    </div>
  );
};

export default DecisionActions;
