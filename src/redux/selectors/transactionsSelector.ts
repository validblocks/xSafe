import { RootState } from '../store';
import { createDeepEqualSelector } from './helpers';

const transactionsSelector = (state: RootState) => {
  console.log({ state });
  return state.transactions;
};

export const intervalEndTimestamp = createDeepEqualSelector(
  transactionsSelector,
  (state) => state.beforeTimestamp
);

export const intervalStartTimestamp = createDeepEqualSelector(
  transactionsSelector,
  (state) => state.afterTimestamp
);
