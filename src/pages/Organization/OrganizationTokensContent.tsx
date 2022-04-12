import React from 'react';
import { Box } from '@mui/material';
import OrganizationsTokensTable from './OrganizationTokensTable';
import OwnershipDistribution from './OwnershipDistribution';

const OrganizationTokensContent = () => {
  return (
    <Box className='d-flex flex-wrap pt-5'>
      <Box className='col-12 col-md-8 p-0 pr-md-4'>
        <Box sx={{ padding: '2rem' }} className='shadow'>
          <h3 className='mb-4'>
            <strong>Holders</strong>
          </h3>
          <OrganizationsTokensTable />
        </Box>
      </Box>
      <Box className='col-12 col-md-4 p-0 pl-md-4 mt-5 mt-md-0'>
        <Box sx={{ padding: '2rem' }} className='shadow'>
          <OwnershipDistribution />
        </Box>
      </Box>
    </Box>
  );
};

export default OrganizationTokensContent;
