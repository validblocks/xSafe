import React from 'react';
import { Card, Box } from '@mui/material';
import ProposersTable from './ProposersTable';

const CvorumContainer = () => {
  return (
    <Box
      sx={{
        width: '100%',
        padding: '8rem 1rem',
        backgroundColor: '#F6F7F8'
      }}
    >
      <Card className='px-4 py-5 mt-5'>
        <div className='mb-4'>
          <h2>Proposers</h2>
        </div>
        <ProposersTable />
      </Card>
    </Box>
  );
};

export default CvorumContainer;
