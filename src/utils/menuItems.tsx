import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import DiamondIcon from '@mui/icons-material/Diamond';
import GridViewSharpIcon from '@mui/icons-material/GridViewSharp';
import GroupsIcon from '@mui/icons-material/Groups';
import HelpIcon from '@mui/icons-material/Help';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';

const topItems = [
  {
    name: 'Assets',
    link: 'assets',
    icon: <AttachMoneyIcon />,
    id: 'panel1',
    submenu: [
      {
        name: 'Coins',
        link: 'tokens',
        icon: <AdjustOutlinedIcon />,
      },
      {
        name: 'NFTs',
        link: 'nft',
        icon: <DiamondIcon />,
      },
    ],
  },
  {
    name: 'Transactions',
    link: 'transactions',
    icon: <CompareArrowsOutlinedIcon />,
  },
  {
    name: 'Address Book',
    link: 'address-book',
    icon: <MenuBookIcon />,
  },
  {
    name: 'Apps',
    link: 'apps',
    icon: <GridViewSharpIcon />,
  },
  {
    name: 'Organization',
    link: 'organization',
    icon: <MapsHomeWorkIcon />,
    id: 'panel2',
    submenu: [
      {
        name: 'Owners',
        link: 'owners',
        icon: <GroupsIcon />,
      },
      {
        name: 'Cvorum',
        link: 'cvorum',
        icon: <PeopleIcon />,
      },
    ],
  },
];

const bottomItems = [
  {
    name: 'Settings',
    link: 'settings',
    icon: <SettingsApplicationsIcon />,
  },
  { name: 'Help Center', link: 'help-center', icon: <HelpIcon /> },
];

const mobileBottomItems = [
  {
    name: 'Assets',
    link: 'assets',
    icon: <AttachMoneyIcon />,
    submenu: [
      {
        name: 'Coins',
        link: 'tokens',
        icon: <AdjustOutlinedIcon />,
      },
      {
        name: 'NFTs',
        link: 'nft',
        icon: <DiamondIcon />,
      },
    ],
  },
  {
    name: 'Transactions',
    link: 'transactions',
    icon: <CompareArrowsOutlinedIcon />,
  },
  {
    name: 'Apps',
    link: 'apps',
    icon: <GridViewSharpIcon />,
  },
  {
    name: 'Address Book',
    link: 'address-book',
    icon: <MenuBookIcon />,
  },
];

export default { topItems, bottomItems, mobileBottomItems };
