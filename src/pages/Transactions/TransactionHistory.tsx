import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import LoadingDataIndicator from 'src/components/Utils/LoadingDataIndicator';
import uniqBy from 'lodash/uniqBy';
import PaginationWithItemsPerPage from 'src/components/Utils/PaginationWithItemsPerPage';
import { parseActionDetailed } from 'src/helpers/converters';
import { RawTransactionType } from 'src/helpers/types';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import {
  intervalStartTimestampSelector,
  intervalEndTimestampSelector,
  intervalStartTimestampForFilteringSelector,
} from 'src/redux/selectors/transactionsSelector';
import { MultisigActionDetailed } from 'src/types/MultisigActionDetailed';
import { getDate } from 'src/utils/transactionUtils';
import { StateType } from 'src/redux/slices/accountGeneralInfoSlice';
import { MultisigContractInfoType } from 'src/types/multisigContracts';
import { parseInt } from 'lodash';
import { ElrondApiProvider } from 'src/services/ElrondApiNetworkProvider';
import { ITransactionEventTopic, ITransactionOnNetwork } from '@elrondnetwork/erdjs/out';
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
  const fetchTransactions2 = useCallback(async (): Promise<ITransactionOnNetwork[]> => {
    let transactions: ITransactionOnNetwork[] = [];
    let cursorPointer = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const urlParams = new URLSearchParams({
        withLogs: 'true',
        withOperations: 'true',
        size: API_RESPONSE_MAX_SIZE.toString(),
        after: parseInt(globalIntervalStartTimestamp.toString()).toString(),
        before: parseInt(globalIntervalEndTimestamp.toString()).toString(),
        from: cursorPointer.toString(),
      });
      // eslint-disable-next-line no-await-in-loop
      const data = await ElrondApiProvider.getAddressTransactions(currentContract?.address, urlParams);

      if (!data) break;

      transactions = transactions.concat(data);

      if (data.length === 0) {
        break;
      }

      cursorPointer += API_RESPONSE_MAX_SIZE;
    }

    return transactions;
  }, [currentContract?.address, globalIntervalEndTimestamp, globalIntervalStartTimestamp]);

  const [cachedTransactions, setCachedTransactions] = useState<ITransactionOnNetwork[] | null>(null);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [isFetchingTransactions, setIsFetchingTransactions] = useState(false);
  const [isErrorOnFetchTransactions, setIsErrorOnFetchTransactions] = useState(false);

  useEffect(() => {
    try {
      (async () => {
        setIsFetchingTransactions(true);
        setIsLoadingTransactions(true);
        const transactions = await fetchTransactions2();
        setIsFetchingTransactions(false);
        setIsLoadingTransactions(false);

        const uniqueTransactions = uniqBy(transactions, (t) => t);
        setCachedTransactions(uniqueTransactions);
        setCurrentPage(1);
      })();
    } catch (e) {
      setIsErrorOnFetchTransactions(true);
    }
  }, [fetchTransactions2]);
  const queryClient = useQueryClient();

  useEffect(() => {
    const result: PairOfTransactionAndDecodedAction[] = [];

    if (!cachedTransactions) return;

    for (const transaction of cachedTransactions) {
      const logEvents = transaction.logs?.events;

      if (logEvents) {
        for (const event of logEvents) {
          const decodedEventTopics = event.topics.map((topic: ITransactionEventTopic) =>
            atob(topic.toString()),
          );

          if (decodedEventTopics.includes('startPerformAction')) {
            try {
              const buffer = Buffer.from(event.data || '', 'base64');
              const actionDetailed = parseActionDetailed(buffer) as MultisigActionDetailed;
              if (actionDetailed) {
                result.push({
                  action: actionDetailed,
                  transaction: transaction as any,
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
  }, [cachedTransactions, globalIntervalStartTimestampForFiltering, queryClient]);

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

  if (isFetchingTransactions || isLoadingTransactions) {
    return <LoadingDataIndicator dataName="action" />;
  }

  if (isErrorOnFetchTransactions) {
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
