import { AccordionDetails, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { useTheme } from 'styled-components';
import { TransactionAccordion, TransactionAccordionSummary } from 'src/components/StyledComponents/transactions';
import { ArrowDropDown } from '@mui/icons-material';
import TransactionDescription from './TransactionDescription';
import { PairOfTransactionAndDecodedAction } from './TransactionHistory';
import TransactionSummary from './TransactionSummary';

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
  const theme: any = useTheme();
  const [expanded, setExpanded] = useState<string | false>(false);
  const classes = useStyles();
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  const { t } = useTranslation();

  if (!fullActionHistoryGroupedByDate || Object.keys(fullActionHistoryGroupedByDate).length === 0) {
    return (
      <Typography
        sx={{
          padding: '1rem',
          marginTop: '1.5rem',
          minHeight: '65vh',
        }}
        color="text.secondary"
        variant="body1"
      > <Text>{t('No transactions found for this period') as string}</Text>
      </Typography>
    );
  }

  return (
    <div>
      {fullActionHistoryGroupedByDate &&
        Object.entries(fullActionHistoryGroupedByDate).map(
          ([transactionDate, transactionArray]: any) => (
            <div key={transactionDate}>
              <Typography variant="subtitle1" className="my-4">
                <Text><strong>{transactionDate}</strong></Text>
              </Typography>
              {transactionArray.map(
                ({
                  transaction,
                  action,
                }: PairOfTransactionAndDecodedAction) => (
                  <TransactionAccordion
                    key={transaction.txHash}
                    expanded={expanded === transaction.txHash}
                    onChange={handleChange(transaction.txHash)}
                  >
                    <TransactionAccordionSummary
                      expandIcon={(
                        <ArrowDropDown
                          color={theme.palette.text.primary}
                        />
                      )}
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
                ),
              )}
            </div>
          ),
        )}
    </div>
  );
};

export default TransactionHistoryPresentation;
