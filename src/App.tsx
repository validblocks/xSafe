import { DappProvider, DappUI } from '@elrondnetwork/dapp-core';
import { CssBaseline } from '@mui/material';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components';
import { germanTranslations } from 'i18n/de';
import { englishTranslations } from 'i18n/en';
import OrganizationInfoContextProvider from 'pages/Organization/OrganizationInfoContextProvider';
import { theme } from 'components/Theme/createTheme';
import routes from 'routes';
import { store, persistor } from '@redux/store';
import Layout from './components/Layout';
import PageNotFound from './components/PageNotFound';

import '@elrondnetwork/dapp-core/build/index.css';

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

i18n.use(initReactI18next).init({
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

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ReduxProvider store={store}>
        <DappProvider environment="devnet">
          <OrganizationInfoContextProvider>
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
                      <Route element={PageNotFound} />
                    </Routes>
                  </Layout>
                </PersistGate>
              </Router>
            </>
          </OrganizationInfoContextProvider>
        </DappProvider>
      </ReduxProvider>
    </ThemeProvider>
  );
}
