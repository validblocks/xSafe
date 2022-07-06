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
  SmartContractResultItem,
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
];

export function decodeActionIdFromTransactionData(transaction: any) {
  const decodedData = atob(transaction.data);
  const decodedSplittedFields = decodedData
    .split('@')
    .filter((i) => i.length > 0);

  if (!transaction.function) {
    transaction.function = decodedSplittedFields[0];
  }

  console.log('extracting for ', transaction.function);
  // console.log('splitted fields ', decodedSplittedFields);

  //functii care contin id-ul direct in data (encoded)
  if (functionsWithActionIds.includes(transaction.function)) {
    console.log('has ID ');
    switch (transaction.function) {
      case multisigContractFunctionNames.ESDTNFTTransfer: {
        console.log(transaction.function, 'RETURNING NFT TRANS');
        return decodedSplittedFields[2];
      }
      default:
        return decodedSplittedFields[decodedSplittedFields.length - 1];
    }
  }
  // console.log('IN UTIL FCT:', { decodedSplittedFields });

  //functii pentur care luam action Id din SCR
  transaction.results.map((result: SmartContractResultItem) => {
    console.log('SCR', atob(result.data));
  });

  const [encodedResultWithActionId] = transaction.results;
  const decodedResultWithActionId = atob(encodedResultWithActionId.data);
  console.log({ decodedResultWithActionId });
  const splittedSCR = decodedResultWithActionId
    .split('@')
    .filter((item: string) => item.length > 0);
  const [, actionId] = splittedSCR;

  return actionId;
}
