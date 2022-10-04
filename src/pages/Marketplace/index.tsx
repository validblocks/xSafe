import { Grid } from '@mui/material';
import { MarketplaceApp } from 'src/utils/menuItems';
import { useApps } from 'src/utils/useApps';
import AppCard from './AppCard';

const Marketplace = () => {
  const {
    installApp,
    allMarketplaceApps,
  } = useApps();

  return (
    <Grid container gap={2}>
      {
        allMarketplaceApps.map((app: MarketplaceApp) => (
          <Grid item minWidth={310} xs={12} sm={6} md={4} lg={3}>
            <AppCard
              key={app.id}
              imgUrl={app.imageUrl}
              title={app.name}
              description={app?.description}
              isInstallable={app.isInstallable}
              isInstalled={app?.isInstalled ?? false}
              actionButtonText={app.isInstalled ? 'App Installed' : 'Install App'}
              actionButtonOnClick={() => installApp(app)}
            />
          </Grid>
        ))
        }
    </Grid>
  );
};

export default Marketplace;
