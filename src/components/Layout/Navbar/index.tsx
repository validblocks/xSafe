import { useMemo, useState } from 'react';
import { List, Accordion, IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import menuItems, { MenuItem } from 'src/utils/menuItems';
import {
  CenteredBox,
  Text,
} from 'src/components/StyledComponents/StyledComponents';
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';
import { useLocalStorage } from 'src/hooks/useLocalStorage';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { LOCAL_STORAGE_KEYS } from 'src/components/Marketplace/localStorageKeys';
import { useSelector } from 'react-redux';
import routeNames from 'src/routes/routeNames';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';
import { useCustomTheme } from 'src/hooks/useCustomTheme';
import { motion } from 'framer-motion';
import { useGetLoginInfo } from '@multiversx/sdk-dapp/hooks';
import { AppIdentifiers } from 'src/components/Marketplace/appIds';
import { usePendingActions } from 'src/hooks/usePendingActions';
import { useApps } from 'src/hooks/useApps';
import AccountDetails from './NavbarAccountDetails';
import './menu.scss';
import {
  TopMenu,
  ListItem,
  MenuAccordion,
  AccordionDetail,
  SidebarDrawer,
  PinnedIconBox,
  LinkInfoNumber,
} from './navbar-style';
import * as Styled from '../../Utils/styled';
import BottomMenu from './MenuItems/BottomMenu';
import { getAddressShorthand } from 'src/utils/addressUtils';

const MiniDrawer = () => {
  const theme = useCustomTheme();
  const location = useLocation();
  const locationString = location.pathname.substring(1);
  const currentContract = useSelector(currentMultisigContractSelector);

  const open = true;

  const { isLoggedIn } = useGetLoginInfo();

  const [expanded, setExpanded] = useState<string | false>(false);
  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const [pinnedApps, setPinnedApps] = useLocalStorage(
    LOCAL_STORAGE_KEYS.PINNED_APPS,
    [],
  );
  const { installedApps } = useApps();

  const installedAndPinnedApps = useMemo(
    () => installedApps.filter((app: MenuItem) => pinnedApps.includes(app.id)),
    [installedApps, pinnedApps],
  );

  const { allPendingActions, actionableByCurrentWallet } = usePendingActions();
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <SidebarDrawer variant="permanent" open={open}>
        {currentContract?.address?.length > 0 && isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <List sx={{ mt: 1, pb: 0 }}>
              <AccountDetails
                uniqueAddress={getAddressShorthand(
                  currentContract?.address ?? '',
                )}
              />
              <Styled.Dividers />
            </List>
          </motion.div>
        )}
        {(!currentContract?.address || !isLoggedIn) && (
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <CenteredBox marginTop={4}>
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
        )}
        {currentContract?.address && isLoggedIn && (
          <motion.div
            style={{ height: '100%', overflow: 'auto' }}
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
                      onClick={(e: any) => {
                        e.preventDefault();
                        if (el.id === 'apps-menu-item')
                          navigate(routeNames.apps);
                      }}
                      sx={{
                        boxShadow: 'none',
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
                        expandIcon={<ArrowDropDownIcon />}
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
                            primary={
                              <Box>
                                <Text> {el.name}</Text>
                              </Box>
                            }
                            sx={{
                              opacity: open ? 1 : 0,
                            }}
                          />
                        </ListItem>
                      </MenuAccordion>
                      {el.submenu?.map((subEl: MenuItem) => {
                        if (subEl.id !== AppIdentifiers.NoAppsInstalled) {
                          return (
                            <AccordionDetail key={subEl.link} sx={{ p: 0 }}>
                              <Link
                                to={subEl.link}
                                className={
                                  locationString === subEl.link
                                    ? 'active link-decoration'
                                    : 'link-decoration'
                                }
                                style={{ backgroundColor: '#f5f7ff' }}
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
                                    primary={
                                      <Text fontWeight={'400 !important'}>
                                        {subEl.name}
                                      </Text>
                                    }
                                    sx={{
                                      opacity: open ? 1 : 0,
                                      ml: open ? '20px' : 0,
                                    }}
                                  />
                                  {el.name === 'Apps' &&
                                    subEl.id !==
                                      AppIdentifiers.NoAppsInstalled && (
                                      <div className="pin-icon">
                                        <IconButton
                                          color="secondary"
                                          onClick={() => {
                                            setPinnedApps((apps: string[]) =>
                                              apps.includes(subEl.id)
                                                ? apps
                                                : [...apps, subEl.id],
                                            );
                                          }}
                                        >
                                          <PushPinRoundedIcon />
                                        </IconButton>
                                      </div>
                                    )}
                                </ListItem>
                              </Link>
                            </AccordionDetail>
                          );
                        }
                        return <div key={el.id} />;
                      })}
                      {el.name === 'Apps' &&
                        installedApps.map((app: MenuItem) => (
                          <AccordionDetail key={app.link} sx={{ p: 0 }}>
                            <Link
                              to={app.link}
                              onClick={(e: any) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigate(`/${app.link}`);
                              }}
                              className={
                                locationString === app.link
                                  ? 'active link-decoration'
                                  : 'link-decoration'
                              }
                              style={{
                                borderRight: 'none',
                                backgroundColor: '#f5f7ff',
                              }}
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
                                  primary={
                                    <Text fontWeight={'400 !important'}>
                                      {app.name}
                                    </Text>
                                  }
                                  sx={{
                                    opacity: open ? 1 : 0,
                                    ml: open ? '20px' : 0,
                                  }}
                                />
                                {el.name === 'Apps' &&
                                  app.id !== AppIdentifiers.NoAppsInstalled && (
                                    <div className="pin-icon">
                                      <IconButton
                                        onClick={() => {
                                          setPinnedApps((apps: string[]) =>
                                            apps.includes(app.id)
                                              ? apps
                                              : [...apps, app.id],
                                          );
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
                        {el.name === 'Transactions' && (
                          <>
                            <LinkInfoNumber
                              sx={{
                                backgroundColor: '#ff894691 !important',
                                color: '#FF8946 !important',
                              }}
                              mr={0.75}
                            >
                              <Text width="100% !important" textAlign="center">
                                {actionableByCurrentWallet}
                              </Text>
                            </LinkInfoNumber>
                            <Text> {'/'} </Text>
                            <LinkInfoNumber ml={0.75}>
                              <Text width="100% !important" textAlign="center">
                                {allPendingActions?.length ?? 0}
                              </Text>
                            </LinkInfoNumber>
                          </>
                        )}
                      </ListItem>
                    </Link>
                  )}
                  {el.name === 'Apps' &&
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
                                setPinnedApps((apps: string[]) =>
                                  apps.filter((appId) => appId !== app.id),
                                );
                              }}
                            >
                              <PushPinRoundedIcon />
                            </IconButton>
                          </PinnedIconBox>
                        </ListItem>
                      </Link>
                    ))}
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
