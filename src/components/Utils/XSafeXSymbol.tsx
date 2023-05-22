import { Box } from '@mui/system';
import XSafeXLogoSymbol from 'src/assets/img/xsafe-x.svg';

interface IProps {
    height?: number;
    width?: number;
    marginRight?: number | string;
}

export const XSafeXSymbol = ({
  height = 30,
  width = 30,
  marginRight = '10px',
}: IProps) => (
  <Box marginRight={marginRight}>
    <img
      src={XSafeXLogoSymbol}
      width={width}
      height={height}
    />
  </Box>
);
