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

const TransactionQueue = () => {
  const [allPendingTransactions, setAllPendingTransactions] = useState(
    [] as MultisigActionDetailed[]
  );

  const {
    quorumCountState: [quorumCount]
  } = useOrganizationInfoContext();

  useEffect(() => {
    queryAllActions().then((resp) => {
      console.log({ resp });
      console.log(resp[0].title());
      setAllPendingTransactions(resp);
    });
  }, []);
  return (
    <>
      {allPendingTransactions.reverse().map((transaction) => (
        <Accordion key={transaction.actionId}>
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
            <Typography component='span'>
              {transaction.description()}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default TransactionQueue;
