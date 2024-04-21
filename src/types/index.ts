export enum DelegationFunctionTitle {
  WITHDRAW_REWARDS = 'Withdraw rewards',
  RESTAKE_REWARDS = 'Restake rewards',
  CLAIM_REWARDS = 'Claim rewards',
  UNSTAKE_TOKENS = 'Unstake tokens',
  STAKE_TOKENS = 'Stake tokens',
}

export const DelegationFunctionDescriptions: Record<
  DelegationFunctionTitle,
  string
> = {
  [DelegationFunctionTitle.CLAIM_REWARDS]: 'Claim rewards from',
  [DelegationFunctionTitle.RESTAKE_REWARDS]: 'Restake rewards to',
  [DelegationFunctionTitle.WITHDRAW_REWARDS]: 'Withdraw rewards from',
  [DelegationFunctionTitle.UNSTAKE_TOKENS]: 'Unstake tokens tokens from',
  [DelegationFunctionTitle.STAKE_TOKENS]: 'Stake tokens tokens with',
};

export interface IContractData {
  address: string;
  balance: string;
  code: string;
  codeHash: string;
  deployedAt: number;
  developerReward: string;
  isPayable: boolean;
  isPayableBySmartContract: boolean;
  isReadable: boolean;
  isUpgradeable: boolean;
  isVerified: boolean;
  nonce: number;
  ownerAddress: string;
  rootHash: string;
  scrCount: number;
  shard: number;
  txCount: number;
}

export type CatchError = any;
