import DiamondIcon from '@mui/icons-material/Diamond';
import { NFTMarketplace } from './types';
import xSpotlightLogo from '../../assets/img/jewelswapLogo.png';

export const marketplaces: NFTMarketplace[] = [
  {
    icon: <DiamondIcon />,
    title: 'Start lending in JewelSwap',
    description: 'Now you can to lend directly to JewelSwap. Withdraw and Compound are only available after epoch finish, make sure to check that at jewelswap.io.',
    claimableAmount: 0,
    imgSrc: xSpotlightLogo,
    imgComponent: <img height="25" src={xSpotlightLogo} alt="xSpotlight" />,
  },
];
