import DiamondIcon from '@mui/icons-material/Diamond';
import { JewelSwapLendingData } from './types';
import jewelSwapLogo from '../../assets/img/jewelswapLogo.png';

export const jewelSwapData: JewelSwapLendingData[] = [
  {
    icon: <DiamondIcon />,
    title: 'Start lending in JewelSwap',
    description: 'Now you can to lend directly to JewelSwap. Withdraw and Compound are only available after epoch finish, make sure to check that at jewelswap.io.',
    imgSrc: jewelSwapLogo,
    imgComponent: <img height="25" src={jewelSwapLogo} alt="JewelSwap" />,
  },
];
