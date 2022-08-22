import { SupportedCurrencies } from 'src/utils/supportedCurrencies';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  conversionRatesSelector,
  previousCurrencySelector,
  selectedCurrencySelector,
} from 'src/redux/selectors/currencySelector';

export default function useCurrencyConversion(amount: number) {
  const toCurrency = useSelector(selectedCurrencySelector);
  const fromCurrency = useSelector(previousCurrencySelector);
  const conversionRates = useSelector(conversionRatesSelector);

  const [initialAmount, setInitialAmount] = useState(amount);
  const [convertedAmount, setConvertedAmount] = useState(amount);

  useEffect(() => {
    if (toCurrency === SupportedCurrencies.USD) setInitialAmount(amount);
  }, [amount, toCurrency]);

  useEffect(() => {
    if (toCurrency === SupportedCurrencies.USD) {
      setConvertedAmount(amount / (conversionRates[fromCurrency] ?? 1));
      return;
    }

    const baseAmount =
      fromCurrency === SupportedCurrencies.USD ? initialAmount : amount;
    setConvertedAmount(baseAmount * conversionRates[toCurrency]);
  }, [conversionRates, amount, toCurrency, initialAmount, fromCurrency]);

  return toCurrency === SupportedCurrencies.USD
    ? initialAmount
    : convertedAmount;
}
