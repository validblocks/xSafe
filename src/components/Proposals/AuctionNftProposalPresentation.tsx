import { Box } from '@mui/system';
import React from 'react';

type Props = {
  parsedArgs: any;
};

const AuctionNftProposalPresentation = ({ parsedArgs }: Props) => {
  const text = 'AuctionNftProposal';
  console.log({ parsedArgs });
  return (
    <Box>
      {text}
    </Box>
  );
};

export default AuctionNftProposalPresentation;
