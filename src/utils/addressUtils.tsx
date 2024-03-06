import { Address } from '@multiversx/sdk-core/out';

export function truncateInTheMiddle(address: string, howMany: number): string {
  return `${address?.slice(0, howMany)}...${address?.slice(
    address.length - howMany,
  )}`;
}

export const parseMultisigAddress = (addressParam: string): Address | null => {
  try {
    return new Address(addressParam);
  } catch {
    return null;
  }
};

export const getAddressShorthand = (uniqueContractAddress: string) => {
  if (uniqueContractAddress.length === 0 || !uniqueContractAddress) return '';

  const walletAddressFirstElements = `${uniqueContractAddress.substring(
    0,
    5,
  )}...${uniqueContractAddress.substring(
    uniqueContractAddress.length - 5,
    uniqueContractAddress.length,
  )}`;
  return walletAddressFirstElements;
};
