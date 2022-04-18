import React from 'react';
import styled from '@emotion/styled';
import { Box, Grid } from '@mui/material';
import OrganizationContent from './OrganizationContent';
import OrganizationHeader from './OrganizationHeader';

const Organization = () => {
  return (
    <Box sx={{ padding: '8rem 1rem' }}>
      <Grid
        container
        direction='column'
        alignItems='center'
        justifyContent='flex-start'
      >
        <OrganizationHeader />
        <OrganizationContent />
      </Grid>
    </Box>
  );
};

export default Organization;
