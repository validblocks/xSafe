import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  previousCurrencySelector,
  selectedCurrencySelector,
} from 'src/redux/selectors/currencySelector';
import axios from 'axios';
import { useQuery } from 'react-query';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import { QueryKeys } from 'src/react-query/queryKeys';
import { SupportedCurrencies } from './supportedCurrencies';

export default function useCurrencyConversion(amount: number) {
  const toCurrency = useSelector(selectedCurrencySelector);
  const fromCurrency = useSelector(previousCurrencySelector);

  const fetchConversion = useCallback(() => {
    if (toCurrency === fromCurrency || toCurrency === SupportedCurrencies.USD) {
      return amount;
    }
    if (amount !== 0 && toCurrency) {
      return axios
        .get(
          `https://api.frankfurter.app/latest?amount=${amount}&from=USD&to=${toCurrency}`,
        )
        .then((resp) => resp.data.rates[toCurrency]);
    }
    return 0;
  }, [amount, fromCurrency, toCurrency]);

  const { data: fetchedConversion } = useQuery(
    [QueryKeys.FETCHED_CONVERSION, fromCurrency, toCurrency, amount],
    fetchConversion,
    {
      ...USE_QUERY_DEFAULT_CONFIG,
    },
  );

  return Number(fetchedConversion);
}
