import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useState } from 'react';
import { TransactionAccordion } from 'src/components/StyledComponents/transactions';
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
      margin: 0,
    },
  },
}));

const TransactionHistoryPresentation = ({
  fullActionHistoryGroupedByDate,
}: any) => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const classes = useStyles();
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {fullActionHistoryGroupedByDate &&
        Object.entries(fullActionHistoryGroupedByDate).map(
          ([transactionDate, transactionArray]: any) => (
            <div key={transactionDate}>
              <Typography variant="subtitle1" className="my-4">
                <strong>{transactionDate}</strong>
              </Typography>
              {transactionArray.map(
                ({
                  transaction,
                  action,
                }: PairOfTransactionAndDecodedAction) => (
                  <TransactionAccordion
                    sx={{
                      margin: '10px 0',
                      border: 'none !important',
                      outline: 'none !important',
                      boxShadow: '0px 14px 24px 0px #4C2FFC08',
                      borderRadius: '10px',
                    }}
                    key={transaction.txHash}
                    expanded={expanded === transaction.txHash}
                    onChange={handleChange(transaction.txHash)}
                  >
                    <AccordionSummary
                      // eslint-disable-next-line react/jsx-curly-brace-presence
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      sx={{
                        borderRadius: '10px',
                        border: 'none !important',
                        outline: 'none !important',
                      }}
                      className="pl-0 m-0 d-flex"
                      classes={{
                        content: classes.content,
                        expanded: classes.expanded,
                      }}
                    >
                      <TransactionSummary
                        transaction={transaction}
                        action={action}
                      />
                    </AccordionSummary>

                    <AccordionDetails
                      sx={{ padding: '0', border: 'none !important' }}
                    >
                      <TransactionDescription
                        transaction={transaction}
                        action={action}
                        signers={action.signers}
                      />
                    </AccordionDetails>
                  </TransactionAccordion>
                ),
              )}
            </div>
          ),
        )}
    </>
  );
};

export default TransactionHistoryPresentation;
