import React, { useEffect } from 'react';
import {
  AuthenticatedRoutesWrapper,
  refreshAccount,
  useGetAccountInfo,
  useGetLoginInfo
} from '@elrondnetwork/dapp-core';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAccountData } from 'apiCalls/accountCalls';
import { getEconomicsData } from 'apiCalls/economicsCalls';
import { getUserMultisigContractsList } from 'apiCalls/multisigContractsCalls';
import { uniqueContractAddress, uniqueContractName } from 'multisigConfig';
import { setAccountData } from 'redux/slices/accountSlice';
import { setEconomics } from 'redux/slices/economicsSlice';
import { setMultisigContracts } from 'redux/slices/multisigContractsSlice';
import routes, { routeNames } from 'routes';
('');
import { accessTokenServices, storageApi } from 'services/accessTokenServices';
import { TokenWrapper } from '../TokenWrapper';
import ModalLayer from './Modal';
import Navbar from './Navbar';

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
      navigate('/multisig/' + uniqueContractAddress);
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

  return (
    <div
      style={{ display: 'none !important' }}
      className='bg-light d-flex flex-row flex-fill wrapper'
    >
      <Navbar />

      <main className='d-flex flex-row flex-fill position-relative justify-center  container'>
        <AuthenticatedRoutesWrapper
          routes={routes}
          unlockRoute={routeNames.unlock}
        >
          {children}
        </AuthenticatedRoutesWrapper>
        <TokenWrapper />
        <ModalLayer />
      </main>
    </div>
    // {/* <OrganizationInfoContextProvider>
    //   <Organization />
    //   <OrganizationTokens />
    //   <NewDashboard />
    //   <AssetsPage />
    //   <TransactionsPage />
    // </OrganizationInfoContextProvider> */}
  );
};

export default Layout;
