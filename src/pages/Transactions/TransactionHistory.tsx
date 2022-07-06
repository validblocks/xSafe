import React, { useEffect, useMemo, useState } from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { Transaction } from '@elrondnetwork/erdjs/out';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import { Box, Pagination } from '@mui/material';
import dayjs from 'dayjs';
import { useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { getDate } from 'src/utils/transactionUtils';
import useFetch from 'src/utils/useFetch';
import { network } from 'src/config';
import TransactionDescription from './TransactionDescription';
import TransactionSummary from './TransactionSummary';
import { parseActionDetailed } from 'src/helpers/converters';
import { RawTransactionType } from 'src/helpers/types';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import { MultisigActionDetailed } from 'src/types/MultisigActionDetailed';

const dateFormat = 'MMM D, YYYY';

export type PairOfTransactionAndDecodedAction = {
  action: MultisigActionDetailed;
  transaction: RawTransactionType;
};

const API_RESPONSE_MAX_SIZE = 50;

const TransactionHistory = () => {
  const [actionAccumulator, setActionAccumulator] = useState<
    PairOfTransactionAndDecodedAction[]
  >([]);

  const currentContract = useSelector(currentMultisigContractSelector);

  const [cursor, setCursor] = useState(() => 0);
  const [actionsPerPage, setActionsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const globalIntervalEndTimestamp = useSelector(intervalEndTimestamp);
  const globalIntervalStartTimestamp = useSelector(intervalStartTimestamp);

  const fetchTransactions = (cursorPointer = 0) => {
    const urlParams = new URLSearchParams({
      withLogs: 'true',
      withOperations: 'true',
      size: API_RESPONSE_MAX_SIZE.toString(),
      after: globalIntervalStartTimestamp.toString(),
      before: globalIntervalEndTimestamp.toString(),
      from: cursorPointer.toString()
    });

    const API_URL = `${network.apiAddress}/accounts/${
      currentContract?.address
    }/transactions?${urlParams.toString()}`;

    return fetch(API_URL).then((response) => response.json());
  };

  const {
    data: fetchedTransactionsFromSelectedInterval,
    isFetching: isFetchingInterval,
    isLoading: isLoadingInterval,
    isError: isErrorOnFetchInterval,
    isSuccess: isSuccessOnFetchInterval
  } = useQuery(
    [QueryKeys.ALL_TRANSACTIONS_WITH_LOGS_ENABLED, cursor],
    () => fetchTransactions(cursor),
    {
      ...USE_QUERY_DEFAULT_CONFIG
    }
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    console.log({ fetchedTransactionsFromSelectedInterval });
    if (
      fetchedTransactionsFromSelectedInterval &&
      fetchedTransactionsFromSelectedInterval.length === API_RESPONSE_MAX_SIZE
    ) {
      setCursor((prev) => prev + API_RESPONSE_MAX_SIZE);
      return;
    }

    let cachedTransactions = queryClient
      .getQueryCache()
      .getAll()
      .filter(
        (cachedTransaction) =>
          cachedTransaction.queryKey[0] ===
          QueryKeys.ALL_TRANSACTIONS_WITH_LOGS_ENABLED
      )
      .map((cachedTransaction) => cachedTransaction.state.data)
      .flat() as RawTransactionType[];

    const result: PairOfTransactionAndDecodedAction[] = [];
    console.log(
      'Fetched new transaction chunk! Builduing new TransActionPairs...'
    );

    if (!cachedTransactions) return;

    cachedTransactions = cachedTransactions.filter((t) => t);

    for (const transaction of cachedTransactions) {
      const logEvents = transaction.logs?.events;

      if (!logEvents) continue;

      for (const event of logEvents) {
        const decodedEventTopics = event.topics.map((topic: string) =>
          atob(topic)
        );

        if (!decodedEventTopics.includes('actionPerformed')) continue;

        try {
          const buffer = Buffer.from(event.data || '', 'base64');
          result.push({
            action: parseActionDetailed(buffer) as MultisigActionDetailed,
            transaction
          });
        } catch (error) {
          console.error('Error while parsing action buffer: ', error);
        }
      }
    }

    console.log({ result });
    setActionAccumulator(result);
  }, [fetchedTransactionsFromSelectedInterval]);

  const [actionsForCurrentPage, setActionsForCurrentPage] = useState<
    PairOfTransactionAndDecodedAction[]
  >([]);

  useEffect(() => {
    if (!actionAccumulator) return;

    const lastIndexOfCurrentPage = currentPage * actionsPerPage;
    const firstIndexOfCurrentpage = lastIndexOfCurrentPage - actionsPerPage;
    const currentActions = actionAccumulator.slice(
      firstIndexOfCurrentpage,
      lastIndexOfCurrentPage
    );

    console.log({ currentActions });
    setActionsForCurrentPage(currentActions);
  }, [actionAccumulator, currentPage, actionsPerPage]);

  useEffect(() => {
    if (!actionAccumulator) return;
    setTotalPages(Math.ceil(actionAccumulator.length / actionsPerPage));
  }, [actionAccumulator, actionsPerPage]);

  const fullHistoryWithDateGrouping = useMemo(
    () =>
      actionsForCurrentPage?.reduce(
        (
          mapActionsToDate: Record<string, PairOfTransactionAndDecodedAction[]>,
          transactionWithActionData: PairOfTransactionAndDecodedAction
        ) => {
          const dateOfTransaction = dayjs(
            getDate(transactionWithActionData.transaction.timestamp)
          ).format(dateFormat);

          if (!mapActionsToDate[dateOfTransaction])
            mapActionsToDate[dateOfTransaction] = [];
          mapActionsToDate[dateOfTransaction].push(transactionWithActionData);

          return mapActionsToDate;
        },
        {}
      ) ?? {},
    [actionsForCurrentPage]
  );

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  if (isFetchingInterval || isLoadingInterval) {
    return <div>Loading Actions...</div>;
  }

  if (isErrorOnFetchInterval) {
    return <div>An error occured while fetching transactions...</div>;
  }

  return (
    <>
      <TransactionHistoryPresentation
        page={currentPage}
        fullHistoryWithDateGrouping={fullHistoryWithDateGrouping}
      />
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination
          sx={{ marginTop: '1.5rem' }}
          onChange={handleChange}
          count={totalPages}
          shape='rounded'
        />
      </Box>
    </>
  );
};

export default TransactionHistory;
