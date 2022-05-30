import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrencyConverted } from 'redux/slices/currencySlice';

const useCurrency = (val: number, currency: string) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (val && currency) {
      (async function () {
        if (currency != 'USD') {
          await fetch(
            `https://api.frankfurter.app/latest?amount=${val}&from=USD&to=${currency}`
          )
            .then((resp) => resp.json())
            .then((data) => {
              const convertedValue = data.rates[currency];
              dispatch(setCurrencyConverted(convertedValue));
            });
        } else {
          dispatch(setCurrencyConverted(val));
        }
      })();
    }
  }, [val, currency]);
};

export default useCurrency;
