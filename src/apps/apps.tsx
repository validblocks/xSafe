import MoreAppsLight from 'src/assets/img/MoreAppsLight.png';
import MoreAppsDark from 'src/assets/img/MoreAppsDark.png';
import { lazy } from 'react';
import DiamondIcon from '@mui/icons-material/Diamond';
import { RawTransactionType } from 'src/helpers/types';
import { MultisigActionDetailed } from 'src/types/MultisigActionDetailed';
import { withInstallGuard } from './withInstallGuard';
import { sampleAddAction, sampleRemoveAction, sampleTransaction } from './example-app/samples';

export interface AppWithRouteConfig {
  component: React.ComponentType;
  name: string;
  id: string;
  link: string;
  description: string;
  path: string;
  icon: any; // MUI-icon
  imageUrlLight: any;
  imageUrlDark: any;
  isInstallable: boolean;
  title: string;
  transaction?: RawTransactionType;
  action?: MultisigActionDetailed;
}

export const apps: AppWithRouteConfig[] = [
  {
    name: 'My Awesome App',
    component: lazy(() =>
      import('./example-app/index').then((module) => ({
        default: module.default,
      })),
    ),
    link: 'example-app',
    id: 'example-app',
    description: 'Congrats! You successfully created your first app for xSafe!',
    imageUrlLight: MoreAppsLight,
    imageUrlDark: MoreAppsDark,
    isInstallable: true,
    icon: <DiamondIcon />,
    path: '/example-app',
    title: 'My Awesome App',
    transaction: sampleTransaction,
    action: sampleAddAction,
  },
  {
    name: 'My Awesome App 2',
    component: lazy(() =>
      import('./example-app/index').then((module) => ({
        default: module.default,
      })),
    ),
    link: 'example-app-2',
    id: 'example-app-2',
    description: 'Congrats! You successfully created your first app for xSafe!',
    imageUrlLight: MoreAppsLight,
    imageUrlDark: MoreAppsDark,
    isInstallable: true,
    icon: <DiamondIcon />,
    path: '/example-app-2',
    title: 'My Awesome App 2',
    transaction: sampleTransaction,
    action: sampleRemoveAction,
  },
  {
    name: 'My Awesome App 3',
    component: lazy(() =>
      import('./example-app/index').then((module) => ({
        default: module.default,
      })),
    ),
    link: 'example-app-3',
    id: 'example-app-3',
    description: 'Congrats! You successfully created your first app for xSafe!',
    imageUrlLight: MoreAppsLight,
    imageUrlDark: MoreAppsDark,
    isInstallable: true,
    icon: <DiamondIcon />,
    path: '/example-app-3',
    title: 'My Awesome App 3',
  },
];

export const appsWithRouteConfig = apps.map((app) => ({
  ...app,
  component: withInstallGuard(
    app.id,
    app.component,
  ),
}));
