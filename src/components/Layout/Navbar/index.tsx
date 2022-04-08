import * as React from 'react';
import { getIsLoggedIn } from '@elrondnetwork/dapp-core';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';

import { Navbar as BsNavbar, NavItem, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as ElrondLogo } from 'assets/img/elrond.svg';
import { ReactComponent as Union } from 'assets/img/Union.svg';
import { dAppName } from 'config';
import { routeNames } from 'routes';
import items from 'utils/menuItems';
import { uniqueContractAddress } from '../../../multisigConfig';
import Account from './Account';
import Notifications from './Notifications';
import Settings from './Settings';
const drawerWidth = 255;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden'
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
});

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  boxShadow: 'unset',
  borderBottom: '1px solid #e0e0e0'
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme)
  })
}));

export default function MiniDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();
  const loggedIn = getIsLoggedIn();

  const handleRedirectToHome = () => {
    const route = uniqueContractAddress
      ? '/multisig/' + uniqueContractAddress
      : routeNames.home;
    navigate(route);
  };

  const isOnUnlockPage = window.location.pathname.includes(routeNames.unlock);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar>
        <BsNavbar className='bg-white px-4 py-3'>
          {open === false ? (
            <IconButton
              color='inherit'
              aria-label='open drawer'
              onClick={handleDrawerOpen}
              edge='start'
              sx={{
                marginRight: 5
              }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <IconButton
              color='inherit'
              aria-label='open drawer'
              onClick={handleDrawerClose}
              edge='start'
              sx={{
                marginRight: 5
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
          <NavItem
            onClick={handleRedirectToHome}
            className='d-flex align-items-center nav-logo'
          >
            <ElrondLogo className='elrond-logo' />
            <span className='dapp-name'>{dAppName}</span>
          </NavItem>
          <Nav className='ml-auto'>
            {loggedIn ? (
              <div
                className='d-flex align-items-center logged-in'
                style={{ minWidth: 0 }}
              >
                <Account />
                <Settings />
                <Notifications />
              </div>
            ) : (
              !isOnUnlockPage && (
                <div className='connect-btns '>
                  <Link
                    to={routeNames.unlock}
                    className='btn primary'
                    data-testid='loginBtn'
                  >
                    <Union />
                    <span className='name'>Connect now</span>
                  </Link>
                </div>
              )
            )}
          </Nav>
        </BsNavbar>
      </AppBar>
      <Drawer variant='permanent' open={open}>
        <List sx={{ mt: 10 }}>
          {items.map((el, index) => {
            return (
              <Link key={index} to={el.link}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center'
                    }}
                  >
                    {el.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={el.name}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </Link>
            );
          })}
          ;
        </List>
      </Drawer>
    </Box>
  );
}
