import React from 'react';
import { Balance } from '@elrondnetwork/erdjs/out';

const MultisigDetailsContext = React.createContext({
  quorumSize: 0,
  totalBoardMembers: 0,
  multisigBalance: Balance.fromString('0'),
  isProposer: false,
});

export default MultisigDetailsContext;
