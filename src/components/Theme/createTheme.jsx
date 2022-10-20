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
      reducedOpacity: 'rgba(0, 0, 0, 0.6)',
      minorlyReducedOpacity: 'rgba(0, 0, 0, 0.87)',
      mediumReducedOpacity: 'rgba(0, 0, 0, 0.54)',
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
      disabled: '#eee',
      timeline: '#4C2FFC',
      pagination: '#00000014',
      checked: '#4c2FFC',
      safe: '#E4DFFF',
      menu: '#E4EAFF',
      overlay: '#FFFFFFD6',
      accordion: '#F3F6FC',
      expand: '#F3F6FC',
    },
    text: {
      primary: '#08041D',
      secondary: '#00000099',
      button: '#4c2FFC',
      disabled: '#A9A9A9',
      success: '#fff',
    },
    danger: {
      main: '#e51a3e',
    },
    anchor: {
      main: '#4c2ffc8a',
      secondary: '#6C757D',
    },
    divider: {
      main: '#DFDFE8',
      secondary: '#E0E0E0',
    },
    borders: {
      active: '#4C2FFC',
      secondary: '#0000003B',
      expand: '#eee',
    },
    button: {
      success: '#3BE292',
      pending: '#fff',
      copy: '#1392ff',
      qr: '#08041D',
      paste: '#4c2ffc8a',
    },
    svg: {
      secondary: '#08041D',
    },
    hover: {
      secondary: 'rgba(0, 0, 0, 0.04)',
      select: '#08041D',
    },
  },
  shape: {
    radius: '10px',
  },
  shadows: {
    main: '#4c2FFC2e',
    secondary: '#4c2FFC36',
    reducedOpacity: '0px 14px 24px rgba(76, 47, 252, 0.03)',
    reducedOpacityIcons: '0 5px 10px rgba(76, 47, 252, 0.03)',
  },
  hover: {
    table: { rows: '#F5F7FF' },
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
    size: {
      xs: '10px',
      sm: '11px',
      md: '12px',
      lg: '13px',
      xl: '14px',
      xxl: '15px',
      xxxl: '16px',
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
      main: '#4c2ffc8a',
      secondary: '#6C757D',
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
      secondary: '#fff',
      button: '#FFF',
      disabled: '#8680A9',
      success: '#2FFCBE',
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
      disabled: '#D6CFFF1A',
      timeline: '#2FFCBE',
      pagination: '#D6CFFF1A',
      checked: '#D6CFFF1A',
      safe: '#A2A2A2',
      menu: '#181626',
      overlay: '#14131C',
      accordion: '#242837',
      expand: '#141520',
    },
    danger: {
      main: '#e51a3e',
    },
    anchor: {
      main: '#6C757D',
    },
    divider: {
      main: '#DFDFE8',
      secondary: '#14131C',
    },
    borders: {
      active: '#4C2FFC',
      secondary: '#6B6B6B',
      expand: '#323046',
    },
    button: {
      success: '#2FFCBE40',
      pending: '#684D0C',
      copy: '#6c757d',
      qr: '#6c757d',
      paste: '#6c757d',
    },
    svg: {
      secondary: '#fff',
    },
    hover: {
      secondary: '#181626',
      select: '#A9A9A9',
    },
  },
});
