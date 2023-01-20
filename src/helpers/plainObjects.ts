import { Address } from '@multiversx/sdk-core';
import { PlainMultisigAddressType } from '../types/multisigContracts';

export function PlainAddress(address: Address): PlainMultisigAddressType {
  return {
    ...(address.toJSON() as PlainMultisigAddressType),
    hex: address.hex(),
  };
}
