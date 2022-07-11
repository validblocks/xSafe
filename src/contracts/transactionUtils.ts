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
import { providerTypes } from 'src/helpers/constants';
import { gasLimit } from 'src/config';
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
  receiver: Address,
  data: string,
  // eslint-disable-next-line comma-dangle
  transactionGasLimit: number = gasLimit,
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

export const functionsWithActionIds = [
  multisigContractFunctionNames.sign,
  multisigContractFunctionNames.unsign,
  multisigContractFunctionNames.performAction,
  multisigContractFunctionNames.discardAction,
  multisigContractFunctionNames.ESDTNFTTransfer,
  multisigContractFunctionNames.quorumReached,
];

export enum TransactionTypesWithoutSCInteraction {
  SCRsWithoutActionId = 'SCRsWithoutActionId',
  noSCRs = 'noSCRs',
}

export const isIterable = (input: any) =>
  input &&
  typeof input !== 'undefined' &&
  typeof input[Symbol.iterator] === 'function';
