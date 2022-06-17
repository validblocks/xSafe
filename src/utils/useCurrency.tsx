import {
  setTotalValueConverted,
  setSelectedCurrency,
} from '@redux/slices/currencySlice';

const useCurrency = (val: number, currency: string, dispatch: any) => {
  if (val && currency) {
    /* eslint wrap-iife: [1, "outside"] */
    (async function () {
      if (currency !== 'USD') {
        await fetch(
          `https://api.frankfurter.app/latest?amount=${val}&from=USD&to=${currency}`,
        )
          .then((resp) => resp.json())
          .then((data) => {
            const convertedValue = data.rates[currency];
            dispatch(setTotalValueConverted(convertedValue));
          });
      } else {
        dispatch(setTotalValueConverted(val));
      }
      dispatch(setSelectedCurrency(currency));
    }());
  }
};

export default useCurrency;
