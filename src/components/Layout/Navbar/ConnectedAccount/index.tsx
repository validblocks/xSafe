import React, { useState, useEffect } from 'react';
import {
  getIsLoggedIn,
  logout,
  useGetAccountInfo,
} from '@elrondnetwork/dapp-core';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import LogoutIcon from '@mui/icons-material/Logout';
import { Box, Typography, SimplePaletteColorOptions } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Safe from 'assets/img/safe.png';
import { theme } from 'components/Theme/createTheme';
import addressShorthand from 'helpers/addressShorthand';
import { uniqueContractAddress } from 'multisigConfig';
import { logoutAction } from '@redux/commonActions';
import { usernameSelector } from '@redux/selectors/accountSelector';
import { routeNames } from 'routes';
import { accessTokenServices } from 'services/accessTokenServices';

import {
  ConnectItems,
  Anchor,
  CopyBtn,
  DisconnectButton,
} from '../navbar-style';

const ConnectedAccount = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const username = useSelector(usernameSelector);
  const { address } = useGetAccountInfo();

  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    setWalletAddress(addressShorthand(address));
  }, []);

  const logOut = async () => {
    document.cookie = '';
    dispatch(logoutAction());
    accessTokenServices?.services?.maiarId?.removeToken?.();
    localStorage.clear();
    sessionStorage.clear();
    logout(routeNames.unlock, (route) => navigate(route!));
  };
  const onDisconnectClick = () => {
    setIsLoggedIn(false);
    logOut();
  };
  return (
    <Box>
      <Box
        sx={{ mt: 2, mb: 2 }}
        className="d-flex justify-content-center align-items-center"
      >
        <Box>
          <img src={Safe} />
        </Box>
        <Box sx={{ ml: 2 }}>
          <ConnectItems className="d-flex" sx={{ p: 1 }}>
            <Typography sx={{ mr: 2, ml: 1 }}>
              {addressShorthand(uniqueContractAddress)}
            </Typography>
            <Box sx={{ mr: 2 }}>
              <CopyBtn className="link-color" text={uniqueContractAddress} />
            </Box>
            <Box sx={{ mr: 1 }}>
              <Anchor
                href={`https://devnet-explorer.elrond.com/accounts/${uniqueContractAddress}`}
                target="_blank"
                rel="noreferrer"
                color={theme.palette.secondary.main}
              >
                <ContentPasteSearchIcon />
              </Anchor>
            </Box>
          </ConnectItems>
          <DisconnectButton
            variant="outlined"
            onClick={onDisconnectClick}
            sx={{ margin: 'auto', mt: 2, mb: 2 }}
          >
            <div>
              <LogoutIcon sx={{ mr: 1 }} />
              <span>Disconnect Wallet</span>
            </div>
          </DisconnectButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ConnectedAccount;
