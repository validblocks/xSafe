import React, { useEffect, useState } from 'react';
import Looks3OutlinedIcon from '@mui/icons-material/Looks3Outlined';
import { Grid, Box } from '@mui/material';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const DecisionsStatus = () => {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    boxShadow: 'unset'
  }));

  return (
    <Grid
      container
      spacing={0}
      sx={{ mb: 2 }}
      className='align-items-center justify-content-center'
    >
      <Grid item md={5} xs={12} className='d-flex' sx={{ p: 3, mt: 2 }}>
        <Grid md={6} xs={12}>
          <Item sx={{ p: 3 }}>
            Open decisions <Looks3OutlinedIcon />
          </Item>
        </Grid>
        <Grid md={6} xs={12}>
          <Item sx={{ p: 3 }}>
            Closed decisions <Looks3OutlinedIcon />
          </Item>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DecisionsStatus;
