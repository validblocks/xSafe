import { getChainID } from '@elrondnetwork/dapp-core';
import {
  ContractFunction,
  Transaction,
  TransactionPayload,
  Balance,
  GasLimit,
  SmartContract,
  TypedValue,
  ChainID,
  TransactionOptions,
  TransactionVersion,
  Address,
} from '@elrondnetwork/erdjs';
import { gasLimit } from 'config';
import { providerTypes } from 'helpers/constants';
import { multisigContractFunctionNames } from '../types/multisigFunctionNames';

interface TransactionPayloadType {
  chainID: ChainID;
  receiver: Address;
  value: Balance;
  gasLimit: GasLimit;
  data: TransactionPayload;
  options?: TransactionOptions;
  version?: TransactionVersion;
}

export function buildTransaction(
  value: number,
  functionName: multisigContractFunctionNames,
  providerType: string,
  contract: SmartContract,
  transactionGasLimit: number,
  ...args: TypedValue[]
): Transaction {
  const func = new ContractFunction(functionName);
  const payload = TransactionPayload.contractCall()
    .setFunction(func)
    .setArgs(args)
    .build();
  const transactionPayload: TransactionPayloadType = {
    chainID: getChainID(),
    receiver: contract.getAddress(),
    value: Balance.egld(value),
    gasLimit: new GasLimit(transactionGasLimit),
    data: payload,
  };
  if (providerType === providerTypes.ledger) {
    transactionPayload.options = TransactionOptions.withTxHashSignOptions();
    transactionPayload.version = TransactionVersion.withTxHashSignVersion();
  }
  return new Transaction(transactionPayload);
}

export function buildBlockchainTransaction(
  value: number,
  providerType: string,
  transactionGasLimit: number = gasLimit,
  receiver: Address,
  data: string,
) {
  const transactionPayload: TransactionPayloadType = {
    chainID: getChainID(),
    receiver,
    value: Balance.egld(value),
    gasLimit: new GasLimit(transactionGasLimit),
    data: new TransactionPayload(data),
  };

  if (providerType === providerTypes.ledger) {
    transactionPayload.options = TransactionOptions.withTxHashSignOptions();
    transactionPayload.version = TransactionVersion.withTxHashSignVersion();
  }
  return new Transaction(transactionPayload);
}
