import { ReactComponent as MultiversXLogoSymbol } from 'src/assets/img/multiversx-symbol.svg';
import { CenteredBox } from '../StyledComponents/StyledComponents';

interface IProps {
    height?: number;
    width?: number;
    marginRight?: number;
}

const MultiversXLogo = ({
  height = 30,
  width = 30,
  marginRight = 10,
}: IProps) => (
  <CenteredBox marginRight={marginRight}>
    <MultiversXLogoSymbol
      width={width}
      height={height}
    />
  </CenteredBox>
);

export default MultiversXLogo;
