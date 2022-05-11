import React, { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import { queryAllActions } from 'contracts/MultisigContract';
import { useOrganizationInfoContext } from 'pages/Organization/OrganizationInfoContextProvider';
import { MultisigActionDetailed } from 'types/MultisigActionDetailed';
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
      margin: 0
    }
  }
}));

const TransactionQueue = () => {
  const classes = useStyles();
  const [allPendingTransactions, setAllPendingTransactions] = useState(
    [] as MultisigActionDetailed[]
  );
  const {
    quorumCountState: [quorumCount],
    boardMembersState: [boardMembers]
  } = useOrganizationInfoContext();

  const { canUnsign, canPerformAction, canSign, canDiscardAction } =
    useTransactionPermissions();

  useEffect(() => {
    queryAllActions().then((resp) => {
      setAllPendingTransactions(resp);
    });
  }, []);

  return (
    <>
      {allPendingTransactions.reverse().map((transaction) => (
        <Accordion key={transaction.actionId} sx={{ overflow: 'scroll' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            className='pl-0'
            classes={{
              content: classes.content,
              expanded: classes.expanded
            }}
            id='panel1a-header'
          >
            <div className='d-flex w-100'>
              <Box
                sx={{
                  borderRight: '2px solid #eee',
                  padding: '1rem',
                  fontSize: '0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
                component='span'
              >
                <strong>ID: </strong>
                {transaction.actionId}
              </Box>
              <Box
                sx={{
                  borderRight: '2px solid #eee',
                  padding: '1rem',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <SettingsIcon className='mr-2' color='info' />
                {transaction.title()}
              </Box>
              <Box
                sx={{
                  borderRight: '2px solid #eee',
                  padding: '1rem',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <PeopleIcon color='secondary' className='mr-2' />
                {transaction.signers.length} out of {quorumCount}
              </Box>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <TransactionDescription
              boardMembers={boardMembers}
              signers={transaction.signers}
              description={transaction.description()}
            />
            <TransactionActionsCard
              boardMembers={boardMembers}
              key={transaction.actionId}
              type={transaction.typeNumber()}
              actionId={transaction.actionId}
              title={transaction.title()}
              tooltip={transaction.tooltip()}
              value={transaction.description()}
              data={transaction.getData()}
              canSign={canSign(transaction)}
              canUnsign={canUnsign(transaction)}
              canPerformAction={canPerformAction(transaction)}
              canDiscardAction={canDiscardAction(transaction)}
              signers={transaction.signers}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default TransactionQueue;
