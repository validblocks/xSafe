import { getChainID } from '@elrondnetwork/dapp-core/utils/network';
import {
  ContractFunction,
  Transaction,
  TransactionPayload,
  SmartContract,
  TypedValue,
  TransactionOptions,
  TransactionVersion,
  Address,
  TokenPayment,
} from '@elrondnetwork/erdjs';
import { gasLimit } from 'src/config';
import { LoginMethodsEnum } from '@elrondnetwork/dapp-core/types';
import { getAddress } from '@elrondnetwork/dapp-core/utils';
import { multisigContractFunctionNames } from '../types/multisigFunctionNames';

interface TransactionPayloadType {
  chainID: any;
  receiver: Address;
  sender?: Address;
  value: TokenPayment;
  gasLimit: any;
  data: TransactionPayload;
  options?: TransactionOptions;
  version?: TransactionVersion;
}

export async function buildTransaction(
  value: number,
  functionName: multisigContractFunctionNames,
  providerType: string,
  contract: SmartContract,
  transactionGasLimit: number,
  ...args: TypedValue[]
) {
  const walletAddress = await getAddress();
  const func = new ContractFunction(functionName);
  const payload = TransactionPayload.contractCall()
    .setFunction(func)
    .setArgs(args)
    .build();
  const transactionPayload: TransactionPayloadType = {
    chainID: getChainID(),
    receiver: new Address(contract.getAddress().bech32()),
    sender: new Address(walletAddress),
    value: TokenPayment.egldFromAmount(value ?? 0),
    gasLimit: transactionGasLimit,
    data: payload,
  };
  if (providerType === LoginMethodsEnum.ledger) {
    transactionPayload.options = TransactionOptions.withTxHashSignOptions();
    transactionPayload.version = TransactionVersion.withTxHashSignVersion();
  }
  return new Transaction(transactionPayload as any);
}

export async function buildBlockchainTransaction(
  value: number,
  providerType: string,
  receiver: Address,
  data: string,
  // eslint-disable-next-line comma-dangle
  transactionGasLimit: number = gasLimit,
) {
  const address = await getAddress();

  const transactionPayload: TransactionPayloadType = {
    chainID: getChainID(),
    receiver,
    sender: new Address(address),
    value: TokenPayment.egldFromAmount(value),
    gasLimit: transactionGasLimit,
    data: new TransactionPayload(data),
  };

  if (providerType === LoginMethodsEnum.ledger) {
    transactionPayload.options = TransactionOptions.withTxHashSignOptions();
    transactionPayload.version = TransactionVersion.withTxHashSignVersion();
  }
  return new Transaction(transactionPayload as any);
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isIterable = (input: any) =>
  input &&
  typeof input !== 'undefined' &&
  typeof input[Symbol.iterator] === 'function';
