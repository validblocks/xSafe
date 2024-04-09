import { Box } from '@mui/material';
import { TokenTableRowItem } from 'src/types/organization';
import { ProposalsTypes } from 'src/types/multisig/proposals/Proposals';

import MobileTokenCard from './MobileTokenCard';

export const SQUARE_IMAGE_WIDTH = 30;
export const SQUARE_SMALL_IMAGE_WIDTH = 20;

interface IProps {
  tokenTableRows: TokenTableRowItem[];
  handleQrModal: () => void;
  handleOptionSelected: (
    option: ProposalsTypes,
    token: TokenTableRowItem,
  ) => void;
}

const MobileCardsForTableReplacement = ({
  tokenTableRows,
  handleQrModal,
  handleOptionSelected,
}: IProps) => (
  <Box>
    {tokenTableRows.map((item: TokenTableRowItem) => (
      <MobileTokenCard
        key={item.identifier}
        tokenRow={item}
        handleOptionSelected={handleOptionSelected}
        handleQrModal={handleQrModal}
      />
    ))}
  </Box>
);

export default MobileCardsForTableReplacement;
