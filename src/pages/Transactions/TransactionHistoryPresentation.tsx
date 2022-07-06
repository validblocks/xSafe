import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import TransactionDescription from './TransactionDescription';
import { PairOfTransactionAndDecodedAction } from './TransactionHistory';
import TransactionSummary from './TransactionSummary';

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

const TransactionHistoryPresentation = ({
  fullHistoryWithDateGrouping,
  page
}: any) => {
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const classes = useStyles();
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <>
      Page: {page}
      {fullHistoryWithDateGrouping &&
        Object.entries(fullHistoryWithDateGrouping).map(
          ([transactionDate, transactionArray]: any) => (
            <div key={transactionDate}>
              <Typography variant='subtitle1' className='my-4'>
                <strong>{transactionDate}</strong>
              </Typography>
              {transactionArray.map(
                ({
                  transaction,
                  action
                }: PairOfTransactionAndDecodedAction) => (
                  <Accordion
                    key={transaction.txHash}
                    expanded={expanded === transaction.txHash}
                    onChange={handleChange(transaction.txHash)}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls='panel1a-content'
                      sx={{ borderBottom: '2px solid #ddd' }}
                      className='pl-0 m-0 d-flex'
                      classes={{
                        content: classes.content,
                        expanded: classes.expanded
                      }}
                    >
                      <TransactionSummary
                        transaction={transaction}
                        action={action}
                      />
                    </AccordionSummary>

                    <AccordionDetails sx={{ padding: '0' }}>
                      <TransactionDescription
                        transaction={transaction}
                        action={action}
                        signers={action.signers}
                      />
                    </AccordionDetails>
                  </Accordion>
                )
              )}
            </div>
          )
        )}
    </>
  );
};

export default TransactionHistoryPresentation;
