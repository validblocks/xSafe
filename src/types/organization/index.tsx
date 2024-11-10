import { Address } from '@multiversx/sdk-core/out';
import { TokenType } from '@multiversx/sdk-dapp/types/tokens.types';
import BigNumber from 'bignumber.js';

export type MemberAddressTableRow = {
  id: number;
  role: string;
  member: Address;
};

export type CustomStateType<InnerType> = [
  value: InnerType,
  setValue: React.Dispatch<React.SetStateAction<InnerType>>,
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
  decimals: number;
  amount: BigNumber;
  tokenPrice: BigNumber;
  photoUrl: string;
  identifier: string;
};

export type TokenTableRowItem = Omit<TokenType, 'valueUsd'> & {
  id: string;
  balanceDetails: BalanceDetails;
  value: BalanceDetails;
  valueUsd?: BigNumber;
  presentation: {
    tokenIdentifier: string;
    photoUrl: string;
  };
};

export type OrganizationInfoContextType = {
  membersCountState: CustomStateType<number>;
  quorumCountState: CustomStateType<number>;
  boardMembersState: CustomStateType<Address[]>;
  userRole: number;
  boardMembersCount: number;
  allMemberAddresses: MemberAddressTableRow[];
  isBoardMemberState: CustomStateType<boolean>;
  isInReadOnlyMode: boolean;
  nftCount: number;
};

type MemberAddress = string;
type MemberName = string;
export type AddressBook = Record<MemberAddress, MemberName>;
export type AccountInfo = Record<string, any>;

export type Bech32Address = string;
export type MultisigMember = {
  address: Bech32Address;
  herotag?: string;
  name?: string;
};

export type OrganizationToken = {
  prettyIdentifier: string;
  identifier: string;
  balanceLocaleString: string;
  tokenPrice: BigNumber;
  balance: BigNumber;
  tokenValue: BigNumber;
  photoUrl: string;
  decimals: number;
};
