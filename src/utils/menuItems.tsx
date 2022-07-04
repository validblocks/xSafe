import React from 'react';
import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined';
import AppsIcon from '@mui/icons-material/Apps';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import DiamondIcon from '@mui/icons-material/Diamond';
import GroupsIcon from '@mui/icons-material/Groups';
import HelpIcon from '@mui/icons-material/Help';
import InfoIcon from '@mui/icons-material/Info';
import MapsHomeWorkRoundedIcon from '@mui/icons-material/MapsHomeWorkRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';

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
        icon: <AdjustOutlinedIcon />
      },
      {
        name: 'NFTs',
        link: 'nft',
        icon: <DiamondIcon />
      }
    ]
  },
  {
    name: 'Transactions',
    link: 'transactions',
    icon: <CompareArrowsOutlinedIcon sx={{ transform: 'rotate(90deg)' }} />
  },
  {
    name: 'Address Book',
    link: 'address-book',
    icon: <MenuBookRoundedIcon />
  },
  {
    name: 'Apps',
    link: 'apps',
    icon: <AppsIcon />
  },
  {
    name: 'Organization',
    link: 'organization',
    icon: <MapsHomeWorkRoundedIcon />,
    id: 'panel2',
    submenu: [
      {
        name: 'Owners',
        link: 'owners',
        icon: <GroupsIcon />
      },
      {
        name: 'Cvorum',
        link: 'cvorum',
        icon: <PeopleIcon />
      },
      {
        name: 'Organization Details',
        link: 'organization-details',
        icon: <InfoIcon />
      }
    ]
  }
];

const bottomItems = [
  {
    name: 'Settings',
    link: 'settings',
    icon: <SettingsIcon />
  },
  { name: 'Help Center', link: 'help-center', icon: <HelpIcon /> }
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
        icon: <AdjustOutlinedIcon />
      },
      {
        name: 'NFTs',
        link: 'nft',
        icon: <DiamondIcon />
      }
    ]
  },
  {
    name: 'Transactions',
    link: 'transactions',
    icon: <CompareArrowsOutlinedIcon />
  },
  {
    name: 'Apps',
    link: 'apps',
    icon: <AppsIcon />
  },
  {
    name: 'Address Book',
    link: 'address-book',
    icon: <MenuBookRoundedIcon />
  }
];

export default { topItems, bottomItems, mobileBottomItems };
