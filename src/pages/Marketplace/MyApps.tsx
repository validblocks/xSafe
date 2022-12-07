import { Box, useMediaQuery } from '@mui/material';
import { MarketplaceApp } from 'src/utils/menuItems';
import { useApps } from 'src/utils/useApps';
import { useLocalStorage } from 'src/utils/useLocalStorage';
import AppCard from './AppCard';
import { LOCAL_STORAGE_KEYS } from './localStorageKeys';

const MyApps = () => {
  const {
    installedApps,
    uninstallApp,
  } = useApps();

  const widthBetween460And600 = useMediaQuery('(min-width:460px) and (max-width:600px)');
  const maxWidth600 = useMediaQuery('(max-width:600px)');

  const [_pinnedApps, setPinnedApps] = useLocalStorage(LOCAL_STORAGE_KEYS.PINNED_APPS, []);

  const handleUnpinApps = (app: MarketplaceApp) => setPinnedApps((apps: string[]) =>
    (apps.filter((appId) => appId !== app.id)));

  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      gap={2}
      width={widthBetween460And600 ? '48%' : '100%'}
      marginTop={maxWidth600 ? '50px' : 0}
    >
      {
        installedApps.map((app: MarketplaceApp) => (
          <AppCard
            key={app.id}
            imgUrl={app.imageUrl}
            title={app.name}
            description={app?.description}
            isInstallable={app.isInstallable}
            isInstalled={app?.isInstalled ?? false}
            actionButtonText={'Uninstall App'}
            actionButtonOnClick={() => {
              uninstallApp(app.id);
              handleUnpinApps(app);
            }}
          />
        ))
        }
    </Box>
  );
};

export default MyApps;
