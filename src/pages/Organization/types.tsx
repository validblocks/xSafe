import { Address, Balance } from '@elrondnetwork/erdjs/out';

export type MemberAddressTableRow = {
  id: number;
  role: string;
  member: Address;
};

export type CustomStateType<InnerType> = [
  value: InnerType,
  setValue: React.Dispatch<React.SetStateAction<InnerType>>
];

export type Token = {
  accounts: number;
  assets: {
    description: string;
    ledgerSignature: string;
    status: string;
    pngUrl: string;
    svgUrl: string;
  };
  balance: string;
  burnt: string;
  canBurn: boolean;
  canChangeOwner: boolean;
  canFreeze: boolean;
  canMint: boolean;
  canPause: boolean;
  canUpgrade: boolean;
  canWipe: boolean;
  decimals: number;
  identifier: string;
  isPaused: boolean;
  minted: string;
  name: string;
  owner: string;
};

export type BalanceDetails = {
  amount: string;
  decimals: number;
  tokenPrice: string | number;
};

export type TokenTableRowItem = Partial<
  Token & {
    id: number;
    balanceDetails: BalanceDetails;
    value: BalanceDetails;
    valueUsd?: number;
  }
>;

export type TokenWithPrice = {
  symbol: string;
  name: string;
  price: number;
};

export type OrganizationInfoContextType = {
  membersCountState: CustomStateType<number>;
  quorumCountState: CustomStateType<number>;
  boardMembersState: CustomStateType<Address[]>;
  proposersState: CustomStateType<Address[]>;
  tokenPrices: TokenWithPrice[];
  userRole: number;
  allMemberAddresses: MemberAddressTableRow[];
  isBoardMemberState: CustomStateType<boolean>;
};
