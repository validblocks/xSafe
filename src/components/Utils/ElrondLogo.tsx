import { ReactComponent as ElrondLogoBlack } from 'src/assets/img/logo.svg';
import { ReactComponent as ElrondLogoWhite } from 'src/assets/img/elrond-logo-white.svg';
import { useSelector } from 'react-redux';
import { isDarkThemeEnabledSelector } from 'src/redux/selectors/appConfigSelector';
import { CenteredBox } from '../StyledComponents/StyledComponents';

interface IProps {
    height?: number;
    width?: number;
    marginRight?: number;
}

const ElrondLogo = ({
  height = 30,
  width = 30,
  marginRight = 10,
}: IProps) => {
  const isDarkThemeEnabled = useSelector(isDarkThemeEnabledSelector);

  if (isDarkThemeEnabled) {
    return (
      <CenteredBox marginRight={marginRight}>
        <ElrondLogoWhite
          width={width}
          height={height}
        />
      </CenteredBox>
    );
  }

  return (
    <CenteredBox marginRight={marginRight}>
      <ElrondLogoBlack
        width={width}
        height={height}
      />
    </CenteredBox>
  );
};

export default ElrondLogo;
