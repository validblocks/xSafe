import { useMemo } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { network } from 'config';
import { currentMultisigContractSelector } from '@redux/selectors/multisigContractsSelectors';
import { getDate } from 'utils/transactionUtils';
import useFetch from 'utils/useFetch';
import TransactionDescription from './TransactionDescription';
import TransactionSummary from './TransactionSummary';

const dateFormat = 'MMM D, YYYY';

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

const TransactionHistory = () => {
  const classes = useStyles();
  const currentContract = useSelector(currentMultisigContractSelector);
  const { data: allTransactions = [] } = useFetch(
    `${network.apiAddress}/transactions?receiver=${currentContract?.address}`,
  );
  const groupedTransactions = useMemo(
    () =>
      allTransactions?.reduce((acc: any, transaction: any) => {
        const dateOfTransaction = dayjs(getDate(transaction.timestamp)).format(
          dateFormat,
        );

        if (!acc[dateOfTransaction]) acc[dateOfTransaction] = [];
        acc[dateOfTransaction].push(transaction);

        return acc;
      }, {}),
    [allTransactions],
  );

  return (
    groupedTransactions &&
    Object.entries(groupedTransactions).map(
      ([transactionDate, transactionArray]: any) => (
        <div key={transactionDate}>
          <Typography variant="subtitle1" className="my-4">
            <strong>{transactionDate}</strong>
          </Typography>
          {transactionArray.map((transaction: any) => (
            <Accordion key={transaction.txHash}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                sx={{ borderBottom: '2px solid #ddd' }}
                className="pl-0 m-0 d-flex"
                classes={{
                  content: classes.content,
                  expanded: classes.expanded,
                }}
              >
                <TransactionSummary transaction={transaction} />
              </AccordionSummary>

              <AccordionDetails>
                <TransactionDescription transaction={transaction} />
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      ),
    )
  );
};

export default TransactionHistory;
