import React, { useMemo } from 'react';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator
} from '@mui/lab';
import { Box, useMediaQuery } from '@mui/material';
import { makeStyles } from '@mui/styles';

type Props = Partial<{
  description: React.ReactNode;
}>;

const TransactionDescription = ({ description }: Props) => {
  const isSmallScreen = useMediaQuery('(max-width:850px)');

  const useStyles: CallableFunction = useMemo(
    () =>
      makeStyles({
        container: {
          height: '100%',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gridTemplateRows: '1fr 1fr'
        },
        child1: {
          gridRow: '1 / 2',
          gridColumn: '1 / 2',
          borderBottom: '2px solid #eee'
        },
        child2: {
          gridRow: '1 / 3',
          gridColumn: '2 / 3',
          borderLeft: '2px solid #eee',
          padding: '1rem 2rem'
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
      <Box sx={{ padding: '2rem' }} className={classes.child1}>
        {description}
      </Box>
      <Box className={classes.child2}>
        <Timeline position='right'>
          <TimelineItem>
            <TimelineOppositeContent sx={{ display: 'none' }} />
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>Eat</TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent sx={{ display: 'none' }} />
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>Code</TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent sx={{ display: 'none' }} />
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
