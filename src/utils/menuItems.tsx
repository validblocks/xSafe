import React from 'react';
import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import DiamondIcon from '@mui/icons-material/Diamond';
import GridViewSharpIcon from '@mui/icons-material/GridViewSharp';
import HelpIcon from '@mui/icons-material/Help';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';

const topItems = [
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
        link: 'decisions',
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
    name: 'Address Book',
    link: 'address-book',
    icon: <GridViewSharpIcon />
  },
  {
    name: 'Apps',
    link: 'apps',
    icon: <GridViewSharpIcon />
  },
  {
    name: 'Organization',
    link: 'organization',
    icon: <AttachMoneyIcon />,
    submenu: [
      {
        name: 'Owners',
        link: 'owners',
        icon: <AdjustOutlinedIcon />
      },
      {
        name: 'Cvorum',
        link: 'cvorum',
        icon: <DiamondIcon />
      },
      {
        name: 'Organization Details',
        link: 'organization-details',
        icon: <DiamondIcon />
      }
    ]
  }
];

const bottomItems = [
  {
    name: 'Settings',
    link: 'settings',
    icon: <SettingsApplicationsIcon />
  },
  { name: 'Help Center', link: 'help-center', icon: <HelpIcon /> }
];

export default { topItems, bottomItems };
