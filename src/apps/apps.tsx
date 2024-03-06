import DiamondIcon from '@mui/icons-material/Diamond';
import ClaimEarningsLight from 'src/assets/img/claimearnings_light.svg';
import ClaimEarningsDark from 'src/assets/img/claimearnings_dark.svg';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import { RawTransactionType } from 'src/types/transactions';
import { MultisigActionDetailed } from 'src/types/multisig/MultisigActionDetailed';
import { withInstallGuard } from './withInstallGuard';
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/types';
import { sampleTransaction, sampleRemoveAction } from './example-app/samples';
import MoreAppsDark from 'src/assets/img/MoreAppsDark.png';
import MoreAppsLight from 'src/assets/img/MoreAppsLight.png';
import { sampleLendAction } from './jewelswap/samples';
import LendInJewelSwap from './jewelswap';
import ClaimNftAuction from './nft-auctions/index';
import ExampleApp from './example-app/index';

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

const commonApps = [
  {
    name: 'xSpotlight',
    component: ClaimNftAuction,
    link: 'xspotlight-claim',
    id: 'xspotlight-claim',
    description:
      'Claim the resulting funds ($EGLD) from your NFT Auctions on xSpotlight.com!',
    imageUrlLight: ClaimEarningsLight,
    imageUrlDark: ClaimEarningsDark,
    isInstallable: true,
    icon: <FileDownloadRoundedIcon />,
    path: '/xspotlight-claim',
    title: 'xSpotlight Claim',
  },
  {
    name: 'JewelSwap',
    component: LendInJewelSwap,
    link: 'jewelswap',
    id: 'jewelswap',
    description:
      'Trade, Earn, Lend and Borrow with NFTs & $EGLD directly with JewelSwap!',
    imageUrlLight: MoreAppsLight,
    imageUrlDark: MoreAppsDark,
    isInstallable: true,
    icon: <DiamondIcon />,
    path: '/jewelswap',
    title: 'Jewelswap',
    action: sampleLendAction,
    transaction: sampleTransaction,
  },
];

export const apps: AppWithRouteConfig[] =
  import.meta.env.VITE_MVX_ENVIRONMENT === EnvironmentsEnum.mainnet
    ? commonApps
    : [
        ...commonApps,
        {
          name: 'My Awesome App',
          component: ExampleApp,
          link: 'example-app-2',
          id: 'example-app-2',
          description:
            'Congrats! You successfully created your first app for xSafe!',
          imageUrlLight: MoreAppsLight,
          imageUrlDark: MoreAppsDark,
          isInstallable: true,
          icon: <DiamondIcon />,
          path: '/example-app-2',
          title: 'My Awesome App 2',
          transaction: sampleTransaction,
          action: sampleRemoveAction,
        },
      ];

export const appsWithRouteConfig = apps.map((app) => ({
  ...app,
  component: withInstallGuard(app.id, app.component),
}));
