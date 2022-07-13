import { DappProvider, DappUI } from '@elrondnetwork/dapp-core';
import { CssBaseline } from '@mui/material';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import { initReactI18next } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import i18next from 'i18next';
import { PersistGate } from 'redux-persist/integration/react';
import routes from 'src/routes';
import { englishTranslations } from './i18n/en';
import { germanTranslations } from './i18n/de';
import Layout from './components/Layout';
import PageNotFound from './components/PageNotFound';

import '@elrondnetwork/dapp-core/build/index.css';
import { persistor, store } from './redux/store';
import OrganizationInfoContextProvider from './pages/Organization/OrganizationInfoContextProvider';
import CustomThemeProvider from './components/Theme/CustomThemeProvider';

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
    <CssBaseline />
    <CustomThemeProvider>
      <DappProvider environment="devnet">
        <OrganizationInfoContextProvider>
          <QueryClientProvider client={queryClient}>
            <>
              <DappUI.SignTransactionsModals />
              <DappUI.TransactionsToastList />
              <DappUI.NotificationModal />
              <Router basename={process.env.PUBLIC_URL}>
                <PersistGate loading={null} persistor={persistor}>
                  <Layout>
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
                  </Layout>
                </PersistGate>
              </Router>
            </>
          </QueryClientProvider>
        </OrganizationInfoContextProvider>
      </DappProvider>
    </CustomThemeProvider>
  </ReduxProvider>
);
