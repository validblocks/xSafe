import DiamondIcon from '@mui/icons-material/Diamond';
import ClaimEarningsLight from 'src/assets/img/claimearnings_light.svg';
import ClaimEarningsDark from 'src/assets/img/claimearnings_dark.svg';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import { RawTransactionType } from 'src/types/transactions';
import { MultisigActionDetailed } from 'src/types/multisig/MultisigActionDetailed';
import { withInstallGuard } from './withInstallGuard';
import { sampleTransaction, sampleRemoveAction } from './example-app/samples';
import { sampleLendAction } from './jewelswap/samples';
import LendInJewelSwap from './jewelswap';
import ClaimNftAuction from './nft-auctions/index';
import ExampleApp from './example-app/index';
import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import AppsIcon from '@mui/icons-material/Apps';
import GroupsIcon from '@mui/icons-material/Groups';
import HelpIcon from '@mui/icons-material/Help';
import MapsHomeWorkRoundedIcon from '@mui/icons-material/MapsHomeWorkRounded';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import { AppIdentifiers } from 'src/components/Marketplace/appIds';
import StakeAppThumbnail from 'src/assets/img/StakeAppThumbnail.png';
import OtherAppThumbnailLight from 'src/assets/img/OtherAppThumbnailLight.png';
import OtherAppThumbnailDark from 'src/assets/img/OtherAppThumbnailDark.png';
import StakeAppThumbnailDark from 'src/assets/img/StakeAppThumbnailDark.png';
import MoreAppsLight from 'src/assets/img/MoreAppsLight.png';
import MoreAppsDark from 'src/assets/img/MoreAppsDark.png';
import StakingIcon from 'src/assets/img/staking.svg';
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/types';
import { CallMade } from '@mui/icons-material';

console.log('apps.tsx loading...');

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

console.log('apps.tsx loaded');

console.log('menuItems loading...');

export type MenuItem = {
  name: string;
  link: string;
  icon: React.ReactElement;
  description?: string;
  id: string;
  submenu?: MenuItem[];
};

export type MarketplaceApp = MenuItem & {
  imageUrlLight?: string;
  imageUrlDark?: string;
  isInstalled?: boolean;
  isInstallable: boolean;
  title?: string;
};

export const preinstalledApps: MarketplaceApp[] = [
  {
    name: 'No apps installed',
    link: 'apps',
    id: AppIdentifiers.NoAppsInstalled,
    icon: <StorefrontOutlinedIcon />,
    description: '',
    imageUrlLight: StakeAppThumbnail,
    imageUrlDark: StakeAppThumbnailDark,
    isInstallable: true,
  },
];

export const availableApps: MarketplaceApp[] = [
  {
    name: 'Stake',
    title: 'Stake',
    link: 'stake',
    id: AppIdentifiers.Staking,
    description: 'Stake your tokens, secure the network and earn rewards.',
    icon: <img src={StakingIcon} />,
    imageUrlLight: StakeAppThumbnail,
    imageUrlDark: StakeAppThumbnailDark,
    isInstallable: true,
  },
  {
    name: 'SC Calls',
    title: 'Smart Contract Interactions',
    link: 'transaction-builder',
    id: AppIdentifiers.TransactionBuilder,
    description:
      'Compose custom smart contract interactions and create proposals.',
    icon: <CallMade />,
    imageUrlLight: StakeAppThumbnail,
    imageUrlDark: StakeAppThumbnailDark,
    isInstallable:
      import.meta.env.VITE_MVX_ENVIRONMENT !== EnvironmentsEnum.mainnet,
  },
  ...appsWithRouteConfig.map((app) => ({
    name: app.name,
    title: app.title,
    link: app.link,
    id: app.id,
    description: app.description,
    icon: app.icon,
    imageUrlLight: app.imageUrlLight,
    imageUrlDark: app.imageUrlDark,
    isInstallable: app.isInstallable,
  })),
  {
    name: 'Address Book',
    title: 'Address Book',
    link: 'app-coming-soon',
    id: 'app-coming-soon-2-menu-sub-item',
    description:
      'Save a list of frequently used addresses. They will be available for further use.',
    icon: <DiamondIcon />,
    imageUrlLight: OtherAppThumbnailLight,
    imageUrlDark: OtherAppThumbnailDark,
    isInstallable: false,
  },
  {
    name: 'More Apps',
    title: 'More Apps',
    link: 'more-apps-coming-soon',
    id: 'more-apps-coming-soon-2-menu-sub-item',
    description: 'You will find more community developed apps here very soon!',
    icon: <DiamondIcon />,
    imageUrlLight: MoreAppsLight,
    imageUrlDark: MoreAppsDark,
    isInstallable: false,
  },
];

export const topItems: MenuItem[] = [
  {
    name: 'Dashboard',
    link: 'dashboard',
    id: 'home-menu-item',
    icon: <GridViewOutlinedIcon />,
  },
  {
    name: 'Assets',
    link: 'assets',
    icon: <AttachMoneyIcon />,
    id: 'assets-menu-item',
    submenu: [
      {
        name: 'Tokens',
        link: 'tokens',
        id: 'tokens-menu-item',
        icon: <DiamondIcon />,
      },
      {
        name: 'NFTs',
        link: 'nft',
        id: 'nft-menu-item',
        icon: <DiamondIcon />,
      },
    ],
  },
  {
    name: 'Transactions',
    link: 'transactions',
    id: 'transactions-menu-item',
    icon: <CompareArrowsOutlinedIcon transform="rotate(90)" />,
  },
  {
    name: 'Apps',
    link: 'apps',
    id: 'apps-menu-item',
    icon: <AppsIcon />,
    submenu: [...preinstalledApps],
  },
  {
    name: 'Organization',
    link: 'organization',
    id: 'organization-menu-item',
    icon: <MapsHomeWorkRoundedIcon />,
    submenu: [
      {
        name: 'Members',
        link: 'members',
        id: 'members-menu-item',
        icon: <GroupsIcon />,
      },
      {
        name: 'Quorum',
        link: 'cvorum',
        id: 'cvorum-menu-item',
        icon: <PeopleIcon />,
      },
    ],
  },
];

export const bottomItems = [
  {
    name: 'Settings',
    id: 'settings-menu-item',
    link: 'settings',
    icon: <SettingsIcon />,
  },
  {
    name: 'Help Center',
    id: 'help-center-menu-item',
    link: 'help-center',
    icon: <HelpIcon />,
  },
];

export const mobileBottomItems = [
  {
    name: 'Dashboard',
    link: 'dashboard',
    id: 'home-menu-item',
    icon: <GridViewOutlinedIcon />,
  },
  {
    name: 'Assets',
    link: 'assets',
    id: 'assets-mobile-menu-item',

    icon: <AttachMoneyIcon />,
    submenu: [
      {
        name: 'Tokens',
        link: 'tokens',
        id: 'tokens-mobile-menu-item',
        icon: <AdjustOutlinedIcon />,
      },
      {
        name: 'NFTs',
        link: 'nft',
        id: 'nft-mobile-menu-item',

        icon: <DiamondIcon />,
      },
    ],
  },
  {
    name: 'Transactions',
    link: 'transactions',
    id: 'transactions-mobile-menu-item',

    icon: <CompareArrowsOutlinedIcon />,
  },
  {
    name: 'Apps',
    link: 'apps',
    id: 'apps-mobile-menu-item',
    icon: <AppsIcon />,
    submenu: [...preinstalledApps],
  },
];

export const mobileDropDownItems = [
  {
    name: 'Settings',
    id: 'settings-menu-item',
    link: 'settings',
    icon: <SettingsIcon />,
  },
  {
    name: 'Apps',
    link: 'apps',
    id: 'apps-mobile-menu-item',
    icon: <AppsIcon />,
    submenu: [],
  },
  {
    name: 'Organization',
    link: 'organization',
    id: 'organization-menu-item',
    icon: <MapsHomeWorkRoundedIcon />,
    submenu: [
      {
        name: 'Members',
        link: 'members',
        id: 'members-menu-item',
        icon: <GroupsIcon />,
      },
      {
        name: 'Cvorum',
        link: 'cvorum',
        id: 'cvorum-menu-item',
        icon: <PeopleIcon />,
      },
    ],
  },
];

console.log('menuItems loadded');
