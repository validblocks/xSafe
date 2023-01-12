import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import AppsIcon from '@mui/icons-material/Apps';
import DiamondIcon from '@mui/icons-material/Diamond';
import GroupsIcon from '@mui/icons-material/Groups';
import HelpIcon from '@mui/icons-material/Help';
import MapsHomeWorkRoundedIcon from '@mui/icons-material/MapsHomeWorkRounded';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import { AppIdentifiers } from 'src/pages/Marketplace/appIds';
import StakeAppThumbnail from 'src/assets/img/StakeAppThumbnail.png';
import OtherAppThumbnailLight from 'src/assets/img/OtherAppThumbnailLight.png';
import OtherAppThumbnailDark from 'src/assets/img/OtherAppThumbnailDark.png';
import StakeAppThumbnailDark from 'src/assets/img/StakeAppThumbnailDark.png';
import MoreAppsLight from 'src/assets/img/MoreAppsLight.png';
import MoreAppsDark from 'src/assets/img/MoreAppsDark.png';
import { ReactComponent as StakingIcon } from '../assets/img/staking.svg';

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
};

export const preinstalledApps: MarketplaceApp[] = [
  {
    name: 'Marketplace',
    link: 'marketplace',
    id: AppIdentifiers.Marketplace,
    icon: <StorefrontOutlinedIcon />,
    description: 'Boost your user experience by installing apps with one click.',
    imageUrlLight: StakeAppThumbnail,
    imageUrlDark: StakeAppThumbnailDark,
    isInstallable: true,
  },
];

export const availableApps: MarketplaceApp[] = [
  {
    name: 'Stake',
    link: 'stake',
    id: AppIdentifiers.Staking,
    description: 'Stake your tokens, secure the network and earn rewards.',
    icon: <StakingIcon />,
    imageUrlLight: StakeAppThumbnail,
    imageUrlDark: StakeAppThumbnailDark,
    isInstallable: true,
  },
  {
    name: 'Address Book',
    link: 'app-coming-soon',
    id: 'app-coming-soon-2-menu-sub-item',
    description: 'Save a list of frequently used addresses. They will be available for further use.',
    icon: <DiamondIcon />,
    imageUrlLight: OtherAppThumbnailLight,
    imageUrlDark: OtherAppThumbnailDark,
    isInstallable: false,
  },
  {
    name: 'More Apps',
    link: 'more-apps-coming-soon',
    id: 'more-apps-coming-soon-2-menu-sub-item',
    description: 'You will find more community developed apps here very soon!',
    icon: <DiamondIcon />,
    imageUrlLight: MoreAppsLight,
    imageUrlDark: MoreAppsDark,
    isInstallable: false,
  },
];

const topItems: MenuItem[] = [
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
    submenu: [
      ...preinstalledApps,
    ],
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

const bottomItems = [
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

const mobileBottomItems = [
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
    link: 'marketplace',
    id: 'apps-mobile-menu-item',
    icon: <AppsIcon />,
    submenu: [
      ...preinstalledApps,
    ],
  },
];

const mobileDropDownItems = [
  {
    name: 'Settings',
    id: 'settings-menu-item',
    link: 'settings',
    icon: <SettingsIcon />,
  },
  {
    name: 'Apps',
    link: 'marketplace',
    id: 'apps-mobile-menu-item',
    icon: <AppsIcon />,
    submenu: [
      ...preinstalledApps,
    ],
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

export default { topItems, bottomItems, mobileBottomItems, availableApps, mobileDropDownItems };
