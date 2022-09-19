import { useCallback, useMemo, useState } from 'react';
import { Address } from '@elrondnetwork/erdjs/out';
import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
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
import { useOrganizationInfoContext } from 'src/pages/Organization/OrganizationInfoContextProvider';
import TransactionTechnicalDetails from 'src/pages/Transactions/TransactionTechnicalDetails';
import MemberPresentationWithPhoto from '../Organization/MemberPresentationWithPhoto';

type Props = Partial<{
  description: React.ReactNode;
  transaction: any;
  action: any;
  boardMembers: Address[];
  signers: Address[];
  child1?: React.ReactElement;
  child2?: React.ReactElement;
  bottomLeftChild?: React.ReactElement;
}>;

const StyledDot = withStyles({ root: { backgroundColor: '#4c2ffc' } })(
  TimelineDot,
);

const StyledStatusText = withStyles({
  root: { color: '#4c2ffc', marginTop: '10px' },
})(Typography);

function TransactionDescription({
  transaction,
  action,
  signers = [],
  child1,
  child2,
  bottomLeftChild,
}: Props) {
  const isSmallScreen = useMediaQuery('(max-width:850px)');

  const useStyles: CallableFunction = useMemo(
    () =>
      makeStyles({
        container: {
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
        },
        child1: {
          gridRow: '1 / 2',
          gridColumn: '1 / 2',
          borderTop: '1px solid #D6DAF1',
          minWidth: '90%',
          padding: '2rem',
        },
        child2: {
          gridRow: '1 / 3',
          gridColumn: '2 / 3',
          borderLeft: '1px solid #D6DAF1',
          borderTop: '1px solid #D6DAF1',
          padding: '1rem 2rem',
          minWidth: '33%',
        },
      }),
    [isSmallScreen],
  );

  const classes = useStyles();
  const dotIconStyles = { width: '15px', height: '15px' };

  const [areAllSignersVisible, setShowAllSigners] = useState(false);

  const {
    quorumCountState: [quorumCount],
  } = useOrganizationInfoContext();

  const toggleSignerVisibilityButtonText = useMemo(() =>
    (areAllSignersVisible ? 'Hide all' : 'Show all'),
  [areAllSignersVisible],
  );

  const toggleShowAllSigners = useCallback(() => {
    setShowAllSigners((areVisible) => !areVisible);
  }, [areAllSignersVisible]);

  return (
    <Box className={classes.container}>
      <Box className={classes.child1}>
        <Box sx={{ marginBottom: '2rem' }}>
          {(child1 || action?.description()) ?? 'Action description missing'}
        </Box>
        <Box>
          {bottomLeftChild || <TransactionTechnicalDetails transaction={transaction} />}
        </Box>
      </Box>
      <Box className={classes.child2}>
        {child2 || (
          <Timeline position="right">
            <TimelineItem>
              <TimelineOppositeContent sx={{ display: 'none' }} />
              <TimelineSeparator>
                <StyledDot>
                  <AddIcon sx={dotIconStyles} />{' '}
                </StyledDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <StyledStatusText>Created</StyledStatusText>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineOppositeContent sx={{ display: 'none' }} />
              <TimelineSeparator>
                <StyledDot>
                  <DoneIcon sx={dotIconStyles} />{' '}
                </StyledDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <StyledStatusText>
                  {' '}
                  Confirmations{' '}
                  <span
                    style={{
                      color: 'rgb(93, 109, 116)',
                      marginLeft: '3px',
                    }}
                  >
                    ({`${signers.length}/${quorumCount}`})
                  </span>
                </StyledStatusText>
              </TimelineContent>
            </TimelineItem>
            {areAllSignersVisible &&
              signers.map((signer: Address) => (
                <TimelineItem key={signer.bech32().toString()}>
                  <TimelineOppositeContent sx={{ display: 'none' }} />
                  <TimelineSeparator>
                    <TimelineDot sx={{ marginLeft: '7px' }} />
                    <TimelineConnector sx={{ marginLeft: '7px' }} />
                  </TimelineSeparator>
                  <TimelineContent>
                    <MemberPresentationWithPhoto memberAddress={signer} />
                  </TimelineContent>
                </TimelineItem>
              ))}
            <TimelineItem>
              <TimelineOppositeContent sx={{ display: 'none' }} />
              <TimelineSeparator>
                <TimelineDot sx={{ marginLeft: '7px' }} />
                <TimelineConnector sx={{ marginLeft: '7px' }} />
              </TimelineSeparator>
              <TimelineContent>
                <Typography
                  onClick={toggleShowAllSigners}
                  sx={{ cursor: 'pointer', marginTop: '2px' }}
                >
                  {toggleSignerVisibilityButtonText}
                </Typography>
              </TimelineContent>
            </TimelineItem>

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
                >
                  {' '}
                  {transaction?.status === 'success' ? (
                    <DoneIcon sx={dotIconStyles} />
                  ) : (
                    <HourglassTopIcon
                      sx={{ ...dotIconStyles, color: 'grey' }}
                    />
                  )}{' '}
                </TimelineDot>
              </TimelineSeparator>
              <TimelineContent>
                <StyledStatusText sx={{ marginBottom: '5px' }}>
                  {transaction?.status === 'success' ? 'Executed' : 'Pending'}
                </StyledStatusText>
                {transaction?.status === 'success' && (
                  <MemberPresentationWithPhoto memberAddress={signers[0]} />
                )}
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        )}
      </Box>
    </Box>
  );
}

export default TransactionDescription;
