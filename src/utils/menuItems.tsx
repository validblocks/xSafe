import React from 'react';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HelpIcon from '@mui/icons-material/Help';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LanIcon from '@mui/icons-material/Lan';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import LogoutIcon from '@mui/icons-material/Logout';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

const topItems = [
  { name: 'Dashboard', link: 'dashboard', icon: <DashboardIcon /> },
  {
    name: 'Vault',
    link: 'vault',
    icon: <AccountBalanceWalletIcon />
  },
  { name: 'Decisions', link: 'decisions', icon: <ThumbUpAltIcon /> },
  { name: 'Organization', link: 'organization', icon: <LanIcon /> },
  { name: 'Tokens', link: 'tokens', icon: <LocalAtmIcon /> },
  { name: 'Assets', link: 'assets', icon: <LocalAtmIcon /> },
  { name: 'Transactions', link: 'transactions', icon: <LocalAtmIcon /> }
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
