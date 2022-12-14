import { TokenPayment } from '@elrondnetwork/erdjs/out';
import React from 'react';

const MultisigDetailsContext = React.createContext({
  quorumSize: 0,
  totalBoardMembers: 0,
  multisigBalance: TokenPayment.egldFromAmount(0),
  isProposer: false,
});

export default MultisigDetailsContext;
