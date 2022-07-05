import React from 'react';
import { Card, Box } from '@mui/material';
import ProposersTable from './ProposersTable';

const CvorumContainer = () => (
  <Box>
    <Card className="px-4 py-5 mt-5">
      <div className="mb-4">
        <h2>Proposers</h2>
      </div>
      <ProposersTable />
    </Card>
  </Box>
);

export default CvorumContainer;
