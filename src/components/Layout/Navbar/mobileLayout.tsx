import { useState, useEffect, useRef, useMemo } from 'react';
import { Box, IconButton, Tab, Typography, useMediaQuery } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Link, useNavigate } from 'react-router-dom';
import Safe from 'src/assets/img/safe.png';
import SafeOptions from 'src/components/SafeOptions';
import WifiProtectedSetupOutlinedIcon from '@mui/icons-material/WifiProtectedSetupOutlined';
import menuItems, { availableApps, MenuItem, preinstalledApps } from 'src/utils/menuItems';
import { uniqueContractAddress } from 'src/multisigConfig';
import addressShorthand from 'src/helpers/addressShorthand';
import { useOrganizationInfoContext } from 'src/pages/Organization/OrganizationInfoContextProvider';
import pxToRem from 'src/components/Utils/pxToRem';
import { useSelector } from 'react-redux';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { useGetLoginInfo } from '@multiversx/sdk-dapp/hooks/account';
import { isDarkThemeEnabledSelector } from 'src/redux/selectors/appConfigSelector';
import SafeDark from 'src/assets/img/Safe-dark.png';
import { useLocalStorage } from 'src/utils/useLocalStorage';
import { LOCAL_STORAGE_KEYS } from 'src/pages/Marketplace/localStorageKeys';
import MobileRightSidebar from 'src/components/MobileRightSidebar';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import CopyButton from 'src/components/CopyButton';
import { network } from 'src/config';
import { CopyIconLinkConnectedAccount } from 'src/components/Utils/styled';
import { truncateInTheMiddle } from 'src/utils/addressUtils';
import { XSafeLogo } from 'src/components/Utils/XSafeLogo';
import { usePendingActions } from 'src/utils/usePendingActions';
import { useTheme } from 'styled-components';
import {
  AnchorConnectedAccount,
  BottomMenuButton,
  LinkInfoNumber,
  MobileMenu,
  MobileSecondaryMenu,
  TopMobileMenu,
  TopMobileMenuActionBox,
  TopMobileMenuLogoBox,
  TopMobileMenuSafeBox,
  TotalBalanceWrapper,
} from './navbar-style';
import TotalBalance from './TotalBalance';
import * as Styled from '../../Utils/styled';

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

  const [safeAddress, setSafeAddress] = useState('');
  const minWidth380 = useMediaQuery('(min-width:380px)');
  const minWidth480 = useMediaQuery('(min-width:480px)');
  const minWidth425 = useMediaQuery('(min-width:425px)');
  const minWidth410 = useMediaQuery('(min-width:410px)');
  const minWidth535 = useMediaQuery('(min-width:535px)');

  const [selectedTab, setSelectedTab] = useState(0);

  const theme: any = useTheme();

  const addressChars = useMemo(() => {
    if (minWidth535) return 12;
    if (minWidth380) return 7;
    return 3;
  }, [minWidth380, minWidth410, minWidth425, minWidth535]);

  useEffect(() => {
    // eslint-disable-next-line no-nested-ternary
    setSafeAddress(truncateInTheMiddle(currentContract?.address, addressChars));
  }, [addressChars, currentContract?.address, isLoggedIn, minWidth425, minWidth480, setSafeAddress]);

  const installedAndPinnedApps = useMemo(() => ([
    ...preinstalledApps,
    ...availableApps
      .filter((app: MenuItem) => installedApps.includes(app.id)),
  ].filter((app: MenuItem) => pinnedApps.includes(app.id))), [installedApps, pinnedApps]);

  useEffect(() => {
    setWalletAddress(addressShorthand(uniqueContractAddress));
  }, []);

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

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const { isMultiWalletMode, isInReadOnlyMode } = useOrganizationInfoContext();

  const navigate = useNavigate();
  const handleRedirectToHome = () => {
    const route = '/multisig';
    navigate(route);
  };

  const { allPendingActions, actionableByCurrentWallet } = usePendingActions();

  const [hideHeader, setHideHeader] = useState(false);
  const prevScrollPos = useRef(window.scrollY);
  const [_transformPercent, setTransformPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      if (prevScrollPos.current > currentScrollPos) {
        setTransformPercent(100);
        setHideHeader(false);
      } else {
        setTransformPercent(0);
        setHideHeader(true);
      }
      prevScrollPos.current = currentScrollPos;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  return (
    <Box>
      <Box height={minWidth425 ? '123px' : '111.14px'}>
        <Box
          sx={{
            zIndex: 1301,
            position: 'fixed',
            width: '100%',
            top: hideHeader ? '-112px' : '0',
            transition: 'all 0.3s ease-out',
            backgroundColor: theme.palette.background.secondary,
            borderRadius: '0 0 10px 10px',
          }}
        >
          <TopMobileMenu>
            <TopMobileMenuLogoBox onClick={handleRedirectToHome}>
              <XSafeLogo width={50} />
            </TopMobileMenuLogoBox>
            <TopMobileMenuSafeBox sx={{
              px: 2,
              minHeight: '54.1px',
            }}
            >
              {minWidth425 && (
              <Box>
                <img src={isDarkThemeEnabled ? SafeDark : Safe} alt="safe" width="50px" height="50px" />
              </Box>
              )}
              <Box className="d-flex" alignItems={'center'} width="100%">
                {(currentContract?.address?.length > 0 && isLoggedIn) && (
                <Box
                  width={'100%'}
                  display={'flex'}
                  flexDirection={'column'}
                  justifyContent={'center'}
                  ml={minWidth380 ? '12px' : 0}
                >
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
                  <Box display="flex">
                    <Text mr={1}>{safeAddress}</Text>
                    <Box className="d-flex">
                      <Box flex={4} sx={{ mr: 1 }}>
                        <CopyButton
                          text={currentContract?.address}
                          copyIconWidth="11px"
                          link={CopyIconLinkConnectedAccount}
                        />
                      </Box>
                      <Box sx={{ mr: 1 }}>
                        <AnchorConnectedAccount
                          href={`${network.explorerAddress}/accounts/${currentContract?.address}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <SearchIcon sx={{ width: '15px' }} />
                        </AnchorConnectedAccount>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                )}
                <Box className="d-flex" ml={minWidth380 ? '12px' : 0}>
                  {openedSafeSelect === true && (
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => setOpenedSafeSelect(false)}
                    >
                      <WifiProtectedSetupOutlinedIcon sx={{ color: '#FFF' }} />
                    </IconButton>
                    <SafeOptions
                      closeSafe={() => setOpenedSafeSelect(false)}
                      ref={menuRef}
                    />
                  </Box>
                  )}
                  {openedSafeSelect === false && isMultiWalletMode && (
                  <Box>
                    {isLoggedIn && currentContract?.address.length > 0 ? (
                      <IconButton
                        size="small"
                        onClick={() => setOpenedSafeSelect(true)}
                      >
                        <WifiProtectedSetupOutlinedIcon sx={{ color: '#FFF' }} />
                      </IconButton>
                    ) : <Text>No safe available</Text>}
                  </Box>
                  )}
                </Box>
              </Box>
            </TopMobileMenuSafeBox>
            <TopMobileMenuActionBox>
              <MobileRightSidebar />
            </TopMobileMenuActionBox>
          </TopMobileMenu>
          <TotalBalanceWrapper>
            <TotalBalance />
          </TotalBalanceWrapper>
        </Box>
      </Box>
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
              <Box display="flex" alignItems="center">
                {el.name === 'Transactions' && (
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
                  {el.name === 'Apps' && installedAndPinnedApps.length > 0 ?
                    installedAndPinnedApps[0].icon : el.icon}

                </ListItemIcon>
                {el.name === 'Transactions' && (
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
          <Styled.MainTab value={selectedTab} onChange={handleChange}>
            <Tab component={Link} label="Tokens" to="/tokens" />
            <Tab component={Link} label="NFT's" to="/nft" />
          </Styled.MainTab>
        )}
      </MobileSecondaryMenu>
    </Box>
  );
};

export default MobileLayout;
