import { Address } from '@elrondnetwork/erdjs/out';

export function truncateInTheMiddle(address: string, howMany: number): string {
  return `${address?.slice(0, howMany)}...${address.slice(
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
