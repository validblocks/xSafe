import { useCallback, useMemo, useState } from 'react';
import { Address } from '@multiversx/sdk-core/out';
import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
} from '@mui/lab';
import { Box, Typography } from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import { useOrganizationInfoContext } from 'src/pages/Organization/OrganizationInfoContextProvider';
import { useTheme } from 'styled-components';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import TransactionTechnicalDetails from 'src/pages/Transactions/TransactionTechnicalDetails';
import MemberPresentationWithPhoto from '../Organization/MemberPresentationWithPhoto';
import * as Styled from './styled';

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
          '@media (max-width: 600px)': {
            display: 'flex',
            flexDirection: 'column',
          },
        },
        child1: {
          gridRow: '1 / 2',
          gridColumn: '1 / 2',
          borderTop: `1px solid ${theme.palette.divider.sidebar}`,
          minWidth: '90%',
          overflow: 'auto',
          padding: '2rem',
          '@media (max-width: 600px)': {
            padding: '16px',
          },
        },
        child2: {
          gridRow: '1 / 3',
          gridColumn: '2 / 3',
          borderLeft: `1px solid ${theme.palette.divider.sidebar}`,
          borderTop: `1px solid ${theme.palette.divider.sidebar}`,
          padding: '1rem 2rem',
          minWidth: '33%',
          '@media (max-width: 600px)': {
            padding: '10px 0',
            borderLeft: 'none',
          },
        },
      }),
    [theme.palette.divider.sidebar],
  );

  const StyledStatusText = withStyles({
    root: {
      color: theme.palette.text.button,
      marginTop: '10px',
      fontWeight: '600',
      fontFamily: 'IBM Plex Sans, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
      '& span': {
        color: '#9C9BA5',
        marginLeft: '3px',
        fontWeight: '600',
      },
    },
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
  }, []);

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
              <Styled.XSafeTimelineSeparator>
                <StyledDot>
                  <AddIcon sx={dotIconStyles} />{' '}
                </StyledDot>
                <TimelineConnector />
              </Styled.XSafeTimelineSeparator>
              <TimelineContent>
                <StyledStatusText>Created</StyledStatusText>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineOppositeContent sx={{ display: 'none' }} />
              <Styled.XSafeTimelineSeparator>
                <StyledDot>
                  <DoneIcon sx={dotIconStyles} />{' '}
                </StyledDot>
                <TimelineConnector />
              </Styled.XSafeTimelineSeparator>
              <TimelineContent>
                <StyledStatusText>
                  {' '}
                  Confirmations{' '}
                  <span>({`${signers.length}/${quorumCount}`})</span>
                </StyledStatusText>
              </TimelineContent>
            </TimelineItem>
            {areAllSignersVisible &&
              signers.map((signer: Address) => (
                <TimelineItem key={signer.bech32().toString()} sx={{ marginBottom: '-16px' }}>
                  <TimelineOppositeContent sx={{ display: 'none' }} />
                  <Styled.XSafeTimelineSeparator>
                    <TimelineDot sx={{ marginLeft: '10px', backgroundColor: theme.palette.background.timeline }} />
                    <TimelineConnector sx={{ marginLeft: '10px' }} />
                  </Styled.XSafeTimelineSeparator>
                  <TimelineContent sx={{ marginTop: '-10px' }}>
                    <MemberPresentationWithPhoto memberAddress={signer} />
                  </TimelineContent>
                </TimelineItem>
              ))}
            <TimelineItem>
              <TimelineOppositeContent sx={{ display: 'none' }} />
              <Styled.XSafeTimelineSeparator>
                <TimelineDot
                  sx={{
                    backgroundColor: theme.palette.background.timeline,
                    color: theme.palette.svg.timeline,
                  }}
                ><ArrowDropUpIcon sx={{
                  transform: areAllSignersVisible ? 'rotate(180deg)' : 'rotate(0deg)',
                  marginTop: areAllSignersVisible ? '1px' : 0,
                }}
                />
                </TimelineDot>
                <TimelineConnector />
              </Styled.XSafeTimelineSeparator>
              <TimelineContent>
                <Text
                  onClick={toggleShowAllSigners}
                  fontWeight={400}
                  sx={{ cursor: 'pointer', marginTop: '10px', textDecoration: 'underline' }}
                >
                  {toggleSignerVisibilityButtonText}
                </Text>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineOppositeContent sx={{ display: 'none' }} />
              <Styled.XSafeTimelineSeparator>
                <TimelineDot
                  sx={{
                    backgroundColor:
                      transaction?.status === 'success' ?
                        theme.palette.background.timeline : theme.palette.background.timelineStatusPending,
                    borderColor: transaction?.status === 'success' ?
                      theme.palette.background.timeline : theme.palette.background.timelineStatusPending,
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
                      sx={{
                        ...dotIconStyles,
                        color: theme.palette.svg.timeline,
                        backgroundColor: theme.palette.background.timelineStatusPending,
                        transform: 'rotate(180deg)',
                      }}
                    />
                  )}{' '}
                </TimelineDot>
              </Styled.XSafeTimelineSeparator>
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
