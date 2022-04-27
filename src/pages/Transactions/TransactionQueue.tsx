import React, { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { queryAllActions } from 'contracts/MultisigContract';

const TransactionQueue = () => {
  const [pendingTransactions, setAllPendingTransactions] = useState([]);

  useEffect(() => {
    queryAllActions().then((resp) => {
      console.log({ resp });
      console.log(resp[0].title());
    });
  }, []);
  return (
    <>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography component='span'>Accordion 1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component='span'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel2a-content'
          id='panel2a-header'
        >
          <Typography component='span'>Accordion 2</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component='span'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default TransactionQueue;
