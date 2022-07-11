import { useState } from 'react';
import { AssetValue } from 'src/components/Theme/StyledComponents';

interface Props {
    tokenAmount: string;
    tokenUnitPrice: number;
}

const DisplayTokenPrice = ({ tokenAmount, tokenUnitPrice }: Props) => {
  const [totalValue, _setTotalValue] = useState(parseFloat(tokenAmount) * tokenUnitPrice);
  return (<AssetValue>{totalValue.toFixed(2)} USD</AssetValue>);
};
export default DisplayTokenPrice;
