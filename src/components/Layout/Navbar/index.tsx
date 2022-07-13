import { useState, useEffect } from 'react';
import { List, Accordion } from '@mui/material';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import { Navbar as BsNavbar, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { uniqueContractAddress } from 'src/multisigConfig';
import menuItems from 'src/utils/menuItems';
import addressShorthand from 'src/helpers/addressShorthand';
import AccountDetails from './NavbarAccountDetails';
import './menu.scss';
import {
  TopMenu,
  ListItem,
  MenuAccordion,
  AccordionDetail,
  BottomMenu,
} from './navbar-style';
import NavbarLogo from './Logo';

const drawerWidth = 255;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  zIndex: 1,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const MiniDrawer = () => {
  const location = useLocation();
  const locationString = location.pathname.substring(1);

  const open = true;

  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    setWalletAddress(addressShorthand(uniqueContractAddress));
  }, []);

  const [expanded, setExpanded] = useState<string | false>(false);
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer variant="permanent" open={open} className="drawer-wrapper">
        <BsNavbar className="p-0 px-4">
          <NavbarLogo />
          <Nav className="ml-auto align-items-center" />
        </BsNavbar>
        <Divider />
        <List sx={{ mt: 1, pb: 0 }}>
          <AccountDetails uniqueAddress={walletAddress} />
          <Divider />
        </List>
        <TopMenu>
          {menuItems.topItems.map((el) => (
            <div key={el.id}>
              {el.submenu && (
                <Accordion
                  expanded={expanded === `${el.id}`}
                  onChange={handleChange(`${el.id}`)}
                  sx={{ boxShadow: 'none' }}
                >
                  <MenuAccordion
                    aria-controls="panel1a-content"
                    expandIcon={<ArrowDropDownIcon />}
                    id="panel1a-header"
                    sx={{ pl: 0 }}
                    className={
                    locationString === el.link
                      ? 'active link-decoration'
                      : 'link-decoration'
                    }
                  >
                    <ListItem
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                        color: '#08041D',
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 1 : 'auto',
                          justifyContent: 'center',
                        }}
                      >
                        {el.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={el.name}
                        sx={{
                          opacity: open ? 1 : 0,
                          color: '#08041D',
                        }}
                      />
                    </ListItem>
                  </MenuAccordion>
                  {el.submenu?.map((el) => (
                    <AccordionDetail key={el.link} sx={{ p: 0 }}>
                      <Link
                        to={el.link}
                        className={
                          locationString === el.link
                            ? 'active link-decoration'
                            : 'link-decoration'
                        }
                      >
                        <ListItem
                          sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                            ml: 0,
                            pl: 3,
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: open ? 3 : 'auto',
                              justifyContent: 'center',
                            }}
                          />
                          <ListItemText
                            primary={el.name}
                            sx={{ opacity: open ? 1 : 0 }}
                          />
                        </ListItem>
                      </Link>
                    </AccordionDetail>
                  ))}
                </Accordion>
              )}
              {!el.submenu && (
                <Link
                  to={el.link}
                  className={
                    locationString === el.link
                      ? 'active link-decoration'
                      : 'link-decoration'
                  }
                >
                  <ListItem
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                      color: '#08041D',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 1 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      {el.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={el.name}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItem>
                </Link>
              )}
            </div>
          ))}
        </TopMenu>
        <BottomMenu>
          <Divider sx={{ mt: 1 }} />
          {menuItems.bottomItems.map((el) => (
            <Link
              key={el.link}
              to={el.link}
              className={
                locationString === el.link
                  ? 'active link-decoration'
                  : 'link-decoration'
              }
            >
              <ListItem
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 1 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {el.icon}
                </ListItemIcon>
                <ListItemText
                  primary={el.name}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItem>
            </Link>
          ))}
        </BottomMenu>
      </Drawer>
    </Box>
  );
};

export default MiniDrawer;
