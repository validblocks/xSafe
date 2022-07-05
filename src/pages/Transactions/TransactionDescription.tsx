import React, { useEffect, useMemo, useState } from 'react';
import { Address } from '@elrondnetwork/erdjs/out';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import { useOrganizationInfoContext } from 'pages/Organization/OrganizationInfoContextProvider';
import { truncateInTheMiddle } from 'utils/addressUtils';
import TransactionTechnicalDetails from './TransactionTechnicalDetails';

type Props = Partial<{
  description: React.ReactNode;
  transaction: any;
  boardMembers: Address[];
  signers: Address[];
}>;

const StyledConnector = withStyles({ root: { backgroundColor: '#4c2ffc' } })(
  TimelineConnector,
);

const StyledDot = withStyles({ root: { backgroundColor: '#4c2ffc' } })(
  TimelineDot,
);

const StyledStatusText = withStyles({
  root: { color: '#4c2ffc', marginTop: '2px' },
})(Typography);

const TransactionDescription = ({
  description,
  transaction,
  signers = [],
}: Props) => {
  const isSmallScreen = useMediaQuery('(max-width:850px)');

  const useStyles: CallableFunction = useMemo(
    () => makeStyles({
      container: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
      },
      child1: {
        gridRow: '1 / 2',
        gridColumn: '1 / 2',
        borderBottom: '2px solid #ddd',
        minHeight: '12rem',
      },
      child2: {
        gridRow: '1 / 3',
        gridColumn: '2 / 3',
        borderLeft: '2px solid #ddd',
        padding: '1rem 2rem',
      },
      child3: {
        gridRow: '2 / 3',
        gridColumn: '1 / 2',
      },
    }),
    [isSmallScreen],
  );

  const {
    quorumCountState: [quorumCount],
  } = useOrganizationInfoContext();

  const [allSigners, setAllSigners] = useState([] as Address[]);

  useEffect(() => {
    const newSigners = [...signers];
    if (transaction) newSigners.push(new Address(transaction.sender));
    setAllSigners(newSigners);
  }, []);

  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <Box sx={{ padding: '2rem' }} className={classes.child1}>
        {description ?? 'Child1'}
      </Box>
      <Box className={classes.child2}>
        <Timeline position="right">
          <TimelineItem>
            <TimelineOppositeContent sx={{ display: 'none' }} />
            <TimelineSeparator>
              <StyledDot />
              <StyledConnector />
            </TimelineSeparator>
            <TimelineContent>
              <StyledStatusText>Created</StyledStatusText>
            </TimelineContent>
          </TimelineItem>

          {allSigners.map((signer: Address, idx: number) => (
            <TimelineItem key={signer.hex()}>
              <TimelineOppositeContent sx={{ display: 'none' }} />
              <TimelineSeparator>
                <StyledDot />
                <StyledConnector />
              </TimelineSeparator>
              <TimelineContent>
                <StyledStatusText>Signed by:</StyledStatusText>
                <div className="d-flex align-items-center">
                  <img
                    className="mr-3 rounded"
                    src="https://picsum.photos/30/30?random=1"
                  />
                  <div>
                    <div>{truncateInTheMiddle(signer.bech32(), 10)}</div>
                    <div>@herotag</div>
                  </div>
                </div>
                <Typography className="mt-2">
                  {idx + 1}
                  {' '}
                  out of
                  {quorumCount}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ))}

          <TimelineItem>
            <TimelineOppositeContent sx={{ display: 'none' }} />
            <TimelineSeparator>
              <TimelineDot
                sx={{
                  backgroundColor:
                    transaction?.status === 'success' ? '#4c2ffc' : 'grey',
                }}
                variant={
                  transaction?.status === 'success' ? 'filled' : 'outlined'
                }
              />
            </TimelineSeparator>
            <TimelineContent>
              <StyledStatusText>Executed</StyledStatusText>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </Box>

      <Box sx={{ width: '100%' }} className={classes.child3}>
        <TransactionTechnicalDetails transaction={transaction} />
      </Box>
    </Box>
  );
};

export default TransactionDescription;
