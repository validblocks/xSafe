import React from 'react';
import { Box } from '@mui/material';
import OrganizationsTokensTable from './OrganizationTokensTable';

const OrganizationTokensContent = () => {
  return (
    <Box className='d-flex flex-wrap'>
      <Box className='col-12'>
        <h3 className='mb-4'>
          <strong>Manage Safe Owners</strong>
        </h3>
        <p>
          Add, remove and replace owners or rename existing owners. Owner names
          are only stored locally and never shared with us or any third parties.
        </p>
        <Box sx={{ padding: '2rem' }} className='shadow'>
          <OrganizationsTokensTable />
        </Box>
      </Box>
    </Box>
  );
};

export default OrganizationTokensContent;
