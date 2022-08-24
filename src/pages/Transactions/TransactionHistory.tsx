import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import LoadingDataIndicator from 'src/components/Utils/LoadingDataIndicator';
import PaginationWithItemsPerPage from 'src/components/Utils/PaginationWithItemsPerPage';
import { parseActionDetailed } from 'src/helpers/converters';
import { RawTransactionType } from 'src/helpers/types';
import { QueryKeys } from 'src/react-query/queryKeys';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import {
  intervalStartTimestampSelector,
  intervalEndTimestampSelector,
  intervalStartTimestampForFilteringSelector,
} from 'src/redux/selectors/transactionsSelector';
import { MultisigActionDetailed } from 'src/types/MultisigActionDetailed';
import { getDate } from 'src/utils/transactionUtils';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import { StateType } from 'src/redux/slices/accountSlice';
import { MultisigContractInfoType } from 'src/types/multisigContracts';
import { parseInt } from 'lodash';
import { ElrondApiProvider } from 'src/services/ElrondApiNetworkProvider';
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

  const currentContract = useSelector<StateType, MultisigContractInfoType>(currentMultisigContractSelector);

  const [cursor, setCursor] = useState(() => 0);
  const [actionsPerPage, setActionsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const globalIntervalEndTimestamp = useSelector<StateType, number>(intervalEndTimestampSelector);
  const globalIntervalStartTimestamp = useSelector<StateType, number>(
    intervalStartTimestampSelector,
  );
  const globalIntervalStartTimestampForFiltering = useSelector<StateType, number>(
    intervalStartTimestampForFilteringSelector,
  );

  const { t } = useTranslation();

  const fetchTransactions = (cursorPointer = 0) => {
    const urlParams = new URLSearchParams({
      withLogs: 'true',
      withOperations: 'true',
      size: API_RESPONSE_MAX_SIZE.toString(),
      after: parseInt(globalIntervalStartTimestamp.toString()).toString(),
      before: parseInt(globalIntervalEndTimestamp.toString()).toString(),
      from: cursorPointer.toString(),
    });

    return ElrondApiProvider.getAddressTransactions(currentContract?.address, urlParams);
  };

  const {
    data: fetchedTransactionsFromSelectedInterval,
    isFetching: isFetchingInterval,
    isLoading: isLoadingInterval,
    isError: isErrorOnFetchInterval,
  } = useQuery(
    [
      QueryKeys.ALL_TRANSACTIONS_WITH_LOGS_ENABLED,
      cursor,
      globalIntervalStartTimestamp,
      globalIntervalEndTimestamp,
    ],
    () => fetchTransactions(cursor),
    {
      ...USE_QUERY_DEFAULT_CONFIG,
      keepPreviousData: true,
    },
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
        (cachedTransaction: any) =>
          cachedTransaction.queryKey[0] ===
            QueryKeys.ALL_TRANSACTIONS_WITH_LOGS_ENABLED &&
          (cachedTransaction.queryKey[2] as any) >= globalIntervalStartTimestampForFiltering,
      )
      .map((cachedTransaction: any) => cachedTransaction.state.data)
      .flat() as RawTransactionType[];

    const result: PairOfTransactionAndDecodedAction[] = [];

    if (!cachedTransactions) return;

    cachedTransactions = cachedTransactions.filter(
      (cachedTransaction) => !!cachedTransaction,
    );

    for (const transaction of cachedTransactions) {
      const logEvents = transaction.logs?.events;

      if (logEvents) {
        for (const event of logEvents) {
          const decodedEventTopics = event.topics.map((topic: string) =>
            atob(topic),
          );

          if (decodedEventTopics.includes('startPerformAction')) {
            try {
              const buffer = Buffer.from(event.data || '', 'base64');
              const actionDetailed = parseActionDetailed(buffer) as MultisigActionDetailed;
              if (actionDetailed) {
                result.push({
                  action: actionDetailed,
                  transaction,
                });
              }
            } catch (error) {
              console.error('Error while parsing action buffer: ', error);
            }
          }
        }
      }
    }

    setActionAccumulator(result);
  }, [fetchedTransactionsFromSelectedInterval, globalIntervalStartTimestampForFiltering, queryClient]);

  const [actionsForCurrentPage, setActionsForCurrentPage] = useState<
    PairOfTransactionAndDecodedAction[]
  >([]);

  const fullActionHistoryGroupedByDate = useMemo(
    () =>
      actionsForCurrentPage?.reduce(
        (
          mapActionsToDate: Record<string, PairOfTransactionAndDecodedAction[]>,
          transactionWithActionData: PairOfTransactionAndDecodedAction,
        ) => {
          const dateOfTransaction = dayjs(
            getDate(transactionWithActionData.transaction.timestamp),
          ).format(dateFormat);

          if (!mapActionsToDate[dateOfTransaction]) mapActionsToDate[dateOfTransaction] = [];
          mapActionsToDate[dateOfTransaction].push(transactionWithActionData);

          return mapActionsToDate;
        },
        {},
      ) ?? {},
    [actionsForCurrentPage],
  );

  if (isFetchingInterval || isLoadingInterval) {
    return <LoadingDataIndicator dataName="action" />;
  }

  if (isErrorOnFetchInterval) {
    return <div>{t('An error occured while fetching actions') as string}...</div>;
  }

  return (
    <>
      <TransactionHistoryPresentation
        fullActionHistoryGroupedByDate={fullActionHistoryGroupedByDate}
      />
      <PaginationWithItemsPerPage
        data={actionAccumulator}
        setParentCurrentPage={setCurrentPage}
        setParentItemsPerPage={setActionsPerPage}
        setParentDataForCurrentPage={setActionsForCurrentPage}
        setParentTotalPages={setTotalPages}
        currentPage={currentPage}
        itemsPerPage={actionsPerPage}
        totalPages={totalPages}
      />
    </>
  );
};

export default TransactionHistory;
