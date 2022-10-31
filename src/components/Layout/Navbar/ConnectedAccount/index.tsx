import { logout, useGetAccountInfo, useGetLoginInfo } from '@elrondnetwork/dapp-core';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toSvg } from 'jdenticon';
import addressShorthand from 'src/helpers/addressShorthand';
import { accessTokenServices } from 'src/services/accessTokenServices';
import routeNames from 'src/routes/routeNames';

import { network } from 'src/config';
import { useEffect, useState } from 'react';
import { setCurrentMultisigContract } from 'src/redux/slices/multisigContractsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setMultisigBalance, setOrganizationTokens, setTokenTableRows } from 'src/redux/slices/accountGeneralInfoSlice';
import CopyButton from 'src/components/CopyButton';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import {
  ConnectItems,
  DisconnectButton,
  AnchorConnectedAccount,
} from '../navbar-style';
import * as Styled from '../../../Utils/styled';

const ConnectedAccount = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentContract = useSelector(currentMultisigContractSelector);

  const logOut = async () => {
    document.cookie = '';
    accessTokenServices?.services?.maiarId?.removeToken?.();
    localStorage.clear();
    sessionStorage.clear();
    logout(`${routeNames.multisig}`, (route) => {
      navigate(route!);
      dispatch(setMultisigBalance('0'));
      dispatch(setTokenTableRows([]));
      dispatch(setOrganizationTokens([]));
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
            <Typography sx={{ mr: 1, ml: 1 }}>
              {addressShorthand(walletAddress)}
            </Typography>
            <Box className="d-flex">
              <Box sx={{ mr: 1 }}>
                <CopyButton text={currentContract?.address} link={Styled.CopyIconLinkConnectedAccount} />
              </Box>
              <Box sx={{ mr: 1 }}>
                <AnchorConnectedAccount
                  href={`${network.explorerAddress}/accounts/${address}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <SearchIcon />
                </AnchorConnectedAccount>
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
