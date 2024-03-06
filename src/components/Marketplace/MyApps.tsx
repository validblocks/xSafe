import { Grid, useMediaQuery } from '@mui/material';
import { useMemo } from 'react';
import { useCustomTranslation } from 'src/hooks/useCustomTranslation';
import { useSelector } from 'react-redux';
import { isDarkThemeEnabledSelector } from 'src/redux/selectors/appConfigSelector';
import { MarketplaceApp } from 'src/utils/menuItems';
import { useApps } from 'src/hooks/useApps';
import { useLocalStorage } from 'src/hooks/useLocalStorage';
import NoActionsOverlay from '../Utils/NoActionsOverlay';
import AppCard from './AppCard';
import { AppIdentifiers } from './appIds';
import { LOCAL_STORAGE_KEYS } from './localStorageKeys';

const MyApps = () => {
  const t = useCustomTranslation();
  const { installedApps, uninstallApp } = useApps();

  const myApps = useMemo(
    () =>
      installedApps.filter((app) => app.id !== AppIdentifiers.NoAppsInstalled),
    [installedApps],
  );

  const widthBetween460And600 = useMediaQuery(
    '(min-width:460px) and (max-width:600px)',
  );
  const maxWidth600 = useMediaQuery('(max-width:600px)');
  const minWidth600 = useMediaQuery('(min-width:600px)');

  const isDarkThemeEnabled = useSelector(isDarkThemeEnabledSelector);

  const [_pinnedApps, setPinnedApps] = useLocalStorage(
    LOCAL_STORAGE_KEYS.PINNED_APPS,
    [],
  );

  const handleUnpinApps = (app: MarketplaceApp) =>
    setPinnedApps((apps: string[]) => apps.filter((appId) => appId !== app.id));

  return (
    <Grid
      container
      gap={2}
      // eslint-disable-next-line no-nested-ternary
      flexDirection={
        widthBetween460And600 ? 'row' : minWidth600 ? 'row' : 'column'
      }
      justifyContent={widthBetween460And600 ? 'space-between' : 'flex-start'}
      marginTop={maxWidth600 ? '50px' : 0}
      paddingBottom={maxWidth600 ? '42px' : 0}
    >
      {myApps.length === 0 ? (
        <NoActionsOverlay message={t('No apps installed')} />
      ) : (
        myApps.map((app) => (
          <Grid
            item
            key={app.id}
            minWidth={widthBetween460And600 ? 'auto' : 310}
            xs={12}
            sm={6}
            md={4}
            lg={1}
            width={widthBetween460And600 ? '48.13%' : '310'}
            flexBasis={widthBetween460And600 ? '48.13%' : '100%'}
          >
            <AppCard
              key={app.id}
              imgUrl={isDarkThemeEnabled ? app.imageUrlDark : app.imageUrlLight}
              title={app?.title ?? ''}
              description={app?.description}
              isInstallable={app.isInstallable}
              isInstalled={app?.isInstalled ?? false}
              actionButtonText={'Uninstall App'}
              actionButtonOnClick={() => {
                uninstallApp(app.id);
                handleUnpinApps(app);
              }}
            />
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default MyApps;
