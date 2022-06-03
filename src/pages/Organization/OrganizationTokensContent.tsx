import React from 'react';
import { Box } from '@mui/material';
import OrganizationsTokensTable from './OrganizationTokensTable';

const OrganizationTokensContent = () => {
  return (
    <Box className='d-flex flex-wrap pt-5 row '>
      <Box className='col-12'>
        <Box sx={{ padding: '2rem' }} className='shadow'>
          <h3 className='mb-4'>
            <strong>Manage Safe Owners</strong>
          </h3>
          <p>
            Add, remove and replace owners or rename existing owners. Owner
            names are only stored locally and never shared with Gnosis or any
            third parties.
          </p>
          <OrganizationsTokensTable />
        </Box>
      </Box>
    </Box>
  );
};

export default OrganizationTokensContent;
