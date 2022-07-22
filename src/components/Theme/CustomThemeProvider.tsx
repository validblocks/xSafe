import { useSelector } from 'react-redux';
import { isDarkThemeEnabledSelector } from 'src/redux/selectors/appConfigSelector';
import { ThemeProvider } from 'styled-components';
import { darkTheme, theme } from './createTheme';

interface Props {
    children?: React.ReactNode;
}

const CustomThemeProvider = ({ children }: Props) => {
  const isDarkThemeEnabled = useSelector(isDarkThemeEnabledSelector);
  return (
    <ThemeProvider theme={isDarkThemeEnabled ? darkTheme : theme}>
      {children}
    </ThemeProvider>
  );
};

export default CustomThemeProvider;
