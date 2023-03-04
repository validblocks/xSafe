import { memo, useMemo } from 'react';
import { useApps } from 'src/utils/useApps';
import AppNotInstalled from './AppNotInstalled';

export const withInstallGuard = (appId: string, wrappedComponent: React.ComponentType) => () => {
  const { isAppInstalled } = useApps();
  const Memoized = memo(wrappedComponent);
  const isAppReachable = useMemo(() => isAppInstalled(appId), [isAppInstalled]);

  if (!isAppReachable) {
    return <AppNotInstalled />;
  }

  return <Memoized />;
};
