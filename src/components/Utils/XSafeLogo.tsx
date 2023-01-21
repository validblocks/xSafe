import { Box } from '@mui/system';
import { useSelector } from 'react-redux';
import { ReactComponent as XSafeLogoDark } from 'src/assets/img/XSafeLogoDark.svg';
import { ReactComponent as XSafeLogoLight } from 'src/assets/img/XSafeLogoLight.svg';
import { isDarkThemeEnabledSelector } from 'src/redux/selectors/appConfigSelector';

interface IProps {
    height?: number;
    width?: number;
}

export const XSafeLogo: React.FC<IProps> = ({
  height = 30,
  width = 90,
}: IProps) => {
  const isDarkThemeEnabled = useSelector(isDarkThemeEnabledSelector);

  return (
    <Box>
      {isDarkThemeEnabled ? (
        <XSafeLogoDark
          width={width}
          height={height}
        />
      ) : (
        <XSafeLogoLight
          width={width}
          height={height}
        />
      )
    }
    </Box>
  );
};
