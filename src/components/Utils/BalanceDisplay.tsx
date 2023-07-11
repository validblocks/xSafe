import { useCustomTheme } from 'src/utils/useCustomTheme';

type Props = {
  number: string;
  bigFontSize?: number;
  smallFontSize?: number;
};

const BalanceDisplay = ({ number, bigFontSize = 24, smallFontSize = 18 }: Props) => {
  const integerPart = Math.floor(parseFloat(number));
  const decimalPart = (parseFloat(number) - integerPart)
    .toFixed(3)
    .substring(1);
  const theme = useCustomTheme();

  return (
    <div style={{ color: theme.palette.text.primary }}>
      <span style={{ fontSize: bigFontSize, fontWeight: 900 }}>{integerPart}</span>
      <span style={{ fontSize: smallFontSize, fontWeight: 600 }}>{decimalPart}</span>
    </div>
  );
};

export default BalanceDisplay;
