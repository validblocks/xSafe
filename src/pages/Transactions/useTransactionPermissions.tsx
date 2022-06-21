import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { Address } from '@elrondnetwork/erdjs/out';
import { useOrganizationInfoContext } from 'pages/Organization/OrganizationInfoContextProvider';
import { MultisigActionDetailed } from 'types/MultisigActionDetailed';

export default function useTransactionPermissions() {
  const { address } = useGetAccountInfo();
  const {
    quorumCountState: [quorumCount],
    userRole,
  } = useOrganizationInfoContext();
  const isBoardMember = userRole === 2;

  const alreadySigned = (action: MultisigActionDetailed) => {
    if (!address) {
      return false;
    }
    const typedAddress = new Address(address);
    for (const signerAddress of action.signers) {
      if (signerAddress.hex() === typedAddress.hex()) {
        return true;
      }
    }

    return false;
  };

  const canUnsign = (action: MultisigActionDetailed) =>
    isBoardMember && alreadySigned(action);

  const canPerformAction = (action: MultisigActionDetailed) =>
    isBoardMember &&
    alreadySigned(action) &&
    action.signers.length >= quorumCount;

  const canSign = (action: MultisigActionDetailed) =>
    isBoardMember && !alreadySigned(action);

  const canDiscardAction = (action: MultisigActionDetailed) =>
    isBoardMember && action.signers.length === 0;

  return {
    canUnsign,
    canPerformAction,
    canSign,
    canDiscardAction,
  };
}
