import DashboardIcon from '@mui/icons-material/Dashboard';
import LanIcon from '@mui/icons-material/Lan';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';

const items = [
    { name: 'Dashboard', link: 'dashboard', icon: <DashboardIcon /> },
    {
      name: 'Vault',
      link: 'vault',
      icon: <AccountBalanceWalletIcon />
    },
    { name: 'Decisions', link: 'decisions', icon: <ThumbUpAltIcon /> },
    { name: 'Organization', link: 'organization', icon: <LanIcon /> },
    { name: 'Tokens', link: 'tokens', icon: <LocalAtmIcon /> }
  ]

  export default items;