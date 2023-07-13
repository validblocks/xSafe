import { getChainID } from '@multiversx/sdk-dapp/utils/network';
import {
  ContractFunction,
  Transaction,
  TransactionPayload,
  SmartContract,
  TypedValue,
  TransactionOptions,
  TransactionVersion,
  Address,
  TokenTransfer,
  Interaction,
  Account,
} from '@multiversx/sdk-core';
import { gasLimit } from 'src/config';
import { LoginMethodsEnum } from '@multiversx/sdk-dapp/types';
import { getAddress } from '@multiversx/sdk-dapp/utils';
import { MultisigContractFunction } from '../types/multisigFunctionNames';

interface TransactionPayloadType {
  chainID: any;
  receiver: Address;
  sender?: Address;
  value: TokenTransfer;
  gasLimit: any;
  data: TransactionPayload;
  options?: TransactionOptions;
  version?: TransactionVersion;
}

export async function buildTransaction(
  value: number,
  functionName: MultisigContractFunction,
  // providerType: string,
  contract: SmartContract,
  transactionGasLimit: number,
  ...args: TypedValue[]
) {
  const walletAddressBech32 = await getAddress();
  const walletAddress = new Address(walletAddressBech32);
  // const func = new ContractFunction(functionName);
  // const payload = TransactionPayload.contractCall()
  //   .setFunction(func)
  //   .setArgs(args)
  //   .build();

  const interaction = new Interaction(
    contract,
    new ContractFunction(functionName),
    args,
  )
    .useThenIncrementNonceOf(new Account(walletAddress))
    .withChainID(getChainID())
    .withGasLimit(transactionGasLimit)
    .withSender(walletAddress)
    .withExplicitReceiver(new Address(contract.getAddress().bech32()))
    .withValue(TokenTransfer.egldFromAmount(value ?? 0));

  const t = interaction.buildTransaction();
  return t;
  // const transactionPayload: TransactionPayloadType = {
  //   data: payload,
  // };

  // if (providerType === LoginMethodsEnum.ledger) {
  //   transactionPayload.options = new TransactionOptions(value);
  //   transactionPayload.version = new TransactionVersion(value);
  // }
  // return new Transaction(transactionPayload as any);
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
    value: TokenTransfer.egldFromAmount(value),
    gasLimit: transactionGasLimit,
    data: new TransactionPayload(data),
  };

  if (providerType === LoginMethodsEnum.ledger) {
    transactionPayload.options = new TransactionOptions(value);
    transactionPayload.version = new TransactionVersion(value);
  }
  return new Transaction(transactionPayload as any);
}

export const functionsWithActionIds = [
  MultisigContractFunction.SIGN,
  MultisigContractFunction.UNSIGN,
  MultisigContractFunction.PERFORM_ACTION,
  MultisigContractFunction.DISCARD_ACTION,
  MultisigContractFunction.ESDT_NFT_TRANSFER,
  MultisigContractFunction.QUORUM_REACHED,
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
