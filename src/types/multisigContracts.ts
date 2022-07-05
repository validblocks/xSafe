export interface MultisigContractInfoType {
  address: string;
  name?: string;
  isTrusted?: boolean;
}

export interface PlainMultisigAddressType {
  hex: string;
  bech32: string;
  pubKey: string;
}
