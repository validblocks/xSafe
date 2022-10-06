import { useMemo, useState } from 'react';
import { List, Accordion, IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Navbar as BsNavbar, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import menuItems, { availableApps, MenuItem, preinstalledApps } from 'src/utils/menuItems';
import addressShorthand from 'src/helpers/addressShorthand';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';
import { useLocalStorage } from 'src/utils/useLocalStorage';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { LOCAL_STORAGE_KEYS } from 'src/pages/Marketplace/localStorageKeys';
import { useSelector } from 'react-redux';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';
import { useTheme } from 'styled-components';
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

import * as Styled from './styled';

const MiniDrawer = () => {
  const theme: any = useTheme();
  const location = useLocation();
  const locationString = location.pathname.substring(1);
  const currentContract = useSelector(currentMultisigContractSelector);

  const open = true;

  const [expanded, setExpanded] = useState<string | false>(false);
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const [pinnedApps, setPinnedApps] = useLocalStorage(LOCAL_STORAGE_KEYS.PINNED_APPS, []);
  const [installedApps, _setInstalledApps] = useLocalStorage(LOCAL_STORAGE_KEYS.INSTALLED_APPS, []);

  const installedAndPinnedApps = useMemo(() => ([
    ...preinstalledApps,
    ...availableApps
      .filter((app: MenuItem) => installedApps.includes(app.id)),
  ].filter((app: MenuItem) => pinnedApps.includes(app.id))), [installedApps, pinnedApps]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Styled.Drawer variant="permanent" open={open} className="drawer-wrapper">
        <BsNavbar className="p-0 py-3 px-4 d-flex align-items-center justify-content-center">
          <NavbarLogo />
          <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
            <Nav className="ml-auto align-items-center" />
          </Box>
        </BsNavbar>
        <Divider />
        <List sx={{ mt: 1, pb: 0 }}>
          <AccountDetails uniqueAddress={addressShorthand(currentContract?.address ?? '')} />
          <Divider />
        </List>
        {
          !currentContract?.address && (
            <Box
              marginTop={1}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <VpnKeyRoundedIcon
                sx={{
                  border: '1px solid #ddd',
                  fontSize: '36px',
                  padding: '5px',
                  borderRadius: '100%',
                }}
                color="disabled"
              />
            </Box>
          )
        }
        {currentContract?.address && (
          <TopMenu>
            {menuItems.topItems.map((el) => (
              <div key={el.id}>
                {el.submenu && (
                <Accordion
                  expanded={expanded === `${el.id}`}
                  onChange={handleChange(`${el.id}`)}
                  sx={{ boxShadow: 'none', backgroundColor: theme.palette.background.hover }}
                >
                  <MenuAccordion
                    aria-controls="panel1a-content"
                    expandIcon={<ArrowDropUpIcon />}
                    id="panel1a-header"
                    sx={{ pl: 0 }}
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
                          color: theme.palette.text.primary,
                        }}
                      >
                        {el.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={<Text> {el.name}</Text>}
                        sx={{
                          opacity: open ? 1 : 0,
                          color: '#08041D',
                        }}
                      />
                    </ListItem>
                  </MenuAccordion>
                  {el.submenu?.map((subEl: MenuItem) => (
                    <AccordionDetail key={subEl.link} sx={{ p: 0 }}>
                      <Link
                        to={subEl.link}
                        className={
                          locationString === subEl.link
                            ? 'active link-decoration'
                            : 'link-decoration'
                        }
                        style={{ borderRight: 'none', backgroundColor: '#f5f7ff' }}
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
                              color: theme.palette.text.primary,
                            }}
                          />
                          <ListItemText
                            primary={<Text>{subEl.name}</Text>}
                            sx={{ opacity: open ? 1 : 0 }}
                          />
                          {el.name === 'Apps' && (
                          <div className="pin-icon">
                            <IconButton
                              color="secondary"
                              onClick={() => {
                                setPinnedApps((apps: string[]) => (
                                  apps.includes(subEl.id)
                                    ? apps
                                    : [...apps, subEl.id]
                                ));
                              }}
                            >
                              <PushPinRoundedIcon />
                            </IconButton>
                          </div>
                          )}

                        </ListItem>
                      </Link>
                    </AccordionDetail>
                  ))}
                  {el.name === 'Apps' && [
                    ...availableApps
                      .filter((app: MenuItem) => installedApps.includes(app.id)),
                  ].map((subEl: MenuItem) => (
                    <AccordionDetail key={subEl.link} sx={{ p: 0 }}>
                      <Link
                        to={subEl.link}
                        className={
                          locationString === subEl.link
                            ? 'active link-decoration'
                            : 'link-decoration'
                        }
                        style={{ borderRight: 'none', backgroundColor: '#f5f7ff' }}
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
                              color: theme.palette.text.primary,
                            }}
                          />
                          <ListItemText
                            primary={<Text>{subEl.name}</Text>}
                            sx={{ opacity: open ? 1 : 0 }}
                          />
                          {el.name === 'Apps' && (
                          <div className="pin-icon">
                            <IconButton
                              color="secondary"
                              onClick={() => {
                                setPinnedApps((apps: string[]) => (
                                  apps.includes(subEl.id)
                                    ? apps
                                    : [...apps, subEl.id]
                                ));
                              }}
                            >
                              <PushPinRoundedIcon />
                            </IconButton>
                          </div>
                          )}

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
                        color: theme.palette.text.primary,
                      }}
                    >
                      {el.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={<Text>{el.name}</Text>}
                      sx={{ opacity: open ? 1 : 0 }}
                    />

                  </ListItem>
                </Link>
                )}
                {el.name === 'Apps' && (
                  installedAndPinnedApps.map((app: MenuItem) => (
                    <Link
                      to={app.link}
                      key={app.id}
                      className={
                    locationString === app.link
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
                            color: theme.palette.text.primary,
                          }}
                        >
                          {app.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={<Text>{app.name}</Text>}
                          sx={{ opacity: open ? 1 : 0 }}
                        />
                        <div className="pin-icon">
                          <IconButton
                            color="secondary"
                            onClick={() => {
                              setPinnedApps((apps: string[]) => (
                                apps.filter((appId) => appId !== app.id)
                              ));
                            }}
                          >
                            <PushPinRoundedIcon />
                          </IconButton>
                        </div>
                      </ListItem>
                    </Link>
                  )))}
              </div>
            ))}
          </TopMenu>
        )}
        <BottomMenu>
          <Divider sx={{ mt: 1 }} />
          {menuItems.bottomItems.map((el) => (
            <Link
              key={el.id}
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
                    color: theme.palette.text.primary,
                  }}
                >
                  {el.icon}
                </ListItemIcon>
                <ListItemText
                  primary={<Text>{el.name}</Text>}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItem>
            </Link>
          ))}
        </BottomMenu>
      </Styled.Drawer>
    </Box>
  );
};

export default MiniDrawer;
