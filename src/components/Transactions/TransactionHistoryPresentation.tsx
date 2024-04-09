import { AccordionDetails, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useState } from 'react';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import {
  TransactionAccordion,
  TransactionAccordionSummary,
} from 'src/components/StyledComponents/transactions';
import { ArrowDropDown } from '@mui/icons-material';
import TransactionDescription from './TransactionDescription';
import { PairOfTransactionAndDecodedAction } from '../../pages/Transactions/TransactionHistory';
import TransactionSummary from './TransactionSummary';
import { motion } from 'framer-motion';

const useStyles = makeStyles(() => ({
  expanded: { margin: 0 },
  content: {
    margin: 0,
    display: 'flex',
    outline: 'none',
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
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <div>
      {fullActionHistoryGroupedByDate &&
        Object.entries(fullActionHistoryGroupedByDate).map(
          ([transactionDate, transactionArray]: any) => (
            <div key={transactionDate}>
              <Typography variant="subtitle1" className="my-4">
                <Text>
                  <strong>{transactionDate}</strong>
                </Text>
              </Typography>
              {transactionArray.map(
                (
                  { transaction, action }: PairOfTransactionAndDecodedAction,
                  idx: number,
                ) => (
                  <motion.div
                    key={transaction.txHash}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{
                      delay: 0.035 * idx,
                    }}
                    viewport={{ once: true }}
                    exit={{ opacity: 0, scale: 0 }}
                  >
                    <TransactionAccordion
                      key={transaction.txHash}
                      expanded={expanded === transaction.txHash}
                      onChange={handleChange(transaction.txHash)}
                    >
                      <TransactionAccordionSummary
                        expandIcon={<ArrowDropDown />}
                        aria-controls="panel1a-content"
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
                      </TransactionAccordionSummary>

                      <AccordionDetails
                        sx={{ padding: '0', border: 'none !important' }}
                      >
                        <TransactionDescription
                          transaction={transaction}
                          action={action}
                          signers={action?.signers}
                        />
                      </AccordionDetails>
                    </TransactionAccordion>
                  </motion.div>
                ),
              )}
            </div>
          ),
        )}
    </div>
  );
};

export default TransactionHistoryPresentation;
