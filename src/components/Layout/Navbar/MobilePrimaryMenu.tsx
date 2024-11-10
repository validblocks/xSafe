import { Box, ListItemIcon, Typography } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MobileMenu, BottomMenuButton, LinkInfoNumber } from './navbar-style';
import { LOCAL_STORAGE_KEYS } from 'src/components/Marketplace/localStorageKeys';
import { useLocalStorage } from 'src/hooks/useLocalStorage';
import { usePendingActions } from 'src/hooks/usePendingActions';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { setIsMobileSidebarOpen } from 'src/redux/slices/appConfigSlice';
import { setProposeModalSelectedOption } from 'src/redux/slices/modalsSlice';
import { ModalTypes } from 'src/types/multisig/proposals/Proposals';
import { useDispatch } from 'react-redux';
import {
  preinstalledApps,
  availableApps,
  mobileBottomItems,
  MenuItem,
} from 'src/apps/apps';
import { useGetLoginInfo } from 'src/hooks/sdkDappHooks';

type MobileMenuItem = any;

export const MobilePrimaryMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useGetLoginInfo();
  const locationString = window.location.pathname.substring(1);
  const { allPendingActions, actionableByCurrentWallet } = usePendingActions();

  const [pinnedApps] = useLocalStorage(LOCAL_STORAGE_KEYS.PINNED_APPS, []);
  const [installedApps] = useLocalStorage(
    LOCAL_STORAGE_KEYS.INSTALLED_APPS,
    [],
  );

  const installedAndPinnedApps = useMemo(
    () =>
      [
        ...preinstalledApps,
        ...availableApps.filter((app: MenuItem) =>
          installedApps.includes(app.id),
        ),
      ].filter((app: MenuItem) => pinnedApps.includes(app.id)),
    [installedApps, pinnedApps],
  );

  const handleMobileLinkClick = useCallback(
    (menuItem: MobileMenuItem) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (isLoggedIn) {
        dispatch(setIsMobileSidebarOpen(false));
        navigate(
          menuItem.link === 'apps' && installedAndPinnedApps.length > 0
            ? installedAndPinnedApps[0]?.link
            : menuItem.link,
        );
      } else {
        dispatch(
          setProposeModalSelectedOption({
            option: ModalTypes.connect_wallet,
          }),
        );
      }
    },
    [dispatch, installedAndPinnedApps, isLoggedIn, navigate],
  );

  const getMobileLinkClasses = useCallback(
    (menuItem: MobileMenuItem) => {
      return locationString ===
        (menuItem.link === 'apps' && installedAndPinnedApps.length > 0
          ? installedAndPinnedApps[0]?.link
          : menuItem.link)
        ? 'active link-decoration'
        : 'link-decoration';
    },
    [installedAndPinnedApps, locationString],
  );

  const getMobileLinkDestination = useCallback(
    (menuItem: MobileMenuItem) => {
      return menuItem.link === 'apps' && installedAndPinnedApps.length > 0
        ? installedAndPinnedApps[0]?.link
        : menuItem.link;
    },
    [installedAndPinnedApps],
  );

  return (
    <MobileMenu>
      {mobileBottomItems.map((menuItem) => (
        <Link
          to={getMobileLinkDestination(menuItem)}
          onClick={handleMobileLinkClick(menuItem)}
          className={getMobileLinkClasses(menuItem)}
          key={getMobileLinkDestination(menuItem)}
          style={{ width: '100%' }}
        >
          <BottomMenuButton sx={{ textTransform: 'none !important' }}>
            <Box display="flex" alignItems="center">
              {menuItem.name === 'Transactions' && (
                <LinkInfoNumber
                  sx={{
                    backgroundColor: '#ff894691 !important',
                    padding: '1px 3px !important',
                  }}
                  mr={0.5}
                >
                  <Text
                    fontSize="11px"
                    width="100% !important"
                    textAlign="center"
                  >
                    {actionableByCurrentWallet ?? 0}
                  </Text>
                </LinkInfoNumber>
              )}
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  display: 'block',
                  textAlign: 'center',
                  color: 'currentcolor',
                  '& svg': {
                    fill: 'currentcolor',
                  },
                }}
              >
                {menuItem.name === 'Apps' && installedAndPinnedApps.length > 0
                  ? installedAndPinnedApps[0].icon
                  : menuItem.icon}
              </ListItemIcon>
              {menuItem.name === 'Transactions' && (
                <LinkInfoNumber
                  ml={0.5}
                  sx={{
                    padding: '1px 3px !important',
                  }}
                >
                  <Text
                    fontSize="11px"
                    width="100% !important"
                    textAlign="center"
                  >
                    {allPendingActions?.length ?? 0}
                  </Text>
                </LinkInfoNumber>
              )}
            </Box>
            <Typography component="span">
              {menuItem.name === 'Apps' && installedAndPinnedApps.length > 0
                ? installedAndPinnedApps[0]?.name
                : menuItem.name}
            </Typography>
          </BottomMenuButton>
        </Link>
      ))}
    </MobileMenu>
  );
};
