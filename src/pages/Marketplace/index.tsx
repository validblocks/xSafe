import { Box } from '@mui/material';
import { availableApps, MenuItem } from 'src/utils/menuItems';
import { useLocalStorage } from 'src/utils/useLocalStorage';
import AppCard from './AppCard';
import { LOCAL_STORAGE_KEYS } from './localStorageKeys';

const Marketplace = () => {
  const [installedApps, setInstalledApps, updateLocalStorage] = useLocalStorage(LOCAL_STORAGE_KEYS.INSTALLED_APPS, []);
  return (
    <Box display={'flex'} alignItems={'center'} gap={2}>
      {
        availableApps.map((app: MenuItem) => (
          <AppCard
            imgUrl={`https://picsum.photos/200/200?random=${Math.random()}`}
            title={app.name}
            description={app?.description}
            actionButtonText={installedApps.includes(app.id) ? 'Installed' : 'Install'}
            actionButtonOnClick={() => {
              setInstalledApps((apps: string[]) => (
                apps.includes(app.id)
                  ? apps
                  : [...apps, app.id]
              ));
              updateLocalStorage();
            }}
          />
        ))
        }
    </Box>
  );
};

export default Marketplace;
