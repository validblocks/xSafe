import React from 'react';
import { Card, Grid } from '@mui/material';
import ProposersTable from './ProposersTable';

const CvorumContainer = () => {
  return (
    <Grid
      direction='column'
      container
      className='shadow overflow-hidden p-5 rounded '
    >
      <Card className='px-4 py-5 mt-5'>
        <div className='mb-4'>
          <h2>Proposers</h2>
        </div>
        <ProposersTable />
      </Card>
    </Grid>
  );
};

export default CvorumContainer;
