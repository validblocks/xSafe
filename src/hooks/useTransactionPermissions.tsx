import { useCallback, useEffect, useState } from 'react';
import { Address } from '@multiversx/sdk-core/out';
import { useOrganizationInfoContext } from 'src/components/Providers/OrganizationInfoContextProvider';
import { MultisigActionDetailed } from 'src/types/multisig/MultisigActionDetailed';
import { useGetAccountInfo } from 'src/hooks/sdkDappHooks';

export default function useTransactionPermissions(
  action: MultisigActionDetailed,
) {
  const {
    quorumCountState: [quorumCount],
    isBoardMemberState: [isBoardMember],
    userRole,
  } = useOrganizationInfoContext();
  const { address } = useGetAccountInfo();

  const alreadySigned = useCallback(
    (multisigAction: MultisigActionDetailed) => {
      if (!address) {
        return false;
      }
      const typedAddress = new Address(address);
      for (const signerAddress of multisigAction.signers) {
        if (signerAddress.hex() === typedAddress.hex()) {
          return true;
        }
      }

      return false;
    },
    [address],
  );

  const [canSign, setCanSign] = useState(false);
  const [canPerformAction, setCanPerformAction] = useState(false);
  const [canUnsign, setCanUnsign] = useState(false);
  const [canDiscardAction, setCanDiscardAction] = useState(false);

  useEffect(() => {
    setCanUnsign(isBoardMember && !!alreadySigned(action));
    setCanPerformAction(
      isBoardMember &&
        !!alreadySigned(action) &&
        action.signers.length >= quorumCount,
    );
    setCanSign(isBoardMember && !alreadySigned(action));

    setCanDiscardAction(isBoardMember && action.signers.length === 0);
  }, [isBoardMember, userRole, quorumCount, alreadySigned, action]);

  return {
    canUnsign,
    canPerformAction,
    canSign,
    canDiscardAction,
  };
}
