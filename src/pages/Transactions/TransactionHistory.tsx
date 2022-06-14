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
import {
  queryActionData,
  queryAllActions,
  queryAllActionsHistory
} from 'contracts/MultisigContract';
import {
  decodeActionIdFromTransactionData,
  TransactionTypesWithoutSCInteraction
} from 'contracts/transactionUtils';
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
    `${network.apiAddress}/transactions?receiver=${currentContract?.address}&withScResults=true&size=50`
  );

  useEffect(() => {
    console.log('---------------useEffect-------------------');

    if (allTransactions.length == 0) return;

    const groupedTransactionsByActionId: Record<string, Transaction[]> = {};

    allTransactions?.map((transaction: any) => {
      // console.log(transaction, ' contains the ID directly');

      const actionIdHex = decodeActionIdFromTransactionData(transaction);

      if (!actionIdHex) return;

      if (!groupedTransactionsByActionId[actionIdHex])
        groupedTransactionsByActionId[actionIdHex] = [];

      groupedTransactionsByActionId[actionIdHex].push(transaction);
    });

    // const receivedFundsTransactions = [
    //   ...groupedTransactionsByActionId[
    //     TransactionTypesWithoutSCInteraction.SCRsWithoutActionId
    //   ],
    //   ...groupedTransactionsByActionId[
    //     TransactionTypesWithoutSCInteraction.noSCRs
    //   ]
    // ];

    const {
      [TransactionTypesWithoutSCInteraction.SCRsWithoutActionId]: _noId,
      [TransactionTypesWithoutSCInteraction.noSCRs]: _noSCRs,
      ...rest
    } = groupedTransactionsByActionId;

    //testare getActionData
    // const actionIds = Object.keys(rest);
    // for (const actionId of actionIds) {
    //   (async () => {
    //     const actionData = await queryActionData(parseInt(actionId));

    //     console.log('actionData', actionData);
    //   })();
    // }

    // queryAllActions().then((response) => {
    //   console.log({ response });
    // });

    // queryActionData(26).then((r) => console.log({ r }));

    // Object.keys(rest).map((actionId) => {
    //   console.log(actionId, parseInt(actionId, 16));
    //   queryActionData(parseInt(actionId, 16))
    //     .then((result) => {
    //       console.log({ result });
    //     })
    //     .catch((err) => console.log(err, actionId));
    // });

    console.log('CALLING queryAllActionsHistory');
    queryAllActionsHistory().then((d) => console.log({ d }));

    console.log({ groupedTransactionsByActionId });
  }, [allTransactions]);

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
