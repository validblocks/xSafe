import MoreAppsLight from 'src/assets/img/MoreAppsLight.png';
import MoreAppsDark from 'src/assets/img/MoreAppsDark.png';
import { lazy } from 'react';
import DiamondIcon from '@mui/icons-material/Diamond';
import { withInstallGuard } from './withInstallGuard';

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
}

export const apps: AppWithRouteConfig[] = [
  {
    name: 'Example App',
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
    title: 'Example App',
  },
];

export const appsWithRouteConfig = apps.map((app) => ({
  ...app,
  component: withInstallGuard(
    app.id,
    app.component,
  ),
}));
