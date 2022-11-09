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
      purple: '#e4e3fd',
      hover: '#F5F7FF',
      svg: '#4C2FFC',
      pinIcon: '#4C2FFC',
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
      safeOptions: {
        main: '#fff',
        svg: '#4c2FFC8a',
        divider: '#0000001f',
      },
      scrollbar: '#EBEBED',
    },
    text: {
      primary: '#08041D',
      secondary: '#00000099',
      button: '#4c2FFC',
      disabled: '#A9A9A9',
      success: '#fff',
      menuItems: '#08041D8a',
      tableHeaders: '#000000de',
    },
    sidebar: {
      primary: '#fff',
    },
    danger: {
      main: '#e51a3e',
    },
    anchor: {
      main: '#4c2ffc8a',
      secondary: '#6C757D',
      connectedAccount: '#4c2ffc8a',
    },
    divider: {
      main: '#DFDFE8',
      secondary: '#E0E0E0',
      sidebar: '#0000001a',
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
      safe: '#DED9FF',
    },
    svg: {
      secondary: '#08041D',
      safe: 'rgba(0, 0, 0, 0.26)',
      search: '#08041D',
      fillOpacity: 0.54,
      menuItems: '#08041D8a',
    },
    hover: {
      secondary: 'rgba(0, 0, 0, 0.04)',
      select: '#08041D',
    },
    shadows: {
      primary: 'rgb(40 54 61 / 18%) 0px 2px 4px 0px',
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

export const darkTheme = createTheme({
  ...theme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#F0F6FF',
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
      menuItems: '#F0F6FF8a',
      tableHeaders: '#9C9BA5',
    },
    black: {
      main: '#08041D',
      reducedOpacity: '#fff',
      minorlyReducedOpacity: '#fff',
    },
    background: {
      main: '#4c2FFC',
      secondary: '#1E1D2A',
      white: '#FFFFFF',
      danger: '#e51a3e1a',
      default: '#14131C',
      hover: '#211F33',
      svg: '#F0F6FF',
      pinIcon: '#F0F6FF8a',
      button: '#2d12d0',
      disabled: '#D6CFFF1A',
      timeline: '#2FFCBE',
      pagination: '#D6CFFF1A',
      checked: '#D6CFFF1A',
      safe: '#4c2FFC',
      menu: '#181626',
      overlay: '#14131C',
      accordion: '#242837',
      expand: '#141520',
      safeOptions: {
        main: '#14131C',
        svg: '#4c2FFC',
        divider: '#211F30',
      },
      scrollbar: '#6C757D8a',
    },
    sidebar: {
      primary: '#29273E',
    },
    danger: {
      main: '#e51a3e',
    },
    anchor: {
      main: '#6C757D',
      connectedAccount: '#fff',
    },
    divider: {
      main: '#DFDFE8',
      secondary: '#14131C',
      sidebar: '#29273E',
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
      safe: '#281E68',
    },
    svg: {
      secondary: '#fff',
      safe: '#6c757d',
      search: '#fff',
      fillOpacity: 1,
      menuItems: '#F0F6FF8a',
    },
    hover: {
      secondary: '#181626',
      select: '#A9A9A9',
    },
    shadows: {
      primary: '0px 2px 4px 0px rgb(76 47 252 / 13%)',
    },
  },
});
