import { Box } from '@mui/material';
import { availableApps, MarketplaceApp } from 'src/utils/menuItems';
import { useLocalStorage } from 'src/utils/useLocalStorage';
import AppCard from './AppCard';
import { LOCAL_STORAGE_KEYS } from './localStorageKeys';

const Marketplace = () => {
  const [installedApps, setInstalledApps] = useLocalStorage(LOCAL_STORAGE_KEYS.INSTALLED_APPS, []);
  return (
    <Box display={'flex'} alignItems={'center'} gap={2}>
      {
        availableApps.map((app: MarketplaceApp) => (
          <AppCard
            key={app.id}
            imgUrl={app.imageUrl}
            title={app.name}
            description={app?.description}
            isInstallable={app.isInstallable}
            actionButtonText={installedApps.includes(app.id) ? 'Installed' : 'Install'}
            actionButtonOnClick={() => {
              setInstalledApps((apps: string[]) => (
                apps.includes(app.id)
                  ? apps
                  : [...apps, app.id]
              ));
            }}
          />
        ))
        }
    </Box>
  );
};

export default Marketplace;
