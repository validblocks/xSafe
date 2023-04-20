import { TypedValue } from '@multiversx/sdk-core/out';
import { useQueryClient } from 'react-query';
import { QueryKeys } from 'src/react-query/queryKeys';
import { MultisigActionDetailed } from 'src/types/MultisigActionDetailed';
import { multisigContractFunctionNames } from 'src/types/multisigFunctionNames';

export const useIsAlreadyProposedMap = () => {
  const queryClient = useQueryClient();
  const cachedPendingActions = queryClient.getQueryData(
    QueryKeys.ALL_PENDING_ACTIONS,
  ) as MultisigActionDetailed[];
  const isAlreadyProposed =
    cachedPendingActions
      ?.filter((p: MultisigActionDetailed) => {
        if ('functionName' in p.action && 'args' in p.action) {
          return (
            p.action.functionName ===
            multisigContractFunctionNames.ESDTNFTTransfer
          );
        }
        return false;
      })
      ?.reduce((acc, p) => {
        if ('args' in p.action) {
          const proposalArgs = p.action.args as TypedValue[];
          const arg0 = proposalArgs?.[0].valueOf().toString() ?? '';
          const arg1 = proposalArgs?.[1].valueOf().toString('hex') ?? '';
          const collectionAndNonce = `${arg0}-${arg1}`;
          acc[collectionAndNonce] = true;
        }
        return acc;
      }, {} as Record<string, boolean>) ?? {};

  return {
    isAlreadyProposed,
  };
};
