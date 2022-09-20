import { useState, useEffect } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Link } from 'react-router-dom';
import Safe from 'src/assets/img/safe.png';
import SafeOptions from 'src/components/SafeOptions';
import menuItems from 'src/utils/menuItems';
import { uniqueContractAddress } from 'src/multisigConfig';
import addressShorthand from 'src/helpers/addressShorthand';
import { useOrganizationInfoContext } from 'src/pages/Organization/OrganizationInfoContextProvider';
import {
  LogoMenuWrapper,
  MobileMenu,
  MobileSecondaryMenu,
  TopMobileMenu,
  TotalBalanceWrapper,
} from './navbar-style';
import TotalBalance from './TotalBalance';
import NavbarLogo from './Logo';

const MobileLayout = () => {
  const locationString = window.location.pathname.substring(1);
  const [walletAddress, setWalletAddress] = useState('');
  const [openedSafeSelect, setOpenedSafeSelect] = useState(false);

  useEffect(() => {
    setWalletAddress(addressShorthand(uniqueContractAddress));
  }, [addressShorthand]);

  const { isMultiWalletMode, isInReadOnlyMode } = useOrganizationInfoContext();

  return (
    <Box>
      <LogoMenuWrapper>
        <NavbarLogo />
        <TopMobileMenu
          className="d-flex pt-1 pb-2 bg-white justify-content-between align-items-center"
          sx={{ px: 2 }}
        >
          <Box>
            <img src={Safe} width="50" height="50" alt="safe" />
          </Box>
          <Box className="d-flex">
            <Box>
              <Typography sx={{ fontWeight: '600' }}>My Great Safe</Typography>
              <Typography>{walletAddress}</Typography>
            </Box>
            <Box className="d-flex ml-4">
              {isInReadOnlyMode && <Typography sx={{ color: '#7A7883' }}>Read-only</Typography>}
              {openedSafeSelect === true && (
              <Box>
                <ArrowDropUpIcon
                  onClick={() => {
                    setOpenedSafeSelect(false);
                  }}
                />
                <SafeOptions />
              </Box>
              )}
              {openedSafeSelect === false && isMultiWalletMode && (
              <Box>
                <ArrowDropDownIcon
                  onClick={() => {
                    setOpenedSafeSelect(true);
                  }}
                />
              </Box>
              )}
            </Box>
          </Box>
          <Box className="d-flex" />
          <Box>
            <Link to="/settings">
              <SettingsIcon
                sx={{
                  width: '30px',
                  height: '30px',
                  color: 'rgba(8, 4, 29, 0.54)',
                }}
              />
            </Link>
          </Box>
        </TopMobileMenu>
      </LogoMenuWrapper>
      <Divider />
      <TotalBalanceWrapper>
        <TotalBalance />
      </TotalBalanceWrapper>
      <Box>
        <MobileMenu className="d-flex bg-white justify-content-around mobile-menu">
          {menuItems.mobileBottomItems.map((el) => (
            <Box
              className={
                locationString === el.link
                  ? 'active link-decoration py-4'
                  : 'link-decoration py-4'
              }
              key={el.link}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  display: 'block',
                  textAlign: 'center',
                }}
                className="pr-1"
              >
                {el.icon}
              </ListItemIcon>
              <Link className="link-decoration" to={el.link}>
                {el.name}
              </Link>
            </Box>
          ))}
        </MobileMenu>
      </Box>
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
