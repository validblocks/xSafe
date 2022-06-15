import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LanIcon from '@mui/icons-material/Lan';
import { Grid, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const DecisionsActionsHeader = () => (
  <Grid container>
    <Grid
      container
      sx={{ mb: 2 }}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box className="d-flex">
        <Link to="/decisions">
          <button className="btn">
            <ArrowBackIcon />
          </button>
        </Link>
        <h4 className="mt-2 pl-3">Decisions overview</h4>
      </Box>
      <Box>
        <button className="btn new-decision-btn address-btn flex-row align-items-center">
          <LanIcon />
          {' '}
          Organization
        </button>
      </Box>
    </Grid>
  </Grid>
);

export default DecisionsActionsHeader;
