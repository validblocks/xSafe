import React, { useEffect, useMemo, useState } from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { Transaction } from '@elrondnetwork/erdjs/out';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Container } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { network } from 'config';
import { decodeActionIdFromTransactionData } from 'contracts/transactionUtils';
import { currentMultisigContractSelector } from 'redux/selectors/multisigContractsSelectors';
import { multisigContractFunctionNames } from 'types/multisigFunctionNames';
import { getDate } from 'utils/transactionUtils';
import useFetch from 'utils/useFetch';
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
      margin: 0
    }
  }
}));

const TransactionHistory = () => {
  const classes = useStyles();
  const currentContract = useSelector(currentMultisigContractSelector);
  const { data: allTransactions = [] as any[] } = useFetch(
    `${network.apiAddress}/transactions?receiver=${currentContract?.address}&withScResults=true`
  );

  const { data: smartContractResultsCount = 0 } = useFetch(
    `${network.apiAddress}/accounts/${currentContract?.address}/sc-results/count`
  );

  const { data: smartContractResults }: { data: SmartContractResult[] } =
    useFetch(
      `${network.apiAddress}/accounts/${currentContract?.address}/sc-results?size=${smartContractResultsCount}`
    );

  // const [smartContractResults, setSmartContractResults] = useState(
  //   [] as SmartContractResult[]
  // );

  useEffect(() => {
    console.log('----------------------------------');
    // console.log({ smartContractResults });
    // console.log({ allTransactions });
    // console.log(smartContractResults.length);
    // console.log(allTransactions.length);

    // const SCRs = axios
    //   .get(
    //     `${network.apiAddress}/accounts/${currentContract?.address}/sc-results?size=${smartContractResultsCount}`
    //   )
    //   .then(({ data }) => {
    //     console.log('NEW TRY', { data });
    //     setSmartContractResults(data);
    //   });

    // smartContractResults.find(
    //   (r) =>
    //     r.originalTxHash ===
    //     '9511d64eb4382bb2b2802fb093f5bc4882733f3fe17ff0552f089674d2fdf10d'
    // ) && console.log('FOUND 9511');

    if (smartContractResults.length == 0 || allTransactions.length == 0) return;

    // const countOccurences = smartContractResults.reduce((acc, item) => {
    //   acc[item.originalTxHash] = acc[item.originalTxHash]
    //     ? acc[item.originalTxHash] + 1
    //     : 1;
    //   return acc;
    // }, {} as Record<string, number>);

    // console.log({ countOccurences });

    const allActionIds = [] as string[];
    const groupedTransactionsByActionId: Record<string, Transaction[]> = {};

    allTransactions?.map((transaction: any) => {
      console.log(transaction, ' contains the ID directly');

      const actionIdHex = decodeActionIdFromTransactionData(transaction);

      if (!groupedTransactionsByActionId[actionIdHex])
        groupedTransactionsByActionId[actionIdHex] = [];

      groupedTransactionsByActionId[actionIdHex].push(transaction);

      allActionIds.push(actionIdHex);
    });

    console.log({ smartContractResultsCount });
    console.log({ smartContractResults });
    console.log({ groupedTransactionsByActionId });
  }, [smartContractResults, allTransactions]);

  const groupedTransactions = useMemo(() => {
    return allTransactions?.reduce((acc: any, transaction: any) => {
      const dateOfTransaction = dayjs(getDate(transaction.timestamp)).format(
        dateFormat
      );

      if (!acc[dateOfTransaction]) acc[dateOfTransaction] = [];
      acc[dateOfTransaction].push(transaction);

      return acc;
    }, {});
  }, [allTransactions]);

  return (
    <>
      {groupedTransactions &&
        Object.entries(groupedTransactions).map(
          ([transactionDate, transactionArray]: any) => {
            return (
              <div key={transactionDate}>
                {
                  <Typography variant='subtitle1' className='my-4'>
                    <strong>{transactionDate}</strong>
                  </Typography>
                }
                {transactionArray.map((transaction: any) => {
                  return (
                    <Accordion key={transaction.txHash}>
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
                        <TransactionSummary transaction={transaction} />
                      </AccordionSummary>

                      <AccordionDetails>
                        <TransactionDescription transaction={transaction} />
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </div>
            );
          }
        )}
    </>
  );
};

export default TransactionHistory;
