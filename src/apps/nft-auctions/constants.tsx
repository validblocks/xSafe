import DiamondIcon from '@mui/icons-material/Diamond';
import { NFTMarketplace } from './types';
import xSpotlightLogo from 'src/assets/img/xSpotlightLogo.svg';

export const marketplaces: NFTMarketplace[] = [
  {
    icon: <DiamondIcon />,
    title: 'Claim Auction Earnings',
    description: 'If you created a piece of Web3 culture and initiated an auction, you can claim the resulting funds corresponding to the winning bids.',
    claimableAmount: 0,
    imgSrc: xSpotlightLogo,
    imgComponent: <img height="25" src={xSpotlightLogo} alt="xSpotlight" />,
  },
];
