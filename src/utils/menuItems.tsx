import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DiamondIcon from '@mui/icons-material/Diamond';
import HelpIcon from '@mui/icons-material/Help';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import LogoutIcon from '@mui/icons-material/Logout';

const topItems = [
  {
    name: 'Transactions',
    link: 'transactions',
    icon: <DashboardIcon />
  },
  {
    name: 'Assets',
    link: 'assets',
    icon: <DashboardIcon />,
    submenu: [
      {
        name: 'Coins',
        link: 'coins',
        icon: <LocalAtmIcon />
      },
      {
        name: 'NFTs',
        link: 'nft',
        icon: <DiamondIcon />
      }
    ]
  }
];

const bottomItems = [
  { name: 'FAQ', link: 'faq', icon: <HelpIcon /> },
  {
    name: 'Documentation',
    link: 'documentation',
    icon: <InsertDriveFileIcon />
  },
  { name: 'End session', link: 'end-session', icon: <LogoutIcon /> }
];

export default { topItems, bottomItems };
