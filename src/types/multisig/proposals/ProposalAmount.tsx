import { useCallback, useMemo } from 'react';
import { getDenominatedBalance } from 'src/utils/balanceUtils';
import RationalNumber from 'src/utils/RationalNumber';
import { MultisigSmartContractCall } from './MultisigSmartContractCall';
import { DelegationFunctionTitle } from '../..';

interface Props {
  delegationProposalType: DelegationFunctionTitle;
  multisigSmartContractCall: MultisigSmartContractCall;
}

function getAmountFromTransactionData(data: string): string {
  const amountParamHex = data.split('@')[1];
  const amountParamDecimal = parseInt(amountParamHex ?? '0', 16).toString();
  const denominatedAmountParam =
    RationalNumber.fromBigInteger(amountParamDecimal);
  const prettyBalance = getDenominatedBalance<string>(
    denominatedAmountParam.toString(),
    { precisionAfterComma: 18, needsDenomination: false },
  );

  return prettyBalance;
}

const transactionsWithNoDataParams = [
  DelegationFunctionTitle.CLAIM_REWARDS,
  DelegationFunctionTitle.RESTAKE_REWARDS,
  DelegationFunctionTitle.WITHDRAW_REWARDS,
];

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
        const balance = RationalNumber.fromBigInteger(amountToString);
        const denominatedBalance = getDenominatedBalance<string>(
          balance.toString(),
          { precisionAfterComma: 18, needsDenomination: false },
        );
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
