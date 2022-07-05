import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Grid } from '@mui/material';

const DecisionsHeader = () => (
  <Grid container>
    <Grid
      container
      sx={{ mb: 2 }}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box className="d-flex">
        <button className="btn">
          <ArrowBackIcon />
        </button>
        <h4 className="mt-3 pl-3">Decisions overview</h4>
      </Box>
      <Box>
        <button className="btn new-decision-btn address-btn flex-row align-items-center">
          <AddIcon />
          {' '}
          New decision
        </button>
      </Box>
    </Grid>
  </Grid>
);

export default DecisionsHeader;
