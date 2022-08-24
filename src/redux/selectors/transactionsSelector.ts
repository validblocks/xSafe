import { RootState } from '../store';
import { createDeepEqualSelector } from './helpers';

const transactionsSelector = (state: RootState) => state.transactions;

export const intervalEndTimestampSelector = createDeepEqualSelector(
  transactionsSelector,
  (state) => state.intervalEndTimestamp,
);

export const intervalStartTimestampSelector = createDeepEqualSelector(
  transactionsSelector,
  (state) => state.intervalStartTimestamp,
);

export const intervalStartTimestampForFilteringSelector =
  createDeepEqualSelector(
    transactionsSelector,
    (state) => state.intervalStartTimestampForFiltering,
  );
