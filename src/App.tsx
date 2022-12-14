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
import routes from 'src/routes';
import { DappProvider } from '@elrondnetwork/dapp-core/wrappers';
import {
  TransactionsToastList,
  SignTransactionsModals,
  NotificationModal,
} from '@elrondnetwork/dapp-core/UI';
import i18next from 'i18next';
import { englishTranslations } from './i18n/en';
import { germanTranslations } from './i18n/de';
import Layout from './components/Layout';
import PageNotFound from './components/PageNotFound';
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
    <PersistGate loading={null} persistor={persistor}>
      <CssBaseline />
      <CustomThemeProvider>
        <DappProvider environment="devnet">
          <QueryClientProvider client={queryClient}>
            <OrganizationInfoContextProvider>
              <>
                <SignTransactionsModals />
                <TransactionsToastList />
                <NotificationModal />
                <Router basename={process.env.PUBLIC_URL}>
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
                </Router>
              </>
            </OrganizationInfoContextProvider>
          </QueryClientProvider>
        </DappProvider>
      </CustomThemeProvider>
    </PersistGate>
  </ReduxProvider>
);
