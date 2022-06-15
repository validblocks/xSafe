import { Address, TransactionStatus } from '@elrondnetwork/erdjs';
import { PlainMultisigAddressType } from '../types/multisigContracts';

export function PlainAddress(address: Address): PlainMultisigAddressType {
  return {
    ...(address.toJSON() as PlainMultisigAddressType),
    hex: address.hex(),
  };
}

export default function getPlainTransactionStatus(
  transactionStatus: TransactionStatus,
) {
  return {
    isPending: transactionStatus.isPending(),
    isSuccessful: transactionStatus.isSuccessful(),
    isFailed: transactionStatus.isFailed(),
    isExecuted: transactionStatus.isExecuted(),
    isInvalid: transactionStatus.isInvalid(),
  };
}
