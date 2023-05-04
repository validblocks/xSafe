import { BalanceDetails } from 'src/pages/Organization/types';
import { useState, useEffect } from 'react';
import { AssetValue } from 'src/components/Theme/StyledComponents';
import useCurrencyConversion from 'src/utils/useCurrencyConversion';
import { selectedCurrencySelector } from 'src/redux/selectors/currencySelector';
import { useSelector } from 'react-redux';
import RationalNumber from 'src/utils/RationalNumber';

interface Props {
  balanceDetails: BalanceDetails;
  tokenIdentifier: string;
}

export const calculatePrice = (balanceDetails: BalanceDetails, identifier: string) => {
  if ('valueUsd' in balanceDetails) return balanceDetails.valueUsd;

  const { amount, tokenPrice, decimals } = balanceDetails;
  const tokenAmount =
    Number(RationalNumber.fromDynamicTokenAmount(identifier, amount, decimals));

  const tokenPriceValue = parseFloat(tokenPrice?.toString());

  const price = Number(tokenAmount * tokenPriceValue).toFixed(2);
  return price;
};

const DisplayTokenPrice = ({ tokenIdentifier, balanceDetails }: Props) => {
  const [totalValue, _setTotalValue] = useState(() => calculatePrice(balanceDetails, tokenIdentifier));
  const convertedValue = useCurrencyConversion(Number(totalValue));
  const activeCurrency = useSelector(selectedCurrencySelector);
  useEffect(() => {
    _setTotalValue(calculatePrice(balanceDetails, tokenIdentifier));
  }, [balanceDetails, tokenIdentifier]);

  return (
    <AssetValue>{
    Number(convertedValue ?? 0).toLocaleString() ?? '0'} {activeCurrency}
    </AssetValue>
  );
};
export default DisplayTokenPrice;
