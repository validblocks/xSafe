import { TokenTransfer } from '@multiversx/sdk-core/out';
import React from 'react';

const MultisigDetailsContext = React.createContext({
  quorumSize: 0,
  totalBoardMembers: 0,
  multisigBalance: TokenTransfer.egldFromAmount(0),
  isProposer: false,
});

export default MultisigDetailsContext;
