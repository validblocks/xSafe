import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import DiamondIcon from '@mui/icons-material/Diamond';
import GroupsIcon from '@mui/icons-material/Groups';
import HelpIcon from '@mui/icons-material/Help';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import PeopleIcon from '@mui/icons-material/People';

const topItems = [
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
    icon: <CompareArrowsOutlinedIcon />,
  },
  {
    name: 'Address Book',
    link: 'address-book',
    id: 'address-book-menu-item',
    icon: <MenuBookIcon />,
  },
  {
    name: 'Apps',
    link: 'apps',
    id: 'apps-menu-item',
    icon: <MenuBookIcon />,
  },
  {
    name: 'Organization',
    link: 'organization',
    id: 'organization-menu-item',
    icon: <MapsHomeWorkIcon />,
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
    icon: <MenuBookIcon />,
  },
  { name: 'Help Center',
    id: 'help-center-menu-item',
    link: 'help-center',
    icon: <HelpIcon /> },
];

const mobileBottomItems = [
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

    icon: <MenuBookIcon />,
  },
  {
    name: 'Address Book',
    link: 'address-book',
    id: 'address-book-mobile-menu-item',
    icon: <MenuBookRoundedIcon />,
  },
];

export default { topItems, bottomItems, mobileBottomItems };
