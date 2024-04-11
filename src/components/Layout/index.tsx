import { useCallback, useEffect } from 'react';
import {
  useGetAccountInfo,
  useGetLoginInfo,
} from '@multiversx/sdk-dapp/hooks/account';
import {
  AuthenticatedRoutesWrapper,
  AxiosInterceptorContext,
} from '@multiversx/sdk-dapp/wrappers';
import { Box, IconButton } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import { setAccountData } from 'src/redux/slices/accountGeneralInfoSlice';
import { setEconomics } from 'src/redux/slices/economicsSlice';
import {
  setCurrentMultisigContract,
  setMultisigContracts,
} from 'src/redux/slices/multisigContractsSlice';
import routes from 'src/routes';
import { Main } from 'src/components/Theme/StyledComponents';
import { useCustomTheme } from 'src/hooks/useCustomTheme';
import { isDarkThemeEnabledSelector } from 'src/redux/selectors/appConfigSelector';
import routeNames from 'src/routes/routeNames';
import { MultiversxApiProvider } from 'src/services/MultiversxApiNetworkProvider';
import { Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { setProposeModalSelectedOption } from 'src/redux/slices/modalsSlice';
import { QueryKeys } from 'src/react-query/queryKeys';
import { useQuery } from 'react-query';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import axios from 'axios';
import { network } from 'src/config';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { setSelectedTheme } from 'src/redux/slices/appConfigSlice';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import PageBreadcrumbs from './Breadcrumb';
import ModalLayer from './Modal';
import SidebarSelectOptionModal from './Modal/sidebarSelectOptionModal';
import Account from './Navbar/Account';
import {
  AppBarWrapper,
  SidebarAndMainWrapper,
  TopHeader,
} from './Navbar/navbar-style';
import MobileLayout from './Navbar/mobileLayout';
import Navbar from './Navbar/index';
import NavbarLogo from './Navbar/Logo';
import { CenteredBox } from '../StyledComponents/StyledComponents';
import NetworkAnnouncer from '../Utils/NetworkAnnouncer';

function Layout({ children }: { children: React.ReactNode }) {
  const theme = useCustomTheme();
  const { isLoggedIn, tokenLogin } = useGetLoginInfo();
  const { address } = useGetAccountInfo();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDarkThemeEnabled = useSelector(isDarkThemeEnabledSelector);
  const currentContract = useSelector(currentMultisigContractSelector);

  const fetchAccountData = useCallback(async () => {
    const accountData = await MultiversxApiProvider.getAccountData(address);
    if (accountData !== null) {
      dispatch(setAccountData(accountData));
    }
  }, [address, dispatch]);

  const fetchAttachedContracts = useCallback(async () => {
    if (!address || address === '') return [];
    const { data } = await axios.get(`/settings/${address}`, {
      baseURL: network.storageApi,
      headers: {
        Authorization: `Bearer ${tokenLogin?.nativeAuthToken}`,
      },
    });

    return data && data !== '' ? data : [];
  }, [address, tokenLogin?.nativeAuthToken]);

  const {
    refetch: refetchAttachedContracts,
    isFetching: isFetchingContracts,
    isLoading: isLoadingContracts,
    data: attachedContracts,
  } = useQuery(
    [QueryKeys.ATTACHED_CONTRACTS, address],
    fetchAttachedContracts,
    {
      ...USE_QUERY_DEFAULT_CONFIG,
      enabled:
        isLoggedIn &&
        (!currentContract?.address || currentContract?.address === ''),
    },
  );

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(setProposeModalSelectedOption(null));
    }
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      console.log('Refetching attached contracts');
      refetchAttachedContracts();
    }
  }, [fetchAccountData, isLoggedIn, refetchAttachedContracts]);

  useEffect(() => {
    if (
      isLoggedIn &&
      attachedContracts &&
      !isFetchingContracts &&
      !isLoadingContracts
    ) {
      dispatch(setProposeModalSelectedOption(null));
      (async function getContracts() {
        const contracts = attachedContracts;
        dispatch(setMultisigContracts(contracts));

        if (contracts.length > 0 && !currentContract?.address) {
          const [firstContract] = contracts;
          dispatch(setCurrentMultisigContract(firstContract.address));
          navigate(`${routeNames.multisig}/${firstContract.address}`);
        }
      })();
    }
  }, [
    isLoggedIn,
    address,
    dispatch,
    currentContract?.address,
    navigate,
    fetchAccountData,
    attachedContracts,
    isFetchingContracts,
    isLoadingContracts,
  ]);

  const fetchEconomics = useCallback(async () => {
    const economics = await MultiversxApiProvider.getEconomicsData();
    if (economics !== null) {
      dispatch(setEconomics(economics));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchEconomics();
  }, [fetchEconomics]);

  useEffect(() => {
    const body = document.querySelector('body');
    if (body) {
      body.style.background = theme.palette.background.default;
    }
  }, [isDarkThemeEnabled, theme.palette.background.default]);

  const minWidth600 = useMediaQuery('(min-width:600px)');
  const onChangeTheme = useCallback(() => {
    const newTheme = isDarkThemeEnabled ? 'Light' : 'Dark';
    dispatch(setSelectedTheme(newTheme));
  }, [dispatch, isDarkThemeEnabled]);

  return (
    <Box sx={{ height: '100vh' }}>
      <AppBarWrapper>
        {minWidth600 ? (
          <TopHeader className="d-flex justify-content-between px-4 py-3 align-items-center">
            <Box className="p-0 d-flex align-items-center justify-content-between">
              <Box className="p-0 d-flex align-items-center justify-content-center">
                <NavbarLogo />
                <CenteredBox>
                  <Nav className="ml-auto align-items-center" />
                </CenteredBox>
              </Box>
              <Box>
                <PageBreadcrumbs />
              </Box>
            </Box>
            <Box display="flex">
              <IconButton
                onClick={onChangeTheme}
                color="inherit"
                sx={{ mr: '16px' }}
              >
                {isDarkThemeEnabled ? (
                  <Brightness7Icon htmlColor="#fff" />
                ) : (
                  <DarkModeIcon htmlColor="#4c2ffc" />
                )}
              </IconButton>
              <NetworkAnnouncer network={network.name} />
              <Account />
            </Box>
          </TopHeader>
        ) : (
          ''
        )}
      </AppBarWrapper>
      <SidebarAndMainWrapper>
        {minWidth600 ? <Navbar /> : <MobileLayout />}
        <Main>
          <Box>
            <AuthenticatedRoutesWrapper
              routes={routes}
              unlockRoute={routeNames.multisig}
            >
              <AxiosInterceptorContext.Listener />
              {children}
            </AuthenticatedRoutesWrapper>
            <ModalLayer />
            <SidebarSelectOptionModal />
          </Box>
        </Main>
      </SidebarAndMainWrapper>
    </Box>
  );
}

export default Layout;
