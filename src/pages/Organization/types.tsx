import { Address } from '@multiversx/sdk-core/out';

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
  photoUrl: string;
};

export type TokenTableRowItem = Partial<
  Token & {
    id: number;
    balanceDetails: BalanceDetails;
    value: BalanceDetails;
    valueUsd?: number;
    presentation: {
      tokenIdentifier: string;
      photoUrl: string;
    }
  }
>;

export type TokenWithPrice = {
  id: string;
  symbol: string;
  name: string;
  price: number;
};

export type OrganizationInfoContextType = {
  membersCountState: CustomStateType<number>;
  quorumCountState: CustomStateType<number>;
  boardMembersState: CustomStateType<Address[]>;
  userRole: number;
  boardMembersCount: number;
  allMemberAddresses: MemberAddressTableRow[];
  isBoardMemberState: CustomStateType<boolean>;
  isMultiWalletMode: boolean;
  isInReadOnlyMode: boolean;
  nftCount: number;
};

export type AddressBook = Record<string, string>;
export type AccountInfo = Record<string, any>;

export type Owner = {
  address: Address;
  herotag?: string;
  name?: string;
};

export type OrganizationToken = {
  prettyIdentifier: string;
  identifier: string;
  tokenPrice: number;
  tokenAmount: string;
  tokenValue: number;
  photoUrl: string;
};
