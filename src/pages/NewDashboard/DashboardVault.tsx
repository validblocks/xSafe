import React, { useMemo } from 'react';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import { Box, useMediaQuery } from '@mui/material';
import { makeStyles } from '@mui/styles';

function DashboardVault() {
  const isSmallScreen = useMediaQuery('(max-width:850px)');

  const useStyles: CallableFunction = useMemo(
    () =>
      makeStyles({
        container: {
          height: '100%',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gridGap: '1rem'
        },
        child1: {
          gridRow: '1 / 3',
          gridColumn: '1 / 2',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%',
          position: 'relative'
        },
        child2: {
          gridRow: '1 / 2',
          gridColumn: '2 / 3',
          minHeight: '5.5rem'
        },
        child3: {
          gridRow: '2 / 3',
          gridColumn: '2 / 3'
        }
      }),
    [isSmallScreen]
  );

  const classes = useStyles();
  return (
    <div className='shadow w-100 h-100 rounded px-5 py-4'>
      <Box className={classes.container}>
        <Box className={classes.child1} id='vault-container'>
          <div className='d-flex flex-column justify-content-center h-100'>
            <h3>$2432,902.45</h3>
            <p className='mb-0'>Total estimated value</p>
          </div>
        </Box>
        <Box className={classes.child2}>
          <div
            style={{ backgroundColor: '#fcb35f28' }}
            className='shadow-sm w-100 h-100 rounded d-flex flex-column align-items-center justify-content-center'
          >
            <CalendarMonthRoundedIcon
              style={{ fontSize: '2rem', marginBottom: '5px' }}
              htmlColor='#edb636'
            />
            <p className='m-0 text-center' style={{ color: '#edb636' }}>
              Weekly Sales
            </p>
          </div>
        </Box>
        <Box className={classes.child3}>
          <div
            style={{ backgroundColor: '#F3FDFA' }}
            className='shadow-sm w-100 h-100 rounded d-flex flex-column align-items-center justify-content-center'
          >
            <PersonAddAltRoundedIcon
              style={{ fontSize: '2rem', marginBottom: '5px' }}
              htmlColor='#17D295'
            />
            <p className='m-0 text-center' style={{ color: '#17D295' }}>
              New Users
            </p>
          </div>
        </Box>
      </Box>
    </div>
  );
}

export default DashboardVault;
