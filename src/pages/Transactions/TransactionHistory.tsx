import React, { useEffect, useMemo, useState } from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { Transaction } from '@elrondnetwork/erdjs/out';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { getDate } from 'src/utils/transactionUtils';
import useFetch from 'src/utils/useFetch';
import { network } from 'src/config';
import TransactionDescription from './TransactionDescription';
import TransactionSummary from './TransactionSummary';

const dateFormat = 'MMM D, YYYY';

type SmartContractResult = {
  callType: string;
  data: string;
  gasLimit: number;
  gasPrice: number;
  hash: string;
  miniBlockHash: string;
  nonce: number;
  originalTxHash: string;
  prevTxHash: string;
  receiver: string;
  sender: string;
  timestamp: number;
  value: string;
};

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
  const { data: allTransactions = [] as any[] } = useFetch(
    `${network.apiAddress}/transactions?receiver=${currentContract?.address}&withScResults=true&size=50`
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
