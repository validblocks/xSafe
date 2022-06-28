import React from 'react';
import { Box, Grid } from '@mui/material';
import OrganizationContent from './OrganizationContent';
import OrganizationHeader from './OrganizationHeader';

function Organization() {
  return (
    <Box>
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
}

export default Organization;
