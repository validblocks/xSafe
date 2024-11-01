import { createDeepEqualSelector } from './helpers';
import { RootState } from '../store';

const currencySliceSelector = (state: RootState) => state.currency;

export const currencyConvertedSelector = createDeepEqualSelector(
  currencySliceSelector,
  (state) => state?.currencyConverted,
);

export const selectedCurrencySelector = createDeepEqualSelector(
  currencySliceSelector,
  (state) => state?.selectedCurrency,
);

export const previousCurrencySelector = createDeepEqualSelector(
  currencySliceSelector,
  (state) => state?.previousCurrency,
);

export const multisigValueInUsdSelector = createDeepEqualSelector(
  currencySliceSelector,
  (state) => state?.multisigValueInUsd,
);

export const conversionRatesSelector = createDeepEqualSelector(
  currencySliceSelector,
  (state) => state.conversionRates,
);
