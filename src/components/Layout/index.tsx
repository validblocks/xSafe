import React, { useEffect } from 'react';

import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import {
  AuthenticatedRoutesWrapper,
  refreshAccount,
  useGetAccountInfo,
  useGetLoginInfo
} from '@elrondnetwork/dapp-core';
import { Box } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAccountData } from 'apiCalls/accountCalls';
import PageBreadcrumbs from './Breadcrumb';
import { getEconomicsData } from 'apiCalls/economicsCalls';
import { getUserMultisigContractsList } from 'apiCalls/multisigContractsCalls';
import { uniqueContractAddress, uniqueContractName } from 'multisigConfig';
import ProposersTable from 'pages/Organization/ProposersTable';
import { setAccountData } from 'redux/slices/accountSlice';
import { setEconomics } from 'redux/slices/economicsSlice';
import { setMultisigContracts } from 'redux/slices/multisigContractsSlice';
import routes, { routeNames } from 'routes';
('');
import { accessTokenServices, storageApi } from 'services/accessTokenServices';
import { TokenWrapper } from '../TokenWrapper';
import ModalLayer from './Modal';
import SidebarSelectOptionModal from './Modal/sidebarSelectOptionModal';
import Navbar from './Navbar';
import MobileLayout from './Navbar/mobileLayout';
import Account from './Navbar/Account';
import { Main } from 'components/Theme/StyledComponents';
import { theme } from 'components/Theme/createTheme';
import { TopHeader } from './Navbar/navbar-style';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { loginMethod, isLoggedIn } = useGetLoginInfo();
  const { address } = useGetAccountInfo();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = accessTokenServices?.hooks?.useGetIsAuthenticated?.(
    address,
    accessTokenServices?.maiarIdApi,
    isLoggedIn
  );
  interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
  }

  const loggedIn = loginMethod != '';
  React.useEffect(() => {
    if (loggedIn) {
      refreshAccount();
      fetchAccountData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  React.useEffect(() => {
    fetchEconomics();
  }, []);

  useEffect(() => {
    readMultisigContracts();
  }, [address, isAuthenticated?.isAuthenticated]);

  async function readMultisigContracts() {
    if (uniqueContractAddress || storageApi == null) {
      dispatch(
        setMultisigContracts([
          { address: uniqueContractAddress, name: uniqueContractName ?? '' }
        ])
      );
      return;
    }
    if (isAuthenticated?.isAuthenticated) {
      const contracts = await getUserMultisigContractsList();
      dispatch(setMultisigContracts(contracts));
    }
  }

  async function fetchEconomics() {
    const economics = await getEconomicsData();
    if (economics !== null) {
      dispatch(setEconomics(economics));
    }
  }

  async function fetchAccountData() {
    const accountData = await getAccountData(address);
    if (accountData !== null) {
      dispatch(setAccountData(accountData));
    }
  }
  const width = useMediaQuery(theme.breakpoints.up('sm'));

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open'
  })<AppBarProps>(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    boxShadow: 'unset',
    right: 'auto',
    left: 'auto'
  }));

  return (
    <div className='flex-row flex-fill wrapper page-wrapper'>
      {width ? <Navbar /> : <MobileLayout />}
      <Main
        className='flex-row flex-fill position-relative justify-center'
        style={{ paddingLeft: '10px', paddingRight: '10px' }}
      >
        <Box sx={{ padding: '6rem 0px' }}>
          <AppBar sx={{ width: 'calc(100% - 255px)', zIndex: '1' }}>
            {width ? (
              <TopHeader
                className='d-flex justify-content-between px-4 py-3 align-items-center'
                sx={{
                  position: 'absolute',
                  width: '100%'
                }}
              >
                <Box>
                  <PageBreadcrumbs />
                </Box>
                <Account />
                {/* <Network /> */}
              </TopHeader>
            ) : (
              ''
            )}
          </AppBar>
          <AuthenticatedRoutesWrapper
            routes={routes}
            unlockRoute={routeNames.unlock}
          >
            {children}
          </AuthenticatedRoutesWrapper>
          <TokenWrapper />
          <ModalLayer />
          <SidebarSelectOptionModal />
        </Box>
      </Main>
    </div>
  );
};

export default Layout;
