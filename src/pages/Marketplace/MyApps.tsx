import { Box } from '@mui/material';
import { MarketplaceApp } from 'src/utils/menuItems';
import { useApps } from 'src/utils/useApps';
import AppCard from './AppCard';

const MyApps = () => {
  const {
    installedApps,
    uninstallApp,
  } = useApps();

  return (
    <Box display={'flex'} alignItems={'center'} gap={2}>
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
            actionButtonOnClick={() => uninstallApp(app.id)}
          />
        ))
        }
    </Box>
  );
};

export default MyApps;
