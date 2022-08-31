import { useEffect } from 'react';
import {
  AuthenticatedRoutesWrapper,
  refreshAccount,
  useGetAccountInfo,
  useGetLoginInfo,
} from '@elrondnetwork/dapp-core';
import { Box, styled } from '@mui/material';
import MuiAppBar, { AppBarProps } from '@mui/material/AppBar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch } from 'react-redux';
import { getUserMultisigContractsList } from 'src/apiCalls/multisigContractsCalls';
import { uniqueContractAddress, uniqueContractName } from 'src/multisigConfig';
import { setAccountData } from 'src/redux/slices/accountSlice';
import { setEconomics } from 'src/redux/slices/economicsSlice';
import { setMultisigContracts } from 'src/redux/slices/multisigContractsSlice';
import routes from 'src/routes';
import { accessTokenServices, storageApi } from 'src/services/accessTokenServices';
import { Main } from 'src/components/Theme/StyledComponents';
import routeNames from 'src/routes/routeNames';
import { ElrondApiProvider } from 'src/services/ElrondApiNetworkProvider';
import { TokenWrapper } from '../TokenWrapper';
import PageBreadcrumbs from './Breadcrumb';
import ModalLayer from './Modal';
import SidebarSelectOptionModal from './Modal/sidebarSelectOptionModal';
import Account from './Navbar/Account';
import { TopHeader } from './Navbar/navbar-style';
import MobileLayout from './Navbar/mobileLayout';
import Navbar from './Navbar/index';

function Layout({ children }: { children: React.ReactNode }) {
  const { loginMethod, isLoggedIn } = useGetLoginInfo();
  const { address } = useGetAccountInfo();
  const dispatch = useDispatch();
  const isAuthenticated = accessTokenServices?.hooks?.useGetIsAuthenticated?.(
    address,
    accessTokenServices?.maiarIdApi,
    isLoggedIn,
  );

  const loggedIn = loginMethod !== '';

  async function fetchAccountData() {
    const accountData = await ElrondApiProvider.getAccountData(address);
    if (accountData !== null) {
      dispatch(setAccountData(accountData));
    }
  }

  useEffect(() => {
    if (loggedIn) {
      refreshAccount();
      fetchAccountData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  async function readMultisigContracts() {
    if (uniqueContractAddress || storageApi == null) {
      dispatch(
        setMultisigContracts([
          { address: uniqueContractAddress, name: uniqueContractName ?? '' },
        ]),
      );
      return;
    }
    if (isAuthenticated?.isAuthenticated) {
      console.log({ isAuthenticated });
      console.log('getting user contracts list');
      const contracts = await getUserMultisigContractsList();
      dispatch(setMultisigContracts(contracts));
    }
  }

  useEffect(() => {
    console.log('trying to read multisig contracts list');
    readMultisigContracts();
  }, [address, isAuthenticated?.isAuthenticated]);

  async function fetchEconomics() {
    const economics = await ElrondApiProvider.getEconomicsData();
    if (economics !== null) {
      dispatch(setEconomics(economics));
    }
  }

  useEffect(() => {
    fetchEconomics();
  }, []);

  const width = useMediaQuery('(min-width:600px)');

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })<AppBarProps>(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    boxShadow: 'unset',
    right: 'auto',
    left: 'auto',
  }));

  return (
    <div className="bg-light flex-row flex-fill wrapper page-wrapper">
      {width ? <Navbar /> : <MobileLayout />}
      <Main
        className="flex-row flex-fill position-relative justify-center"
        style={{ paddingLeft: '10px', paddingRight: '10px' }}
      >
        <Box sx={{ padding: '6rem 0px' }}>
          <AppBar sx={{ width: 'calc(100% - 255px)', zIndex: '1' }}>
            {width ? (
              <TopHeader
                className="d-flex justify-content-between px-4 py-3 align-items-center"
                sx={{
                  position: 'absolute',
                  width: '100%',
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
            unlockRoute={routeNames.multisigAddress}
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
}

export default Layout;
