import {
  Transaction,
  GasLimit,
  GasPrice,
  Address,
  TransactionPayload,
  Balance,
  ChainID,
  TransactionVersion,
  Nonce,
  TransactionOptions,
} from '@elrondnetwork/erdjs';
import { RawTransactionType } from 'src/helpers/types';

export default function newTransaction(rawTransaction: RawTransactionType) {
  return new Transaction({
    value: Balance.fromString(rawTransaction.value),
    data: new TransactionPayload(atob(rawTransaction.data)),
    nonce: new Nonce(rawTransaction.nonce),
    receiver: new Address(rawTransaction.receiver),
    gasLimit: new GasLimit(rawTransaction.gasLimit),
    gasPrice: new GasPrice(rawTransaction.gasPrice),
    sender: new Address(rawTransaction.sender),
    chainID: new ChainID(rawTransaction.chainID),
    version: new TransactionVersion(rawTransaction.version),
    options: new TransactionOptions(rawTransaction.options),
  });
}
