import { MultisigActionType } from 'src/types/multisig';
import { ActionParsingStrategy } from 'src/types/multisig/ActionParsingStrategy';
import { AddBoardMemberParsingStrategy } from './AddBoardMemberParsingStrategy';
import { AddProposerParsingStrategy } from './AddProposerParsingStrategy';
import { ChangeQuorumParsingStrategy } from './ChangeQuorumParsingStrategy';
import { RemoveUserParsingStrategy } from './RemoveUserParsingStrategy';
import { SendEgldParsingStrategy } from './SendEgldParsingStrategy';
import { SmartContractCallParsingStrategy } from './SmartContractCallParsingStrategy';
import { SmartContractDeployFromSourceParsingStrategy } from './SmartContractDeployFromSourceParsingStrategy';
import { SmartContractUpgradeFromSourceParsingStrategy } from './SmartContractUpgradeFromSourceParsingStrategy';

export const actionStrategyMap: [number, ActionParsingStrategy][] = [
  [MultisigActionType.AddBoardMember, new AddBoardMemberParsingStrategy()],
  [MultisigActionType.AddProposer, new AddProposerParsingStrategy()],
  [MultisigActionType.RemoveUser, new RemoveUserParsingStrategy()],
  [MultisigActionType.ChangeQuorum, new ChangeQuorumParsingStrategy()],
  [
    MultisigActionType.SCDeployFromSource,
    new SmartContractDeployFromSourceParsingStrategy(),
  ],
  [
    MultisigActionType.SCUpgradeFromSource,
    new SmartContractUpgradeFromSourceParsingStrategy(),
  ],
  [MultisigActionType.SendAsyncCall, new SmartContractCallParsingStrategy()],
  [MultisigActionType.SendTransferExecute, new SendEgldParsingStrategy()],
];
