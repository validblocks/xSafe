import { Owner } from 'src/pages/Organization/types';

export enum ProposalsTypes {
  'change_quorum' = 'change_quorum',
  'add_proposer' = 'add_proposer',
  'add_board_member' = 'add_board_member',
  'remove_user' = 'remove_user',
  'edit_owner' = 'edit_owner',
  'replace_owner' = 'replace_owner',
  'send_egld' = 'send_egld',
  'issue_token' = 'issue_token',
  'send_token' = 'send_token',
  'send_nft' = 'send_nft',
  'smart_contract_call' = 'smart_contract_call',
  'multiselect_proposal_options' = 'multiselect_proposal_options',
  'deploy_contract' = 'deploy_contract',
  'deploy_contract_from_source' = 'deploy_contract_from_source',
  'upgrade_contract' = 'upgrade_contract',
  'upgrade_contract_from_source' = 'upgrade_contract_from_source',
  'attach_contract' = 'attach_contract',
}

export interface RemoveUserOptionType {
  option: ProposalsTypes.remove_user;
  address: string;
}

export interface EditOwnerOptionType {
  option: ProposalsTypes.edit_owner;
  address: string;
  name: string;
}

export interface ReplaceOwnerOptionType {
  option: ProposalsTypes.replace_owner;
  currentOwner: Owner;
}

export interface SimpleSelectedOptionType {
  option: ProposalsTypes;
}

export type SelectedOptionType =
  | SimpleSelectedOptionType
  | RemoveUserOptionType
  | EditOwnerOptionType
  | ReplaceOwnerOptionType
  | null
  | undefined;
