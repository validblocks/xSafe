import { Grid, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isDarkThemeEnabledSelector } from 'src/redux/selectors/appConfigSelector';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { MarketplaceApp } from 'src/utils/menuItems';
import { useApps } from 'src/utils/useApps';
import { useLocalStorage } from 'src/utils/useLocalStorage';
import { NoteSpan } from '../Settings/settings-style';
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
  const currentContract = useSelector(currentMultisigContractSelector);

  const isDarkThemeEnabled = useSelector(isDarkThemeEnabledSelector);

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
      gap={widthBetween460And600 ? 2 : '10px'}
      // eslint-disable-next-line no-nested-ternary
      flexDirection={widthBetween460And600 ? 'row' : minWidth600 ? 'row' : 'column'}
      justifyContent={widthBetween460And600 ? 'space-between' : 'flex-start'}
      marginTop={maxWidth600 ? '50px' : 0}
      paddingBottom={maxWidth600 ? '42px' : 0}
    >
      {
        !(currentContract?.address.length > 0) && (
        <NoteSpan mb="5px">
          Looks like you don't have a safe available yet. Simply connect your wallet, create a new safe, and start installing any app you need.
        </NoteSpan>
        )
      }
      {
        allMarketplaceApps.map((app: MarketplaceApp) => (
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
              title={app.title}
              description={app?.description}
              isInstallable={app.isInstallable}
              isInstalled={app?.isInstalled ?? false}
              actionButtonText={app.isInstalled ? 'Installed' : 'Install App'}
              actionButtonOnClick={() => installApp(app)}
              actionButtonOnPin={() => handlePinApps(app)}
              pinStatus={pinnedApps.includes(app.id)}
            />
          </Grid>
        ))
        }
    </Grid>
  );
};

export default Marketplace;
