import React from 'react';
import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DiamondIcon from '@mui/icons-material/Diamond';
import HelpIcon from '@mui/icons-material/Help';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';

const topItems = [
  {
    name: 'Assets',
    link: 'assets',
    icon: <PaidOutlinedIcon />,
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
    name: 'Apps',
    link: 'apps',
    icon: <DashboardIcon />
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
