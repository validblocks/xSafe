import { Grid, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import { MarketplaceApp } from 'src/utils/menuItems';
import { useApps } from 'src/utils/useApps';
import { useLocalStorage } from 'src/utils/useLocalStorage';
import AppCard from './AppCard';
import { LOCAL_STORAGE_KEYS } from './localStorageKeys';

const Marketplace = () => {
  const {
    installApp,
    allMarketplaceApps,
  } = useApps();

  const widthBetween460And600 = useMediaQuery('(min-width:460px) and (max-width:600px)');
  const minWidth600 = useMediaQuery('(min-width:600px)');
  const maxWidth600 = useMediaQuery('(max-width:600px)');

  const [pinnedApps, setPinnedApps] = useLocalStorage(LOCAL_STORAGE_KEYS.PINNED_APPS, []);
  // eslint-disable-next-line no-unneeded-ternary
  const [pinned, setPinned] = useState(pinnedApps.length < 1 ? true : false);

  const handlePinApps = (app: MarketplaceApp) => {
    if (pinned) {
      setPinnedApps((apps: string[]) => (
        apps.includes(app.id)
          ? apps
          : [...apps, app.id]
      ));
    } else {
      setPinnedApps((apps: string[]) => (
        apps.filter((appId) => appId !== app.id)
      ));
    }
    setPinned(!pinned);
  };

  useEffect(() => setPinned(pinned), [pinned]);

  return (
    <Grid
      container
      gap={2}
      // eslint-disable-next-line no-nested-ternary
      flexDirection={widthBetween460And600 ? 'row' : minWidth600 ? 'row' : 'column'}
      justifyContent={widthBetween460And600 ? 'space-between' : 'flex-start'}
      marginTop={maxWidth600 ? '50px' : 0}
    >
      {
        allMarketplaceApps.map((app: MarketplaceApp) => (
          <Grid
            item
            minWidth={widthBetween460And600 ? 'auto' : 310}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            width={widthBetween460And600 ? '48.13%' : '310'}
            flexBasis={widthBetween460And600 ? '48.13%' : '100%'}
          >
            <AppCard
              key={app.id}
              imgUrl={app.imageUrl}
              title={app.name}
              description={app?.description}
              isInstallable={app.isInstallable}
              isInstalled={app?.isInstalled ?? false}
              actionButtonText={app.isInstalled ? 'Installed' : 'Install App'}
              actionButtonOnClick={() => installApp(app)}
              actionButtonOnPin={() => handlePinApps(app)}
            />
          </Grid>
        ))
        }
    </Grid>
  );
};

export default Marketplace;
