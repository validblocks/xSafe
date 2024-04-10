import { getChainID } from '@multiversx/sdk-dapp/utils/network';
import {
  ContractFunction,
  Transaction,
  TransactionPayload,
  SmartContract,
  TypedValue,
  Address,
  TokenTransfer,
  Interaction,
  Account,
} from '@multiversx/sdk-core';
import { gasLimit } from 'src/config';
import { getAddress } from '@multiversx/sdk-dapp/utils';
import { MultisigContractFunction } from '../types/multisig/multisigFunctionNames';
import dayjs from 'dayjs';

export async function buildTransaction(
  value: number,
  functionName: MultisigContractFunction,
  contract: SmartContract,
  transactionGasLimit: number,
  ...args: TypedValue[]
) {
  const walletAddressBech32 = await getAddress();
  const walletAddress = new Address(walletAddressBech32);

  const interaction = new Interaction(
    contract,
    new ContractFunction(functionName),
    args,
  )
    .useThenIncrementNonceOf(new Account(walletAddress))
    .withChainID(getChainID())
    .withGasLimit(transactionGasLimit)
    .withSender(walletAddress)
    .withNonce(new Account(walletAddress).getNonceThenIncrement())
    .withQuerent(walletAddress)
    .withExplicitReceiver(new Address(contract.getAddress().bech32()))
    .withValue(TokenTransfer.egldFromAmount(value ?? 0));

  const t = interaction.buildTransaction();

  return t;
}

export async function buildBlockchainTransaction(
  value: number,
  _providerType: string,
  receiver: Address,
  data: string,
  transactionGasLimit: number = gasLimit,
) {
  const addressBech32 = await getAddress();

  if (!addressBech32 || addressBech32 === '') return;

  const sender = new Address(addressBech32);

  const transactionPayload = {
    chainID: getChainID(),
    receiver,
    sender,
    value: TokenTransfer.egldFromAmount(value),
    gasLimit: transactionGasLimit,
    data: new TransactionPayload(data),
  };

  return new Transaction(transactionPayload);
}

export const getDate = (unix_timestamp: number) => {
  const milliseconds = unix_timestamp * 1000;
  return new Date(milliseconds);
};

export const humanizedDurationFromTimestamp = (timestamp: number) =>
  dayjs
    .duration(dayjs(getDate(timestamp)).diff(Date.now()), 'milliseconds')
    .humanize(true);
