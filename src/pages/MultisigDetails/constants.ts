import { ProposalsTypes } from 'src/types/Proposals';

export const titles = {
  [ProposalsTypes.add_proposer]: 'add proposer',
  [ProposalsTypes.send_egld]: 'Send EGLD',
  [ProposalsTypes.add_board_member]: 'Add board Member',
  [ProposalsTypes.remove_user]: 'Remove user',
  [ProposalsTypes.change_quorum]: 'Change quorum',
  [ProposalsTypes.issue_token]: 'Issue token',
  [ProposalsTypes.send_token]: 'Send token',
  [ProposalsTypes.send_nft]: 'Send NFT',
  [ProposalsTypes.multiselect_proposal_options]: 'select proposal type',
  [ProposalsTypes.smart_contract_call]: 'Smart contract call',
  [ProposalsTypes.deploy_contract]: 'Deploy smart contract',
  [ProposalsTypes.deploy_contract_from_source]:
    'Deploy smart contract from source',
  [ProposalsTypes.upgrade_contract]: 'Upgrade smart contract',
  [ProposalsTypes.upgrade_contract_from_source]:
    'Upgrade smart contract from source',

  [ProposalsTypes.attach_contract]: 'Attach contract',
  [ProposalsTypes.replace_owner]: 'Replace owner',
  [ProposalsTypes.edit_owner]: 'Edit owner',
  [ProposalsTypes.stake_tokens]: 'Choose a Staking Provider',
};
