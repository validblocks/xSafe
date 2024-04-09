export enum DelegationFunctionTitles {
  WithdrawRewards = 'Withdraw rewards',
  RestakeRewards = 'Restake rewards',
  ClaimRewards = 'Claim rewards',
  UnstakeTokens = 'Unstake tokens',
  StakeTokens = 'Stake tokens',
}

export const DelegationFunctionDescriptions: Record<
  DelegationFunctionTitles,
  string
> = {
  [DelegationFunctionTitles.ClaimRewards]: 'Claim rewards from',
  [DelegationFunctionTitles.RestakeRewards]: 'Restake rewards to',
  [DelegationFunctionTitles.WithdrawRewards]: 'Withdraw rewards from',
  [DelegationFunctionTitles.UnstakeTokens]: 'Unstake tokens tokens from',
  [DelegationFunctionTitles.StakeTokens]: 'Stake tokens tokens with',
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
