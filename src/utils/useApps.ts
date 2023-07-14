import { useCallback, useMemo } from 'react';
import { AppIdentifiers } from 'src/pages/Marketplace/appIds';
import { LOCAL_STORAGE_KEYS } from 'src/pages/Marketplace/localStorageKeys';
import {
  availableApps,
  MarketplaceApp,
  MenuItem,
  preinstalledApps,
} from './menuItems';
import { useLocalStorage } from './useLocalStorage';

export interface IUseAppsReturnType {
  installApp: (app: MarketplaceApp) => void;
  uninstallApp: (appId: string) => void;
  isAppInstalled: (appId: string) => boolean;
  installedAppIds: string[];
  preinstalledApps: MenuItem[];
  allMarketplaceApps: MarketplaceApp[];
  installedApps: MarketplaceApp[];
}

export const useApps = (): IUseAppsReturnType => {
  const [installedAppIds, setInstalledAppIds] = useLocalStorage(
    LOCAL_STORAGE_KEYS.INSTALLED_APPS,
    [],
  );

  const allMarketplaceApps = useMemo(
    () =>
      availableApps
        .map((app) => ({
          ...app,
          isInstalled: installedAppIds.includes(app.id),
        }))
        .filter((app) => app.id !== AppIdentifiers.NoAppsInstalled),
    [installedAppIds],
  );

  const installedApps = useMemo(() => {
    const alreadyInstalledApps = availableApps.filter((app) =>
      installedAppIds.includes(app.id),
    );

    const preinstalledFilteredApps =
      alreadyInstalledApps.length === 0
        ? preinstalledApps
        : preinstalledApps.filter(
            (app) => app.id !== AppIdentifiers.NoAppsInstalled,
          );

    return [...preinstalledFilteredApps, ...alreadyInstalledApps];
  }, [installedAppIds]);

  const installApp = useCallback(
    (newApp: MarketplaceApp) => {
      const newInstalledApps = installedAppIds.includes(newApp.id)
        ? installedAppIds
        : [...installedAppIds, newApp.id];
      setInstalledAppIds(newInstalledApps);
    },
    [installedAppIds, setInstalledAppIds],
  );

  const uninstallApp = useCallback(
    (appId: string) => {
      const filteredInstalledApps = installedAppIds.filter(
        (installedAppId: string) => installedAppId !== appId,
      );
      setInstalledAppIds(filteredInstalledApps);
    },
    [installedAppIds, setInstalledAppIds],
  );

  const isAppInstalled = useCallback(
    (appId: string) => installedAppIds.includes(appId),
    [installedAppIds],
  );

  return {
    installApp,
    uninstallApp,
    isAppInstalled,
    installedApps,
    installedAppIds,
    preinstalledApps,
    allMarketplaceApps,
  };
};
