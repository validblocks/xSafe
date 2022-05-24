import { RootState } from '../store';
import { createDeepEqualSelector } from './helpers';

const currencySelector = (state: RootState) => state.currency;

export const currencyConvertedSelector = createDeepEqualSelector(
  currencySelector,
  (state) => state?.currencyConverted
);
