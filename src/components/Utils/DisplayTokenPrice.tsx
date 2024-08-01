import { BalanceDetails } from 'src/types/organization';
import { useState, useEffect } from 'react';
import { AssetValue } from 'src/components/Theme/StyledComponents';
import useCurrencyConversion from 'src/hooks/useCurrencyConversion';
import { selectedCurrencySelector } from 'src/redux/selectors/currencySelector';
import { useSelector } from 'react-redux';

interface Props {
  balanceDetails: BalanceDetails;
  tokenIdentifier: string;
}

export const calculatePrice = (balanceDetails: BalanceDetails) => {
  if ('valueUsd' in balanceDetails) return balanceDetails.valueUsd;

  const { amount, tokenPrice, decimals } = balanceDetails;

  return amount.times(tokenPrice).shiftedBy(-decimals);
};

const DisplayTokenPrice = ({ tokenIdentifier, balanceDetails }: Props) => {
  const [totalValue, _setTotalValue] = useState(() =>
    calculatePrice(balanceDetails),
  );
  const convertedValue = useCurrencyConversion(Number(totalValue));
  const activeCurrency = useSelector(selectedCurrencySelector);
  useEffect(() => {
    _setTotalValue(calculatePrice(balanceDetails));
  }, [balanceDetails, tokenIdentifier]);

  return (
    <AssetValue>
      {Number(convertedValue ?? 0).toLocaleString('EN') ?? '0'} {activeCurrency}
    </AssetValue>
  );
};

export default DisplayTokenPrice;
