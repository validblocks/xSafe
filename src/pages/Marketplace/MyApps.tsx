import { Box, useMediaQuery } from '@mui/material';
import { MarketplaceApp } from 'src/utils/menuItems';
import { useApps } from 'src/utils/useApps';
import AppCard from './AppCard';

const MyApps = () => {
  const {
    installedApps,
    uninstallApp,
  } = useApps();

  const widthBetween460And600 = useMediaQuery('(min-width:460px) and (max-width:600px)');
  const maxWidth600 = useMediaQuery('(max-width:600px)');

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
            actionButtonOnClick={() => uninstallApp(app.id)}
          />
        ))
        }
    </Box>
  );
};

export default MyApps;
