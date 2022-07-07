import { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, CircularProgress } from '@mui/material';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { makeStyles } from '@mui/styles';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { CenteredBox } from 'src/components/StyledComponents/StyledComponents';
import { TransactionAccordion } from 'src/components/StyledComponents/transactions';
import { queryAllActions } from 'src/contracts/MultisigContract';
import { useOrganizationInfoContext } from 'src/pages/Organization/OrganizationInfoContextProvider';
import { QueryKeys } from 'src/react-query/queryKeys';
import PendingActionSummary from './PendingActionSummary';
import TransactionActionsCard from './TransactionActionsCard';
import TransactionDescription from './TransactionDescription';
import useTransactionPermissions from './useTransactionPermissions';

const useStyles = makeStyles(() => ({
  expanded: { margin: 0 },
  content: {
    margin: 0,
    display: 'flex',
    justifyContent: 'space-between',

    '&$expanded': {
      margin: 0,
    },
  },
}));

const TransactionQueue = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  const {
    quorumCountState: [quorumCount],
    boardMembersState: [boardMembers],
  } = useOrganizationInfoContext();

  const {
    canUnsign, canPerformAction, canSign, canDiscardAction,
  } =
    useTransactionPermissions();

  const {
    data: allPendingActions,
    isLoading,
    isFetching,
    isError,
    isSuccess
  } = useQuery(
    QueryKeys.ALL_PENDING_ACTIONS,
    () => queryAllActions().then((resp) => resp),
    {
      refetchOnWindowFocus: true,
      onSuccess(data) {
        // console.log({ data });
        data.map((a) => {
          console.log(a.description());
        });
      }
    }
  );

  if (isLoading || isFetching) {
    return (
      <CenteredBox
        sx={{ justifyContent: 'start !important', marginTop: '1.5rem' }}
      >
        <CircularProgress />
        <Box sx={{ marginLeft: '10px' }}>{t('Loading Actions')}...</Box>
      </CenteredBox>
    );
  }

  if (isError || !allPendingActions) {
    return <div>Error while retrieving pending actions!</div>;
  }

  return (
    <>
      {allPendingActions.reverse().map((action) => (
        <TransactionAccordion
          key={action.actionId}
          sx={{
            overflow: 'scroll'
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            sx={{
              borderRadius: '10px',
              border: 'none !important',
              outline: 'none !important'
            }}
            className='pl-0 m-0 d-flex'
            classes={{
              content: classes.content,
              expanded: classes.expanded,
            }}
            id="panel1a-header"
          >
            <PendingActionSummary action={action} />
          </AccordionSummary>
          <AccordionDetails sx={{ padding: '0' }}>
            <TransactionDescription
              boardMembers={boardMembers}
              signers={action.signers}
              description={action.description()}
              child3={
                <TransactionActionsCard
                  boardMembers={boardMembers}
                  key={action.actionId}
                  type={action.typeNumber()}
                  actionId={action.actionId}
                  title={action.title()}
                  tooltip={action.tooltip()}
                  value={action.description()}
                  data={action.getData()}
                  canSign={canSign(action)}
                  canUnsign={canUnsign(action)}
                  canPerformAction={canPerformAction(action)}
                  canDiscardAction={canDiscardAction(action)}
                  signers={action.signers}
                />
              }
            />
          </AccordionDetails>
        </TransactionAccordion>
      ))}
    </>
  );
};

export default TransactionQueue;
