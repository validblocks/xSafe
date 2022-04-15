import React, { useMemo } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useMediaQuery
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const WaitingActions = () => {
  const isSmallScreen = useMediaQuery('(max-width:850px)');

  const useStyles: CallableFunction = useMemo(
    () =>
      makeStyles({
        container: {
          width: '100%',
          display: 'grid',
          gridTemplateColumns: isSmallScreen ? '1fr' : '1fr 1fr',
          //   gridTemplateRows: isSmallScreen ? '' : 'repeat(3, 1fr)',
          gridGap: isSmallScreen ? '1.8rem' : '1.8rem 4rem',
          margin: '40px 0'
        },
        child1: {
          gridRow: '1 / 2',
          gridColumn: '1 / 2'
        },
        child2: {
          gridRow: isSmallScreen ? '2 / 3' : '1 / 2',
          gridColumn: isSmallScreen ? '1 / 2' : '2 / 3',

          'border-radius:': '4px'
        }
      }),
    [isSmallScreen]
  );

  return (
    <div className='shadow w-100 h-100 rounded'>
      <div className='d-flex align-items-center w-100 h-100 p-4'>
        <div className='col-6 d-flex flex-column justify-content-center align-items-start'>
          <h4>Actions needed</h4>
          <p>Decisions in your organization are waiting for your vote</p>
          <Button
            sx={{
              backgroundColor: '#17D297'
            }}
            variant='contained'
          >
            Review decisions
          </Button>
        </div>
        <div className='col-6 d-flex justify-content-center align-items-center'>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant='determinate'
              sx={{
                color: '#17D297',
                width: '150px !important',
                height: '150px !important'
              }}
              value={75}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography
                variant='h4'
                component='div'
                color='text.secondary'
              >{`${Math.round(75)}%`}</Typography>
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default WaitingActions;
