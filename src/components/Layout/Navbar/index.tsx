import { useMemo, useState } from 'react';
import { List, Accordion, IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Link, useLocation } from 'react-router-dom';
import { useGetLoginInfo } from '@elrondnetwork/dapp-core';
import menuItems, { availableApps, MenuItem, preinstalledApps } from 'src/utils/menuItems';
import addressShorthand from 'src/helpers/addressShorthand';
import { CenteredBox, Text } from 'src/components/StyledComponents/StyledComponents';
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';
import { useLocalStorage } from 'src/utils/useLocalStorage';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { LOCAL_STORAGE_KEYS } from 'src/pages/Marketplace/localStorageKeys';
import { useSelector } from 'react-redux';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';
import { useTheme } from 'styled-components';
import { motion } from 'framer-motion';
import AccountDetails from './NavbarAccountDetails';
import './menu.scss';
import {
  TopMenu,
  ListItem,
  MenuAccordion,
  AccordionDetail,
  SidebarDrawer,
  PinnedIconBox,
} from './navbar-style';
import * as Styled from '../../Utils/styled';
import BottomMenu from './MenuItems/BottomMenu';

const MiniDrawer = () => {
  const theme: any = useTheme();
  const location = useLocation();
  const locationString = location.pathname.substring(1);
  const currentContract = useSelector(currentMultisigContractSelector);

  const open = true;

  const { isLoggedIn } = useGetLoginInfo();

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
      <SidebarDrawer
        variant="permanent"
        open={open}
      >
        {(currentContract?.address?.length > 0 && isLoggedIn) && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <List sx={{ mt: 1, pb: 0 }}>
              <AccountDetails uniqueAddress={addressShorthand(currentContract?.address ?? '')} />
              <Styled.Dividers />
            </List>
          </motion.div>
        )}
        {
          (!currentContract?.address || !isLoggedIn) && (
            <motion.div
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <CenteredBox
                marginTop={4}
              >
                <VpnKeyRoundedIcon
                  sx={{
                    border: `1px solid ${theme.palette.svg.safe}`,
                    fontSize: '40px',
                    padding: '5px',
                    borderRadius: '100%',
                    color: theme.palette.svg.safe,
                  }}
                  color="disabled"
                />
              </CenteredBox>
            </motion.div>
          )
        }
        {(currentContract?.address && isLoggedIn) && (
          <motion.div
            style={{ height: '100%',
              overflow: 'auto',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <TopMenu>
              {menuItems.topItems.map((el) => (
                <div key={el.id}>
                  {el.submenu && (
                  <Accordion
                    expanded={expanded === `${el.id}`}
                    onChange={handleChange(`${el.id}`)}
                    sx={{ boxShadow: 'none',
                      backgroundColor: theme.palette.background.hover,
                      '& .MuiCollapse-entered': {
                        display: 'block !important',
                        '& .active': {
                          display: 'block',
                          '& div': {
                            backgroundColor: `${theme.palette.background.hover} !important`,
                          },
                        },
                      },
                    }}
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
                              sx={{ opacity: open ? 1 : 0, ml: open ? '20px' : 0 }}
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
                              sx={{ opacity: open ? 1 : 0, ml: open ? '20px' : 0 }}
                            />
                            {el.name === 'Apps' && (
                            <div className="pin-icon">
                              <IconButton
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
                          <PinnedIconBox>
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
                          </PinnedIconBox>
                        </ListItem>
                      </Link>
                    )))}
                </div>
              ))}
            </TopMenu>
          </motion.div>
        )}
        <BottomMenu />
      </SidebarDrawer>
    </Box>
  );
};

export default MiniDrawer;
