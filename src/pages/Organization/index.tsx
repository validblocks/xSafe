import React from 'react';
import styled from '@emotion/styled';
import { Grid } from '@mui/material';
import OrganizationContent from './OrganizationContent';
import OrganizationHeader from './OrganizationHeader';

const OrganizationContainer = styled.div`
  padding: 4rem;
`;

const Organization = () => {
  return (
    <OrganizationContainer>
      <Grid
        container
        direction='column'
        alignItems='center'
        justifyContent='flex-start'
      >
        <OrganizationHeader />
        <OrganizationContent />
      </Grid>
    </OrganizationContainer>
  );
};

export default Organization;
