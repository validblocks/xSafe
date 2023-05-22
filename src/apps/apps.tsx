import MoreAppsLight from 'src/assets/img/MoreAppsLight.png';
import MoreAppsDark from 'src/assets/img/MoreAppsDark.png';
import ClaimEarningsLight from 'src/assets/img/claimearnings_light.svg';
import ClaimEarningsDark from 'src/assets/img/claimearnings_dark.svg';
import { lazy } from 'react';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import { RawTransactionType } from 'src/helpers/types';
import { MultisigActionDetailed } from 'src/types/MultisigActionDetailed';
import DiamondIcon from '@mui/icons-material/Diamond';
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
    name: 'xSpotlight',
    component: lazy(() =>
      import('./nft-auctions/index').then((module) => ({
        default: module.default,
      })),
    ),
    link: 'xspotlight-claim',
    id: 'xspotlight-claim',
    description: 'Claim the resulting funds ($EGLD) from your NFT Auctions on xSpotlight.com!',
    imageUrlLight: ClaimEarningsLight,
    imageUrlDark: ClaimEarningsDark,
    isInstallable: true,
    icon: <FileDownloadRoundedIcon />,
    path: '/xspotlight-claim',
    title: 'xSpotlight Claim',
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
