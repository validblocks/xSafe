import { useCallback, useMemo } from 'react';
import { MultisigSmartContractCall } from './MultisigSmartContractCall';
import { DelegationFunctionTitle } from '../..';
import { Converters } from 'src/utils/Converters';

interface Props {
  delegationProposalType: DelegationFunctionTitle;
  multisigSmartContractCall: MultisigSmartContractCall;
}

const transactionsWithNoDataParams = [
  DelegationFunctionTitle.CLAIM_REWARDS,
  DelegationFunctionTitle.RESTAKE_REWARDS,
  DelegationFunctionTitle.WITHDRAW_REWARDS,
];

function getAmountFromTransactionData(data: string): string {
  const amountParamHex = data.split('@')[1];
  return Converters.denominateBigIntHexWithNDecimals(amountParamHex);
}

const ProposalAmount = ({
  delegationProposalType,
  multisigSmartContractCall,
}: Props) => {
  const data = useMemo(
    () => multisigSmartContractCall.getData() ?? '',
    [multisigSmartContractCall],
  );

  const getAmountToDisplay = useCallback(() => {
    if (transactionsWithNoDataParams.includes(delegationProposalType)) {
      return 'All $EGLD Rewards';
    }

    let proposalAmount = '0';

    switch (delegationProposalType) {
      case DelegationFunctionTitle.UNSTAKE_TOKENS: {
        proposalAmount = getAmountFromTransactionData(data);
        break;
      }
      case DelegationFunctionTitle.STAKE_TOKENS: {
        const { amount } = multisigSmartContractCall;
        const amountToString = amount.valueOf().toString();
        const denominatedBalance =
          Converters.denominateWithNDecimals(amountToString);
        proposalAmount = denominatedBalance;
        break;
      }
      default:
        proposalAmount = multisigSmartContractCall.amount.valueOf().toString();
        break;
    }

    return `${proposalAmount} $EGLD`;
  }, [data, delegationProposalType, multisigSmartContractCall]);

  return <div>{getAmountToDisplay()}</div>;
};

export default ProposalAmount;
