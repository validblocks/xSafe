import { Address } from '@elrondnetwork/erdjs/out';

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
  decimals: string;
};

export type TokenTableRow = Partial<
  Token & {
    id: number;
    balance: BalanceDetails;
    value: BalanceDetails;
  }
>;

export type OrganizationInfoContextType = {
  membersCountState: CustomStateType<number>;
  quorumCountState: CustomStateType<number>;
  boardMembersState: CustomStateType<Address[]>;
  proposersState: CustomStateType<Address[]>;
  tokensState: TokenTableRow[];
  userRole: number;
  allMemberAddresses: MemberAddressTableRow[];
};
