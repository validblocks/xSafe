import React, { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { queryAllActions } from 'contracts/MultisigContract';
import { useOrganizationInfoContext } from 'pages/Organization/OrganizationInfoContextProvider';
import { MultisigActionDetailed } from 'types/MultisigActionDetailed';
import TransactionActionsCard from './TransactionActionsCard';
import TransactionDescription from './TransactionDescription';
import useTransactionPermissions from './useTransactionPermissions';

const TransactionQueue = () => {
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
      console.log('trans', { resp });
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
            id='panel1a-header'
          >
            <div className='d-flex w-100'>
              <Typography component='span' className='mr-4'>
                <strong>ID: </strong>
                {transaction.actionId}
              </Typography>
              <Typography align='left' component='span' className='mr-4'>
                <SettingsIcon className='mr-2' color='info' />
                {transaction.title()}
              </Typography>
              <Typography component='span'>
                <PeopleIcon color='secondary' className='mr-2' />
                {transaction.signers.length} out of {quorumCount}
              </Typography>
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
