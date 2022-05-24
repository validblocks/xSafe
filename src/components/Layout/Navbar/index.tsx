import React, { useState, useEffect } from 'react';
import { getIsLoggedIn } from '@elrondnetwork/dapp-core';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListItem
} from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
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
import addressShorthand from 'helpers/addressShorthand';
import { uniqueContractAddress } from 'multisigConfig';
import { routeNames } from 'routes';
import menuItems from 'utils/menuItems';
import Account from './Account';
import AccountDetails from './NavbarAccountDetails';
import Network from './Network';
import './menu.scss';
import { useLocation } from 'react-router-dom';
import PageBreadcrumbs from '../Breadcrumb';

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
  const location = useLocation();
  const locationString = location.pathname.substring(1);

  const [open, setOpen] = React.useState(true);

  const navigate = useNavigate();
  const loggedIn = getIsLoggedIn();

  const handleRedirectToHome = () => {
    const route = uniqueContractAddress
      ? '/multisig/' + uniqueContractAddress
      : routeNames.home;
    navigate(route);
  };

  const isOnUnlockPage = window.location.pathname.includes(routeNames.unlock);

  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    setWalletAddress(addressShorthand());
  }, []);
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar></AppBar>
      <Box
        className='d-flex justify-content-between px-4 py-3 align-items-center'
        sx={{ position: 'absolute', width: '100%', zIndex: '9' }}
      >
        <Box className='breadcrumbs-header'>
          <PageBreadcrumbs />
        </Box>
        <Account />
        {/* <Network /> */}
      </Box>
      <Drawer variant='permanent' open={open}>
        <BsNavbar className='px-4 py-3'>
          <NavItem
            onClick={handleRedirectToHome}
            className='d-flex align-items-center nav-logo'
          >
            <ElrondLogo className='elrond-logo' />
            <span className='dapp-name'>{dAppName}</span>
          </NavItem>
          <Nav className='ml-auto align-items-center'></Nav>
        </BsNavbar>
        <Divider />
        <List sx={{ mt: 1 }}>
          <AccountDetails uniqueAddress={walletAddress} />
          <Divider />
        </List>
        <Box className='first-menu'>
          {menuItems.topItems.map((el, index) => (
            <div key={index}>
              {el.submenu && (
                <Accordion
                  expanded={expanded === `${el.id}`}
                  onChange={handleChange(`${el.id}`)}
                  sx={{ boxShadow: 'none' }}
                >
                  <AccordionSummary
                    aria-controls='panel1a-content'
                    expandIcon={<ExpandMoreIcon />}
                    id='panel1a-header'
                    className='menu-accordion'
                    sx={{ paddingLeft: '0px' }}
                  >
                    <ListItemButton
                      className='link-hover'
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
                  </AccordionSummary>
                  {el.submenu?.map((el, index) => {
                    return (
                      <AccordionDetails
                        key={index}
                        className='accordion-details-link'
                      >
                        <Link
                          to={el.link}
                          className={
                            locationString == el.link
                              ? 'active link-decoration'
                              : 'link-decoration'
                          }
                        >
                          <ListItemButton
                            className='link-hover'
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
                            ></ListItemIcon>
                            <ListItemText
                              primary={el.name}
                              sx={{ opacity: open ? 1 : 0 }}
                            />
                          </ListItemButton>
                        </Link>
                      </AccordionDetails>
                    );
                  })}
                </Accordion>
              )}
              {!el.submenu && (
                <Link
                  to={el.link}
                  className={
                    locationString == el.link
                      ? 'active link-decoration'
                      : 'link-decoration'
                  }
                >
                  <ListItemButton
                    className='link-hover'
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
              )}
            </div>
          ))}
        </Box>
        <List className='bottom-items'>
          <Divider sx={{ mt: 1 }} />
          {menuItems.bottomItems.map((el, index) => {
            return (
              <Link
                key={index}
                to={el.link}
                className={
                  locationString == el.link
                    ? 'active link-decoration'
                    : 'link-decoration'
                }
              >
                <ListItemButton
                  className='link-hover'
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
        </List>
      </Drawer>
    </Box>
  );
}
