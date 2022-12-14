import { BalanceDetails } from 'src/pages/Organization/types';
import { useState, useEffect } from 'react';
import { AssetValue } from 'src/components/Theme/StyledComponents';
import { TokenPayment } from '@elrondnetwork/erdjs/out';
import useCurrencyConversion from 'src/utils/useCurrencyConversion';
import { selectedCurrencySelector } from 'src/redux/selectors/currencySelector';
import { useSelector } from 'react-redux';

interface Props {
    balanceDetails: BalanceDetails;
}

const calculatePrice = (balanceDetails: BalanceDetails) => {
  const { amount, tokenPrice } = balanceDetails;
  const tokenAmount = Number(TokenPayment.egldFromBigInteger(amount).toRationalNumber());

  const tokenPriceValue = parseFloat(tokenPrice?.toString());

  const price = Number(tokenAmount * tokenPriceValue).toFixed(2);
  return price;
};

const DisplayTokenPrice = ({ balanceDetails }: Props) => {
  const [totalValue, _setTotalValue] = useState(() => calculatePrice(balanceDetails));
  const convertedValue = useCurrencyConversion(Number(totalValue));
  const activeCurrency = useSelector(selectedCurrencySelector);
  useEffect(() => {
    _setTotalValue(calculatePrice(balanceDetails));
  }, [balanceDetails]);

  return (
    <AssetValue>{
    Number(convertedValue ?? 0).toLocaleString() ?? '0'} {activeCurrency}
    </AssetValue>
  );
};
export default DisplayTokenPrice;
