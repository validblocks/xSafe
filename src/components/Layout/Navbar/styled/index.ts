import { Box } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import { CSSObject } from '@mui/system';
import styled from 'styled-components';

const drawerWidth = 255;

const openedMixin = (theme: any): CSSObject => ({
  width: drawerWidth,
  backgroundColor: theme.palette.background.secondary,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

export const Drawer = styled(MuiDrawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  zIndex: 1,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(openedMixin(theme) as any),
  '& .MuiDrawer-paper': openedMixin(theme),
}));

export const TotalBalanceBox = styled(Box)(({ theme: _ }) => ({
  paddingLeft: '16px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));
