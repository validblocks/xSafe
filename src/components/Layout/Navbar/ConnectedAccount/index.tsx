import { logout, useGetAccountInfo, useGetLoginInfo } from '@elrondnetwork/dapp-core';
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import LogoutIcon from '@mui/icons-material/Logout';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toSvg } from 'jdenticon';
import { theme } from 'src/components/Theme/createTheme';
import addressShorthand from 'src/helpers/addressShorthand';
import { accessTokenServices } from 'src/services/accessTokenServices';
import routeNames from 'src/routes/routeNames';

import { network } from 'src/config';
import { useEffect, useState } from 'react';
import { setCurrentMultisigContract } from 'src/redux/slices/multisigContractsSlice';
import { useDispatch } from 'react-redux';
import {
  ConnectItems,
  Anchor,
  CopyBtn,
  DisconnectButton,
} from '../navbar-style';

const ConnectedAccount = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logOut = async () => {
    document.cookie = '';
    accessTokenServices?.services?.maiarId?.removeToken?.();
    localStorage.clear();
    sessionStorage.clear();
    logout(`${routeNames.multisig}`, (route) => {
      navigate(route!);
      dispatch(setCurrentMultisigContract(''));
    });
  };

  const onDisconnectClick = () => {
    logOut();
  };
  const { address } = useGetAccountInfo();
  const { isLoggedIn } = useGetLoginInfo();

  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    setWalletAddress(addressShorthand(address));
  }, [address, isLoggedIn]);

  return (
    <Box>
      <Box
        sx={{ mt: 2, mb: 2 }}
        className="d-flex justify-content-center align-items-center"
      >
        <Box
          sx={{ borderRadius: '10px', overflow: 'hidden' }}
          dangerouslySetInnerHTML={{
            __html: toSvg(address, 98, { padding: 0 }),
          }}
        />
        <Box sx={{ ml: 2 }}>
          <ConnectItems className="d-flex justify-content-between" sx={{ p: 1 }}>
            <Typography sx={{ mr: 2, ml: 1 }}>
              {addressShorthand(walletAddress)}
            </Typography>
            <Box className="d-flex">
              <Box sx={{ mr: 2 }}>
                <CopyBtn className="link-color" text={address} />
              </Box>
              <Box sx={{ mr: 1 }}>
                <Anchor
                  href={`${network.explorerAddress}/accounts/${address}`}
                  target="_blank"
                  rel="noreferrer"
                  color={theme.palette.secondary.main}
                >
                  <ContentPasteGoIcon />
                </Anchor>
              </Box>
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
