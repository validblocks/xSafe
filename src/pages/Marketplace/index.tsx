import { Grid, useMediaQuery } from '@mui/material';
import { MarketplaceApp } from 'src/utils/menuItems';
import { useApps } from 'src/utils/useApps';
import AppCard from './AppCard';

const Marketplace = () => {
  const {
    installApp,
    allMarketplaceApps,
  } = useApps();

  const widthBetween460And600 = useMediaQuery('(min-width:460px) and (max-width:600px)');
  const minWidth600 = useMediaQuery('(min-width:600px)');
  const maxWidth600 = useMediaQuery('(max-width:600px)');

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
