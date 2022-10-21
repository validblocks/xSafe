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
import { useTheme } from 'styled-components';
import { Text } from 'src/components/StyledComponents/StyledComponents';
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

function TransactionDescription({
  transaction,
  action,
  signers = [],
  child1,
  child2,
  bottomLeftChild,
}: Props) {
  const isSmallScreen = useMediaQuery('(max-width:850px)');
  const theme: any = useTheme();

  const StyledDot = withStyles({ root: { backgroundColor: theme.palette.background.timeline } })(
    TimelineDot,
  );

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
          borderTop: `1px solid ${theme.palette.divider.secondary}`,
          minWidth: '90%',
          padding: '2rem',
        },
        child2: {
          gridRow: '1 / 3',
          gridColumn: '2 / 3',
          borderLeft: `1px solid ${theme.palette.divider.secondary}`,
          borderTop: `1px solid ${theme.palette.divider.secondary}`,
          padding: '1rem 2rem',
          minWidth: '33%',
        },
      }),
    [isSmallScreen],
  );

  const StyledStatusText = withStyles({
    root: { color: theme.palette.text.button, marginTop: '10px' },
  })(Typography);

  const classes = useStyles();
  const dotIconStyles = { width: '20px', height: '20px', color: theme.palette.background.secondary };

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
          <Text>{(child1 || action?.description()) ?? 'Action description missing'}</Text>
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
                    <TimelineDot sx={{ marginLeft: '10px' }} />
                    <TimelineConnector sx={{ marginLeft: '10px' }} />
                  </TimelineSeparator>
                  <TimelineContent>
                    <MemberPresentationWithPhoto memberAddress={signer} />
                  </TimelineContent>
                </TimelineItem>
              ))}
            <TimelineItem>
              <TimelineOppositeContent sx={{ display: 'none' }} />
              <TimelineSeparator>
                <TimelineDot sx={{ marginLeft: '10px' }} />
                <TimelineConnector sx={{ marginLeft: '10px' }} />
              </TimelineSeparator>
              <TimelineContent>
                <Text
                  onClick={toggleShowAllSigners}
                  fontWeight={400}
                  sx={{ cursor: 'pointer', marginTop: '2px' }}
                >
                  {toggleSignerVisibilityButtonText}
                </Text>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineOppositeContent sx={{ display: 'none' }} />
              <TimelineSeparator>
                <TimelineDot
                  sx={{
                    backgroundColor:
                      transaction?.status === 'success' ? theme.palette.background.timeline : 'grey',
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
                      sx={{ ...dotIconStyles, color: theme.palette.text.primary }}
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
