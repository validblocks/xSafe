import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  CircularProgress,
  OutlinedInput,
  Pagination
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import useFetch from 'src/utils/useFetch';
import { network } from 'src/config';
import { parseActionDetailed } from 'src/helpers/converters';
import { RawTransactionType } from 'src/helpers/types';
import { CenteredBox } from 'src/components/StyledComponents/StyledComponents';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import { QueryKeys } from 'src/react-query/queryKeys';
import {
  intervalStartTimestampSelector,
  intervalEndTimestampSelector
} from 'src/redux/selectors/transactionsSelector';
import { MultisigActionDetailed } from 'src/types/MultisigActionDetailed';
import { getDate } from 'src/utils/transactionUtils';
import TransactionHistoryPresentation from './TransactionHistoryPresentation';

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

  const globalIntervalEndTimestamp = useSelector(intervalEndTimestampSelector);
  const globalIntervalStartTimestamp = useSelector(
    intervalStartTimestampSelector
  );

  const { t } = useTranslation();

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
    isError: isErrorOnFetchInterval
  } = useQuery(
    [
      QueryKeys.ALL_TRANSACTIONS_WITH_LOGS_ENABLED,
      cursor,
      globalIntervalStartTimestamp,
      globalIntervalEndTimestamp
    ],
    () => fetchTransactions(cursor),
    {
      ...USE_QUERY_DEFAULT_CONFIG,
      keepPreviousData: true
    }
  );

  const queryClient = useQueryClient();

  useEffect(() => {
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
            QueryKeys.ALL_TRANSACTIONS_WITH_LOGS_ENABLED &&
          (cachedTransaction.queryKey[2] as any) >= globalIntervalStartTimestamp
      )
      .map((cachedTransaction) => cachedTransaction.state.data)
      .flat() as RawTransactionType[];

    const result: PairOfTransactionAndDecodedAction[] = [];

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

    setActionsForCurrentPage(currentActions);
  }, [actionAccumulator, currentPage, actionsPerPage]);

  useEffect(() => {
    if (!actionAccumulator) return;
    return setTotalPages(Math.ceil(actionAccumulator.length / actionsPerPage));
  }, [actionAccumulator, actionsPerPage]);

  const fullActionHistoryGroupedByDate = useMemo(
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

  const handleChangeOnActionsPerPage = (event: SelectChangeEvent) => {
    setCurrentPage(1);
    setActionsPerPage(Number(event.target.value));
  };

  if (isFetchingInterval || isLoadingInterval) {
    return (
      <CenteredBox
        sx={{ justifyContent: 'start !important', marginTop: '1.5rem' }}
      >
        <CircularProgress />
        <Box sx={{ marginLeft: '10px' }}>{t('Loading Actions')}...</Box>
      </CenteredBox>
    );
  }

  if (isErrorOnFetchInterval) {
    return <div>{t('An error occured while fetching actions')}...</div>;
  }

  return (
    <>
      <TransactionHistoryPresentation
        page={currentPage}
        fullActionHistoryGroupedByDate={fullActionHistoryGroupedByDate}
      />
      <CenteredBox
        sx={{
          padding: '1rem 0',
          justifyContent: 'start !important',
          gap: '2rem'
        }}
      >
        <CenteredBox>
          <Pagination
            onChange={handleChange}
            count={totalPages}
            shape='rounded'
          />
        </CenteredBox>
        <CenteredBox sx={{ display: 'flex' }}>
          <Box>{t('Actions per page')}</Box>
          <FormControl sx={{ m: 1, minWidth: 50 }}>
            <Select
              value={actionsPerPage.toString()}
              size='small'
              onChange={handleChangeOnActionsPerPage}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              input={<OutlinedInput />}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={25}>25</MenuItem>
            </Select>
          </FormControl>
        </CenteredBox>
      </CenteredBox>
    </>
  );
};

export default TransactionHistory;
