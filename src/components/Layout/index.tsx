import React, { useEffect } from 'react';
import {
  AuthenticatedRoutesWrapper,
  refreshAccount,
  useGetAccountInfo,
  useGetLoginInfo
} from '@elrondnetwork/dapp-core';
import { Box } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAccountData } from 'apiCalls/accountCalls';
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
  const width = useMediaQuery('(min-width:600px)');

  return (
    <div
      style={{ display: 'none !important', background: '#F4F6FD' }}
      className='bg-light flex-row flex-fill wrapper page-wrapper'
    >
      {width ? <Navbar /> : <MobileLayout />}

      <main className=' flex-row flex-fill position-relative justify-center'>
        <AuthenticatedRoutesWrapper
          routes={routes}
          unlockRoute={routeNames.unlock}
        >
          {children}
        </AuthenticatedRoutesWrapper>
        <TokenWrapper />
        <ModalLayer />
        <SidebarSelectOptionModal />
      </main>
    </div>
  );
};

export default Layout;
