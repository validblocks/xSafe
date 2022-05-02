import React, { useMemo } from 'react';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator
} from '@mui/lab';
import { Box, useMediaQuery } from '@mui/material';
import { makeStyles } from '@mui/styles';

const TransactionDescription = () => {
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
          gridRow: '1 / 2',
          gridColumn: '1 / 2'
          //   display: 'flex'
          //   flexDirection: 'column',
          //   justifyContent: 'center',
          //   height: '100%',
          //   position: 'relative'
        },
        child2: {
          gridRow: '1 / 3',
          gridColumn: '2 / 3'
          //   minHeight: '5.5rem'
        },
        child3: {
          gridRow: '2 / 3',
          gridColumn: '1 / 2'
        }
      }),
    [isSmallScreen]
  );

  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <Box className={classes.child1}>Child 1</Box>
      <Box className={classes.child2}>
        <Timeline position='right'>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>Eat</TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>Code</TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot />
            </TimelineSeparator>
            <TimelineContent>Sleep</TimelineContent>
          </TimelineItem>
        </Timeline>
      </Box>

      <Box className={classes.child3}>Child 3</Box>
    </Box>
  );
};

export default TransactionDescription;
