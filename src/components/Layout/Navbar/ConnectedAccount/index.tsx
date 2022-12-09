import { getIsLoggedIn, logout, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import { Box, Grid, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toSvg } from 'jdenticon';
import * as DappCoreInternal from '@elrondnetwork/dapp-core-internal';
import routeNames from 'src/routes/routeNames';
import { network } from 'src/config';
import { useEffect, useRef, useState } from 'react';
import { setCurrentMultisigContract } from 'src/redux/slices/multisigContractsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setMultisigBalance, setOrganizationTokens, setTokenTableRows } from 'src/redux/slices/accountGeneralInfoSlice';
import CopyButton from 'src/components/CopyButton';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { setProposeModalSelectedOption } from 'src/redux/slices/modalsSlice';

import { truncateInTheMiddle } from 'src/utils/addressUtils';
import { logoutAction } from 'src/redux/commonActions';
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>();
  const intervalRef = useRef<any>();

  const logOut = async () => {
    document.cookie = '';
    dispatch(logoutAction());
    DappCoreInternal.services?.maiarId?.removeToken?.();
    localStorage.clear();
    sessionStorage.clear();
    logout(`${routeNames.multisig}`, (route) => {
      navigate(route!);
      dispatch(setMultisigBalance('0'));
      dispatch(setTokenTableRows([]));
      dispatch(setOrganizationTokens([]));
      dispatch(setCurrentMultisigContract(''));
      dispatch(setProposeModalSelectedOption(null));
    });
  };

  const logoutOnSessionExpire = () => {
    intervalRef.current = setInterval(() => {
      const loggedIn = getIsLoggedIn();
      if (!loggedIn && isLoggedIn === true) {
        window.location.reload();
      }
      if (loggedIn) {
        setIsLoggedIn(true);
      }
    }, 2000);
    return () => {
      clearInterval(intervalRef.current);
    };
  };

  useEffect(logoutOnSessionExpire, [isLoggedIn]);

  const onDisconnectClick = () => {
    logOut();
  };
  const { address } = useGetAccountInfo();

  const [walletAddress, setWalletAddress] = useState('');
  const minWidth497 = useMediaQuery('(min-width:497px)');
  const minWidth420 = useMediaQuery('(min-width:420px)');

  useEffect(() => {
    // eslint-disable-next-line no-nested-ternary
    setWalletAddress(truncateInTheMiddle(address, minWidth497 ? 12 : minWidth420 ? 9 : 13));
  }, [address, isLoggedIn, minWidth420, minWidth497]);

  return (
    <Box>
      <Grid
        container
        width={'100%'}
        sx={{
          my: 2,
          justifyContent: !minWidth420 ? 'center !important' : 'space-between !important',
        }}
        className="d-flex justify-content-between align-items-center"
        gap={1}
      >
        <Grid item sx={{ marginBottom: minWidth420 ? '0' : '1rem' }}>
          <Box
            sx={{ borderRadius: '10px', overflow: 'hidden' }}
            dangerouslySetInnerHTML={{
              __html: toSvg(address, minWidth420 ? 98 : 165, { padding: 0 }),
            }}
          />
        </Grid>
        <Grid xs={minWidth420 ? 8 : 12} sm={8} item>
          <ConnectItems className="d-flex justify-content-between" sx={{ p: 1 }}>
            {walletAddress}
            <Box className="d-flex">
              <Box flex={4} sx={{ mr: 1 }}>
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
            sx={{ margin: 'auto', mt: 2, mb: 2, width: '100%' }}
          >
            <div>
              <LogoutIcon sx={{ mr: 1 }} />
              <span>{'Disconnect Wallet'}</span>
            </div>
          </DisconnectButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ConnectedAccount;
