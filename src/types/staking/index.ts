export interface IProvider {
  numNodes: number;
  stake: string;
  topUp: string;
  locked: string;
  provider: string;
  owner: string;
  featured: boolean;
  serviceFee: number;
  delegationCap: string;
  apr: number;
  numUsers: number;
  cumulatedRewards: string;
  identity: string;
}

export interface IProviderIdentity {
  apr: number;
  avatar: string;
  description: string;
  distribution: Record<string, number>;
  identity: string;
  location: string;
  locked: string;
  name: string;
  providers: string[];
  rank: number;
  score: number;
  stake: string;
  stakePercent: number;
  topUp: string;
  twitter: string;
  validators: number;
  website: string;
}

export interface IProviderColumn {
  avatar: string;
  name: string;
  website: string;
  apr: number;
}

export interface IAPRColumn {
  apr: number;
}

export interface IFilledColumn {
  filledPercentage: number;
}

export interface IDelegatedColumn {
  delegatedAmount: string;
}

export interface IUndelegatedColumn {
  undelegatedAmount: string;
}

export interface IWithdrawableColumn {
  withdrawableAmount: string;
}

export interface IClaimableRewardsColumn {
  claimableRewards: string;
}

export interface IdentityWithColumns extends IProviderIdentity {
  id: string;
  providerColumn: IProviderColumn;
  aprColumn: IAPRColumn;
  filledColumn: IFilledColumn;
  delegatedColumn?: IDelegatedColumn;
  claimRewardsColumn?: IClaimableRewardsColumn;
  undelegatedColumn?: IUndelegatedColumn;
  withdrawableColumn?: IWithdrawableColumn;
  numNodes: number;
  provider: string;
}

export interface IUndelegatedFunds {
  amount: string;
  seconds: number;
}

export interface IDelegation {
  address: string;
  claimableRewards: string;
  contract: string;
  userActiveStake: string;
  userUnBondable: string;
  userUndelegatedList: IUndelegatedFunds[];
}
