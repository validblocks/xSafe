import { BalanceDetails } from 'src/pages/Organization/types';
import { useState, useEffect } from 'react';
import { AssetValue } from 'src/components/Theme/StyledComponents';
import { operations } from '@elrondnetwork/dapp-utils';

interface Props {
    balanceDetails: BalanceDetails;
}

const calculatePrice = (balanceDetails: BalanceDetails) => {
  const { amount, decimals, tokenPrice } = balanceDetails;
  const tokenAmount = parseFloat(operations.denominate({
    input: amount,
    denomination: decimals,
    decimals,
    showLastNonZeroDecimal: true,
    addCommas: false,
  }));

  const tokenPriceValue = parseFloat(tokenPrice.toString());

  const price = Number(tokenAmount * tokenPriceValue).toFixed(2);
  return price;
};

const DisplayTokenPrice = ({ balanceDetails }: Props) => {
  const [totalValue, _setTotalValue] = useState(() => calculatePrice(balanceDetails));

  useEffect(() => {
    _setTotalValue(calculatePrice(balanceDetails));
  }, [balanceDetails]);

  return (<AssetValue>{totalValue ?? '0'} USD</AssetValue>);
};
export default DisplayTokenPrice;
