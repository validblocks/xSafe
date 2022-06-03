import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#4c2ffc'
    },
    secondary: {
      main: '#4c2ffc8a'
    },
    background: {
      main: '#4c2ffc1a',
      default: '#FFFFFF',
      danger: '#e51a3e1a'
    },
    danger: {
      main: '#e51a3e'
    },
    anchor: {
      main: '#4c2ffc8a'
    }
  },
  shape: {
    radius: '10px'
  },
  shadows: {
    main: '#4c2ffc2e',
    secondary: '#4c2ffc08'
  },
  typography: {
    bold: '600'
  }
});
