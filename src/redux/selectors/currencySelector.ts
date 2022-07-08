import { createDeepEqualSelector } from './helpers';
import { RootState } from '../store';

const totalValueSelector = (state: RootState) => state.currency;

const currencySelector = (state: RootState) => state.currency;

const valueInUsd = (state: RootState) => state.currency;

export const currencyConvertedSelector = createDeepEqualSelector(
  totalValueSelector,
  (state) => state?.currencyConverted,
);

export const selectedCurrencySelector = createDeepEqualSelector(
  currencySelector,
  (state) => state?.selectedCurrency,
);

export const valueInUsdSelector = createDeepEqualSelector(
  valueInUsd,
  (state) => state?.valueInUsd,
);
