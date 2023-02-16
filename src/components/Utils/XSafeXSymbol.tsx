import { Box } from '@mui/system';
import { ReactComponent as XSafeXLogoSymbol } from 'src/assets/img/xsafe-x.svg';

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
    <XSafeXLogoSymbol
      width={width}
      height={height}
    />
  </Box>
);
