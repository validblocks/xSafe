import React from 'react';
import { Box } from '@mui/material';
import OrganizationTokensContent from './OrganizationTokensContent';
import OrganizationTokensHeader from './OrganizationTokensHeader';

const OrganizationTokens = () => {
  return (
    <Box>
      <OrganizationTokensHeader />
      <OrganizationTokensContent />
    </Box>
  );
};

export default OrganizationTokens;
