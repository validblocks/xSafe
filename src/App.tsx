import { CssBaseline } from '@mui/material';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import { initReactI18next } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import {
  apiTimeout,
  walletConnectV2ProjectId,
  sampleAuthenticatedDomains,
} from 'src/config';
import routes from 'src/routes';
import { AxiosInterceptorContext, DappProvider } from '@multiversx/sdk-dapp/wrappers';
import {
  TransactionsToastList,
  SignTransactionsModals,
  NotificationModal,
} from '@multiversx/sdk-dapp/UI';
import i18next from 'i18next';
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/types';
import { englishTranslations } from './i18n/en';
import { germanTranslations } from './i18n/de';
import Layout from './components/Layout';
import PageNotFound from './components/PageNotFound';
import { persistor, store } from './redux/store';
import OrganizationInfoContextProvider from './pages/Organization/OrganizationInfoContextProvider';
import CustomThemeProvider from './components/Theme/CustomThemeProvider';
import { SpotlightCommands } from './components/Utils/SpotlightCommands';

dayjs.extend(duration);
dayjs.extend(relativeTime);

dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
});

i18next.use(initReactI18next).init({
  resources: {
    en: {
      translation: englishTranslations,
    },
    de: {
      translation: germanTranslations,
    },
  },
  lng: 'en',
  fallbackLng: 'en',

  interpolation: {
    escapeValue: false,
  },
});

const queryClient = new QueryClient();

export const App = () => (
  <ReduxProvider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <CssBaseline />
      <CustomThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AxiosInterceptorContext.Provider>
            <AxiosInterceptorContext.Interceptor
              authenticatedDomanis={sampleAuthenticatedDomains}
            >
              <Router>
                <DappProvider
                  customNetworkConfig={{
                    name: 'customConfig',
                    apiTimeout,
                    walletConnectV2ProjectId,
                  }}
                  environment={EnvironmentsEnum.devnet}
                >
                  <>
                    <SpotlightCommands />
                    <OrganizationInfoContextProvider>
                      <Layout>

                        <>
                          <TransactionsToastList />
                          <NotificationModal />

                          <SignTransactionsModals className="custom-class-for-modals" />
                          <Routes>
                            {routes.map((route) => (
                              <Route
                                path={route.path}
                                key={route.path}
                                element={<route.component />}
                              />
                            ))}
                            <Route element={PageNotFound()} />
                          </Routes>
                        </>
                      </Layout>
                    </OrganizationInfoContextProvider>
                  </>
                </DappProvider>
              </Router>
            </AxiosInterceptorContext.Interceptor>
          </AxiosInterceptorContext.Provider>
        </QueryClientProvider>
      </CustomThemeProvider>
    </PersistGate>
  </ReduxProvider>
);
