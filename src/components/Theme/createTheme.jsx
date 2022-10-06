import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#4c2FFC',
    },
    secondary: {
      main: '#4c2FFC8a',
    },
    black: {
      main: '#08041D',
    },
    background: {
      main: '#4c2FFC1a',
      secondary: '#fff',
      white: '#FFFFFF',
      danger: '#e51a3e1a',
      default: '#F4F6FD',
      hover: '#F5F7FF',
      svg: '#4C2FFC',
      button: '#4c2FFC',
    },
    text: {
      primary: '#08041D',
      secondary: '#F0F6FF',
      button: '#4c2FFC',
    },
    danger: {
      main: '#e51a3e',
    },
    anchor: {
      main: '#4c2FFC8a',
    },
    divider: {
      main: '#DFDFE8',
      secondary: '#E0E0E0',
    },
  },
  shape: {
    radius: '10px',
  },
  shadows: {
    main: '#4c2FFC2e',
    secondary: '#4c2FFC36',
    reducedOpacity: '0px 14px 24px rgba(76, 47, 252, 0.03)',
  },
  typography: {
    fontFamily: [
      'IBM Plex Sans',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    bold: '600',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  font: {
    weight: {
      xs: 300,
      sm: 400,
      md: 500,
      lg: 600,
      xl: 700,
      xxl: 800,
    },
  },
  padding: {
    value: {
      xs: '3px',
      sm: '5px',
      md: '8px',
      lg: '10px',
      xl: '12px',
      xxl: '15px',
    },
  },
});

const _lightThemeConfig = {
  palette: {
    primary: {
      main: '#4c2FFC',
    },
    secondary: {
      main: '#4c2FFC8a',
    },
    black: {
      main: '#08041D',
    },
    background: {
      main: '#4c2FFC1a',
      secondary: '#fff',
      white: '#FFFFFF',
      danger: '#e51a3e1a',
      default: '#F4F6FD',
    },
    text: {
      primary: '#FFF',
    },
    danger: {
      main: '#e51a3e',
    },
    anchor: {
      main: '#4c2FFC8a',
    },
    divider: {
      main: '#DFDFE8',
    },
  },
  shape: {
    radius: '10px',
  },
  shadows: {
    main: '#4c2FFC2e',
    secondary: '#4c2FFC36',
    reducedOpacity: '0px 14px 24px rgba(76, 47, 252, 0.03)',
  },
  typography: {
    fontFamily: [
      'IBM Plex Sans',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    bold: '600',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  font: {
    weight: {
      xs: 300,
      sm: 400,
      md: 500,
      lg: 600,
      xl: 700,
      xxl: 800,
    },
  },
  padding: {
    value: {
      xs: '3px',
      sm: '5px',
      md: '8px',
      lg: '10px',
      xl: '12px',
      xxl: '15px',
    },
  },
};

export const darkTheme = createTheme({
  ...theme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffff',
    },
    secondary: {
      main: '#4c2FFC8a',
    },
    text: {
      primary: '#FFF',
      button: '#FFF',
    },
    black: {
      main: '#08041D',
    },
    background: {
      main: '#4c2FFC',
      secondary: '#1E1D2A',
      white: '#FFFFFF',
      danger: '#e51a3e1a',
      default: '#14131C',
      hover: '#211F33',
      svg: '#F0F6FF',
      button: '#2d12d0',
    },
    danger: {
      main: '#e51a3e',
    },
    anchor: {
      main: '#4c2FFC8a',
    },
    divider: {
      main: '#DFDFE8',
      secondary: '#14131C',
    },
  },
});
