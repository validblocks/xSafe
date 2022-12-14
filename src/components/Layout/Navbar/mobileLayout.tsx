import { useState, useEffect, useRef, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Link } from 'react-router-dom';
import Safe from 'src/assets/img/safe.png';
import SafeOptions from 'src/components/SafeOptions';
import menuItems, { availableApps, MenuItem, preinstalledApps } from 'src/utils/menuItems';
import { uniqueContractAddress } from 'src/multisigConfig';
import addressShorthand from 'src/helpers/addressShorthand';
import { useOrganizationInfoContext } from 'src/pages/Organization/OrganizationInfoContextProvider';
import pxToRem from 'src/components/Utils/pxToRem';
import { useSelector } from 'react-redux';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { useGetLoginInfo } from '@elrondnetwork/dapp-core/hooks/account';
import { truncateInTheMiddle } from 'src/utils/addressUtils';
import { isDarkThemeEnabledSelector } from 'src/redux/selectors/appConfigSelector';
import SafeDark from 'src/assets/img/Safe-dark.png';
import MobileMenuSelect from 'src/components/MobileMenuSelect';
import { useLocalStorage } from 'src/utils/useLocalStorage';
import { LOCAL_STORAGE_KEYS } from 'src/pages/Marketplace/localStorageKeys';
import {
  ArrowDropDown,
  ArrowDropUp,
  BottomMenuButton,
  LogoMenuWrapper,
  MobileMenu,
  MobileSecondaryMenu,
  TopMobileMenu,
  TotalBalanceWrapper,
} from './navbar-style';
import TotalBalance from './TotalBalance';
import NavbarLogo from './Logo';
import Account from './Account';

const MobileLayout = () => {
  const locationString = window.location.pathname.substring(1);
  const [_walletAddress, setWalletAddress] = useState('');
  const [openedSafeSelect, setOpenedSafeSelect] = useState(false);
  const menuRef = useRef<HTMLElement>();
  const currentContract = useSelector(currentMultisigContractSelector);
  const { isLoggedIn } = useGetLoginInfo();
  const isDarkThemeEnabled = useSelector(isDarkThemeEnabledSelector);

  const [pinnedApps, _setPinnedApps] = useLocalStorage(LOCAL_STORAGE_KEYS.PINNED_APPS, []);
  const [installedApps, _setInstalledApps] = useLocalStorage(LOCAL_STORAGE_KEYS.INSTALLED_APPS, []);

  const installedAndPinnedApps = useMemo(() => ([
    ...preinstalledApps,
    ...availableApps
      .filter((app: MenuItem) => installedApps.includes(app.id)),
  ].filter((app: MenuItem) => pinnedApps.includes(app.id))), [installedApps, pinnedApps]);

  useEffect(() => {
    setWalletAddress(addressShorthand(uniqueContractAddress));
  }, [addressShorthand]);

  useEffect(() => {
    const handler = (e: any) => {
      if (!menuRef.current?.contains(e.target)) {
        setOpenedSafeSelect(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, []);

  const { isMultiWalletMode, isInReadOnlyMode } = useOrganizationInfoContext();

  return (
    <Box>
      <LogoMenuWrapper>
        <NavbarLogo />
        <TopMobileMenu>
          <Box>
            <img src={isDarkThemeEnabled ? SafeDark : Safe} alt="safe" width="50px" height="50px" />
          </Box>
          <Box className="d-flex" alignItems={'center'} mr={'auto'} width={'223px'}>
            {(currentContract?.address?.length > 0 && isLoggedIn) && (
              <Box width={'100%'} display={'flex'} flexDirection={'column'} justifyContent={'center'} ml={'12px'}>
                <Typography
                  component="span"
                  fontWeight={600}
                  lineHeight={1.1}
                  display={'flex'}
                  flexDirection={'row'}
                  justifyContent={'space-between'}
                  width={'100%'}
                >{currentContract?.name}
                  {isInReadOnlyMode && <Typography fontSize={pxToRem(12)}>Read-only</Typography>}
                </Typography>
                <Typography
                  component="span"
                  lineHeight={1.1}
                >{truncateInTheMiddle(currentContract?.address, 7)}
                </Typography>
              </Box>
            )}
            <Box className="d-flex" ml={'12px'}>
              {openedSafeSelect === true && (
              <Box>
                <ArrowDropUp
                  onClick={() => {
                    setOpenedSafeSelect(false);
                  }}
                />
                <SafeOptions
                  closeSafe={() => setOpenedSafeSelect(false)}
                  ref={menuRef}
                />
              </Box>
              )}
              {openedSafeSelect === false && isMultiWalletMode && (
              <Box>
                <ArrowDropDown
                  onClick={() => {
                    setOpenedSafeSelect(true);
                  }}
                />
              </Box>
              )}
            </Box>
          </Box>
          <Account />
          <MobileMenuSelect />
        </TopMobileMenu>
      </LogoMenuWrapper>
      <TotalBalanceWrapper>
        <TotalBalance />
      </TotalBalanceWrapper>
      <MobileMenu>
        {menuItems.mobileBottomItems.map((el) => (
          <Link
            to={el.link === 'marketplace' && installedAndPinnedApps.length > 0 ?
              installedAndPinnedApps[0]?.link : el.link}
            className={
                locationString === (el.link === 'marketplace' && installedAndPinnedApps.length > 0 ?
                  installedAndPinnedApps[0]?.link : el.link)
                  ? 'active link-decoration'
                  : 'link-decoration'
              }
            key={el.link === 'marketplace' && installedAndPinnedApps.length > 0 ?
              installedAndPinnedApps[0]?.link : el.link}
            style={{ width: '100%' }}
          >
            <BottomMenuButton>
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
                {el.name === 'Apps' && installedAndPinnedApps.length > 0 ?
                  installedAndPinnedApps[0].icon : el.icon}
              </ListItemIcon>
              <Typography component="span">{el.name === 'Apps' && installedAndPinnedApps.length > 0 ?
                installedAndPinnedApps[0]?.name : el.name}
              </Typography>
            </BottomMenuButton>
          </Link>
        ))}
      </MobileMenu>
      <MobileSecondaryMenu>
        {(locationString === 'assets' ||
          locationString === 'tokens' ||
          locationString === 'nft') && (
          <Box>
            <Box
              className={
                locationString === 'tokens' || locationString === 'assets'
                  ? 'active-submenu assets-mobile-submenu py-3'
                  : 'assets-mobile-submenu py-3'
              }
            >
              <Link className="link-decoration" to="/tokens">
                Tokens
              </Link>
            </Box>
            <Box
              className={
                locationString === 'nft'
                  ? 'active-submenu assets-mobile-submenu py-3'
                  : 'assets-mobile-submenu py-3'
              }
            >
              <Link className="link-decoration" to="/nft">
                NFT&apos;s
              </Link>
            </Box>
          </Box>
        )}
      </MobileSecondaryMenu>
    </Box>
  );
};

export default MobileLayout;
