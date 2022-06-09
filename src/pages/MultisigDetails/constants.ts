import { ProposalsTypes } from 'types/Proposals';

export const titles = {
  [ProposalsTypes.add_proposer]: 'add proposer',
  [ProposalsTypes.send_egld]: 'send EGLD',
  [ProposalsTypes.add_board_member]: 'add board Member',
  [ProposalsTypes.remove_user]: 'remove user',
  [ProposalsTypes.change_quorum]: 'change quorum',
  [ProposalsTypes.issue_token]: 'issue token',
  [ProposalsTypes.send_token]: 'send token',
  [ProposalsTypes.multiselect_proposal_options]: 'select proposal type',
  [ProposalsTypes.smart_contract_call]: 'smart contract call',
  [ProposalsTypes.deploy_contract]: 'Deploy smart contract',
  [ProposalsTypes.deploy_contract_from_source]:
    'Deploy smart contract from source',
  [ProposalsTypes.upgrade_contract]: 'Upgrade smart contract',
  [ProposalsTypes.upgrade_contract_from_source]:
    'Upgrade smart contract from source',

  [ProposalsTypes.attach_contract]: 'Attach contract',
  [ProposalsTypes.replace_owner]: 'Replace owner',
  [ProposalsTypes.edit_owner]: 'Edit owner'
};
