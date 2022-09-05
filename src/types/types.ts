export enum DelegationFunctionTitles {
  'WithdrawRewards' = 'Withdraw Rewards',
  'RestakeRewards' = 'Restake Rewards',
  'ClaimRewards' = 'Claim Rewards',
  'UnstakeTokens' = 'Unstake Tokens',
  'StakeTokens' = 'Stake Tokens',
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
