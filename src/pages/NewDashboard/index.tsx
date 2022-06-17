import { useMemo } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { makeStyles } from '@mui/styles';
import AvailableDashboardActions from './AvailableDashboardActions';
import DashboardVault from './DashboardVault';
import WaitingActions from './WaitingActions';

const NewDashboard = () => {
  const isSmallScreen = useMediaQuery('(max-width:850px)');

  const useStyles: CallableFunction = useMemo(
    () =>
      makeStyles({
        container: {
          width: '100%',
          display: 'grid',
          gridTemplateColumns: isSmallScreen ? '1fr' : '1fr 1fr',
          gridGap: isSmallScreen ? '1.8rem' : '1.8rem 4rem',
          margin: '40px 0',
        },
        child1: {
          gridRow: '1 / 2',
          gridColumn: '1 / 2',
        },
        child2: {
          gridRow: isSmallScreen ? '2 / 3' : '1 / 2',
          gridColumn: isSmallScreen ? '1 / 2' : '2 / 3',

          'border-radius:': '4px',
        },
      }),
    [isSmallScreen],
  );

  const classes = useStyles();
  return (
    <Box sx={{ padding: '2rem 6rem' }}>
      <h2>
        <strong>Dashboard</strong>
      </h2>
      <Box className={classes.container}>
        <Box className={classes.child1}>
          <DashboardVault />
        </Box>
        <Box className={classes.child2}>
          <WaitingActions />
        </Box>
      </Box>
      <AvailableDashboardActions />
    </Box>
  );
};

export default NewDashboard;
