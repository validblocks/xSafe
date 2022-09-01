import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import AppsIcon from '@mui/icons-material/Apps';
import DiamondIcon from '@mui/icons-material/Diamond';
import GroupsIcon from '@mui/icons-material/Groups';
import HelpIcon from '@mui/icons-material/Help';
import MapsHomeWorkRoundedIcon from '@mui/icons-material/MapsHomeWorkRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { AppIdentifiers } from 'src/pages/Marketplace/appIds';
import { uniqueContractAddress } from 'src/multisigConfig';
import routeNames from 'src/routes/routeNames';
import StakeAppThumbnail from 'src/assets/img/StakeAppThumbnail.png';
import OtherAppThumbnail from 'src/assets/img/OtherAppThumbnail.png';

export type MenuItem = {
  name: string;
  link: string;
  icon: React.ReactElement;
  description?: string;
  id: string;
  submenu?: MenuItem[];

};

export type MarketplaceApp = MenuItem & {
  imageUrl?: string;
  isInstallable: boolean
};

export const preinstalledApps: MenuItem[] = [
  {
    name: 'Marketplace',
    link: 'marketplace',
    id: AppIdentifiers.Marketplace,
    icon: <GetAppRoundedIcon />,
  },
];

export const availableApps: MarketplaceApp[] = [
  {
    name: 'Stake',
    link: 'stake',
    id: AppIdentifiers.Staking,
    description: 'Stake your tokens, secure the network and earn rewards',
    icon: <DiamondIcon />,
    imageUrl: StakeAppThumbnail,
    isInstallable: true,
  },
  {
    name: 'Address Book',
    link: 'app-coming-soon',
    id: 'app-coming-soon-2-menu-sub-item',
    description: 'Save a list of frequently used addresses',
    icon: <DiamondIcon />,
    imageUrl: OtherAppThumbnail,
    isInstallable: false,
  },
  {
    name: 'More Apps',
    link: 'more-apps-coming-soon',
    id: 'more-apps-coming-soon-2-menu-sub-item',
    description: 'You will find more community developed apps here',
    icon: <DiamondIcon />,
    imageUrl: OtherAppThumbnail,
    isInstallable: false,
  },
];

const topItems: MenuItem[] = [
  {
    name: 'Home',
    link: uniqueContractAddress
      ? `/multisig/${uniqueContractAddress}`
      : routeNames.welcome,
    id: 'home-menu-item',
    icon: <HomeRoundedIcon />,
  },
  {
    name: 'Assets',
    link: 'assets',
    icon: <AttachMoneyIcon />,
    id: 'assets-menu-item',
    submenu: [
      {
        name: 'Coins',
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
        name: 'Owners',
        link: 'owners',
        id: 'owners-menu-item',
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
  { name: 'Help Center',
    id: 'help-center-menu-item',
    link: 'help-center',
    icon: <HelpIcon /> },
];

const mobileBottomItems = [
  {
    name: 'Home',
    link: `/multisig/${uniqueContractAddress}`,
    id: 'home-menu-item',
    icon: <HomeRoundedIcon />,
  },
  {
    name: 'Assets',
    link: 'assets',
    id: 'assets-mobile-menu-item',

    icon: <AttachMoneyIcon />,
    submenu: [
      {
        name: 'Coins',
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
  },
  {
    name: 'Address Book',
    link: 'address-book',
    id: 'address-book-mobile-menu-item',
    icon: <MenuBookRoundedIcon />,
  },
];

export default { topItems, bottomItems, mobileBottomItems, availableApps };
