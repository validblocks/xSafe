import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#4c2ffc',
    },
    secondary: {
      main: '#4c2ffc8a',
    },
    black: {
      main: '#08041D',
    },
    background: {
      main: '#4c2ffc1a',
      white: '#FFFFFF',
      danger: '#e51a3e1a',
      default: '#F4F6FD',
    },
    danger: {
      main: '#e51a3e',
    },
    anchor: {
      main: '#4c2ffc8a',
    },
    divider: {
      main: '#DFDFE8',
    },
  },
  shape: {
    radius: '10px',
  },
  shadows: {
    main: '#4c2ffc2e',
    secondary: '#4c2ffc36',
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

export const darkTheme = createTheme({
  ...theme,
  palette: {
    mode: 'dark',
  },
});
