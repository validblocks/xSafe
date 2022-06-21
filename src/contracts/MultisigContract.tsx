import {
  getAccountProviderType,
  getNetworkProxy,
  transactionServices,
} from '@elrondnetwork/dapp-core';
import {
  ContractFunction,
  Balance,
  Address,
  SmartContract,
  BinaryCodec,
  CodeMetadata,
} from '@elrondnetwork/erdjs';

import { NumericalBinaryCodec } from '@elrondnetwork/erdjs/out/smartcontracts/codec/numerical';
import { Query } from '@elrondnetwork/erdjs/out/smartcontracts/query';
import {
  AddressValue,
  BigUIntValue,
  BooleanType,
  BooleanValue,
  BytesValue,
  TypedValue,
  U32Type,
  U32Value,
} from '@elrondnetwork/erdjs/out/smartcontracts/typesystem';
import BigNumber from 'bignumber.js';
import { gasLimit, minGasLimit, issueTokenContractAddress } from 'config';
import { parseAction, parseActionDetailed } from 'helpers/converters';
import { currentMultisigAddressSelector } from '@redux/selectors/multisigContractsSelectors';
import { MultisigAction } from 'types/MultisigAction';
import { MultisigActionDetailed } from 'types/MultisigActionDetailed';
import { multisigContractFunctionNames } from 'types/multisigFunctionNames';
import { MultisigIssueToken } from 'types/MultisigIssueToken';
import { MultisigSendToken } from 'types/MultisigSendToken';
import { setCurrentMultisigTransactionId } from '../redux/slices/multisigContractsSlice';
import { store } from '../redux/store';
import { buildTransaction } from './transactionUtils';

const proposeDeployGasLimit = 256_000_000;

export async function query(functionName: string, ...args: TypedValue[]) {
  const currentMultisigAddress = currentMultisigAddressSelector(
    store.getState(),
  );

  const smartContract = new SmartContract({
    address: currentMultisigAddress,
  });
  const newQuery = new Query({
    address: smartContract.getAddress(),
    func: new ContractFunction(functionName),
    args,
  });
  const proxy = getNetworkProxy();
  return proxy.queryContract(newQuery);
}

export async function queryNumber(
  functionName: string,
  ...args: TypedValue[]
): Promise<number> {
  const result = await query(functionName, ...args);

  const codec = new NumericalBinaryCodec();
  return codec
    .decodeTopLevel(result.outputUntyped()[0], new U32Type())
    .valueOf()
    .toNumber();
}

export async function queryBoolean(
  functionName: string,
  ...args: TypedValue[]
): Promise<boolean> {
  const result = await query(functionName, ...args);

  const codec = new BinaryCodec();
  return codec
    .decodeTopLevel<BooleanValue>(result.outputUntyped()[0], new BooleanType())
    .valueOf();
}

export async function queryAddressArray(
  functionName: string,
  ...args: TypedValue[]
): Promise<Address[]> {
  const result = await query(functionName, ...args);
  return result.outputUntyped().map((x: Buffer) => new Address(x));
}

export async function sendTransaction(
  functionName: multisigContractFunctionNames,
  transactionGasLimit = gasLimit,
  ...args: TypedValue[]
) {
  const currentMultisigAddress = currentMultisigAddressSelector(
    store.getState(),
  );

  const smartContract = new SmartContract({
    address: currentMultisigAddress,
  });
  const providerType = getAccountProviderType();
  const transaction = buildTransaction(
    0,
    functionName,
    providerType,
    smartContract,
    transactionGasLimit,
    ...args,
  );
  const { sessionId } = await transactionServices.sendTransactions({
    transactions: transaction,
    minGasLimit,
  });
  store.dispatch(setCurrentMultisigTransactionId(sessionId));
  return sessionId;
}

export function mutateSign(actionId: number) {
  return sendTransaction(
    multisigContractFunctionNames.sign,
    gasLimit,
    new U32Value(actionId),
  );
}

export function mutateUnsign(actionId: number) {
  return sendTransaction(
    multisigContractFunctionNames.unsign,
    gasLimit,
    new U32Value(actionId),
  );
}

export function mutatePerformAction(
  actionId: number,
  transactionGasLimit: number,
) {
  return sendTransaction(
    multisigContractFunctionNames.performAction,
    transactionGasLimit,
    new U32Value(actionId),
  );
}

export function mutateDiscardAction(actionId: number) {
  return sendTransaction(
    multisigContractFunctionNames.discardAction,
    gasLimit,
    new U32Value(actionId),
  );
}

export function mutateProposeChangeQuorum(quorumSize: number) {
  return sendTransaction(
    multisigContractFunctionNames.proposeChangeQuorum,
    gasLimit,
    new U32Value(quorumSize),
  );
}

export function mutateProposeAddProposer(address: Address) {
  return sendTransaction(
    multisigContractFunctionNames.proposeAddProposer,
    gasLimit,
    new AddressValue(address),
  );
}

export function mutateProposeAddBoardMember(address: Address) {
  return sendTransaction(
    multisigContractFunctionNames.proposeAddBoardMember,
    gasLimit,
    new AddressValue(address),
  );
}

export function mutateProposeRemoveUser(address: Address) {
  return sendTransaction(
    multisigContractFunctionNames.proposeRemoveUser,
    gasLimit,
    new AddressValue(address),
  );
}

export function mutateSendEgld(
  address: Address,
  amount: BigUIntValue,
  functionName: string,
  ...args: BytesValue[]
) {
  return sendTransaction(
    multisigContractFunctionNames.proposeTransferExecute,
    gasLimit,
    new AddressValue(address),
    amount,
    BytesValue.fromUTF8(functionName),
    ...args,
  );
}

export function mutateSmartContractCall(
  address: Address,
  amount: BigUIntValue,
  endpointName: string,
  ...args: (BytesValue | U32Value)[]
) {
  const allArgs: TypedValue[] = [
    new AddressValue(address),
    amount,
    BytesValue.fromUTF8(endpointName),
    ...args,
  ];

  return sendTransaction(
    multisigContractFunctionNames.proposeAsyncCall,
    gasLimit,
    ...allArgs,
  );
}

export function mutateDeployContractFromSource(
  amount: BigUIntValue,
  source: Address,
  upgradeable: boolean,
  payable: boolean,
  readable: boolean,
  ...args: BytesValue[]
) {
  const metadata = new CodeMetadata(upgradeable, payable, readable);
  const contractMetadata = new BytesValue(metadata.toBuffer());
  const allArgs = [amount, new AddressValue(source), contractMetadata, ...args];

  return sendTransaction(
    multisigContractFunctionNames.proposeSCDeployFromSource,
    gasLimit,
    ...allArgs,
  );
}

export function mutateUpgradeContractFromSource(
  address: Address,
  amount: BigUIntValue,
  source: Address,
  upgradeable: boolean,
  payable: boolean,
  readable: boolean,
  ...args: BytesValue[]
) {
  const metadata = new CodeMetadata(upgradeable, payable, readable);
  const contractMetadata = new BytesValue(metadata.toBuffer());
  const allArgs = [
    new AddressValue(address),
    amount,
    new AddressValue(address),
    contractMetadata,
    ...args,
  ];

  return sendTransaction(
    multisigContractFunctionNames.proposeSCUpgradeFromSource,
    proposeDeployGasLimit,
    ...allArgs,
  );
}

export function mutateEsdtSendToken(proposal: MultisigSendToken) {
  mutateSmartContractCall(
    proposal.address,
    new BigUIntValue(new BigNumber(0)),
    multisigContractFunctionNames.ESDTTransfer,
    BytesValue.fromUTF8(proposal.identifier),
    new U32Value(proposal.amount),
  );
}

export function mutateEsdtIssueToken(proposal: MultisigIssueToken) {
  const esdtAddress = new Address(issueTokenContractAddress);
  const esdtAmount = new BigUIntValue(Balance.egld(0.05).valueOf());

  const args = [];
  args.push(BytesValue.fromUTF8(proposal.name));
  args.push(BytesValue.fromUTF8(proposal.identifier));
  args.push(new U32Value(proposal.amount * 10 ** proposal.decimals));
  args.push(new U32Value(proposal.decimals));

  if (proposal.canFreeze) {
    args.push(BytesValue.fromUTF8('canFreeze'));
    args.push(BytesValue.fromUTF8('true'));
  }

  if (proposal.canWipe) {
    args.push(BytesValue.fromUTF8('canWipe'));
    args.push(BytesValue.fromUTF8('true'));
  }

  if (proposal.canPause) {
    args.push(BytesValue.fromUTF8('canPause'));
    args.push(BytesValue.fromUTF8('true'));
  }

  if (proposal.canMint) {
    args.push(BytesValue.fromUTF8('canMint'));
    args.push(BytesValue.fromUTF8('true'));
  }

  if (proposal.canBurn) {
    args.push(BytesValue.fromUTF8('canBurn'));
    args.push(BytesValue.fromUTF8('true'));
  }

  if (proposal.canChangeOwner) {
    args.push(BytesValue.fromUTF8('canChangeOwner'));
    args.push(BytesValue.fromUTF8('true'));
  }

  if (proposal.canUpgrade) {
    args.push(BytesValue.fromUTF8('canUpgrade'));
    args.push(BytesValue.fromUTF8('true'));
  }

  mutateSmartContractCall(
    esdtAddress,
    esdtAmount,
    multisigContractFunctionNames.issue,
    ...args,
  );
}

export function queryUserRole(userAddress: string): Promise<number> {
  return queryNumber(
    multisigContractFunctionNames.userRole,
    new AddressValue(new Address(userAddress)),
  );
}

export function queryBoardMemberAddresses(): Promise<Address[]> {
  return queryAddressArray(multisigContractFunctionNames.getAllBoardMembers);
}

export function queryProposerAddresses(): Promise<Address[]> {
  return queryAddressArray(multisigContractFunctionNames.getAllProposers);
}

export function queryActionSignerAddresses(
  actionId: number,
): Promise<Address[]> {
  return queryAddressArray(
    multisigContractFunctionNames.getActionSigners,
    new U32Value(actionId),
  );
}

export function queryProposersCount(): Promise<number> {
  return queryNumber(multisigContractFunctionNames.getNumProposers);
}

export function queryQuorumCount(): Promise<number> {
  return queryNumber(multisigContractFunctionNames.getQuorum);
}

export function queryActionLastId(): Promise<number> {
  return queryNumber(multisigContractFunctionNames.getActionLastIndex);
}

export function queryActionSignerCount(actionId: number): Promise<number> {
  return queryNumber(
    multisigContractFunctionNames.getActionSignerCount,
    new U32Value(actionId),
  );
}

export function queryActionValidSignerCount(actionId: number): Promise<number> {
  return queryNumber(
    multisigContractFunctionNames.getActionValidSignerCount,
    new U32Value(actionId),
  );
}

export function queryActionIsQuorumReached(actionId: number): Promise<boolean> {
  return queryBoolean(
    multisigContractFunctionNames.quorumReached,
    new U32Value(actionId),
  );
}

export function queryActionIsSignedByAddress(
  userAddress: Address,
  actionId: number,
): Promise<boolean> {
  return queryBoolean(
    multisigContractFunctionNames.signed,
    new AddressValue(userAddress),
    new U32Value(actionId),
  );
}

export function queryBoardMembersCount(): Promise<number> {
  return queryNumber(multisigContractFunctionNames.getNumBoardMembers);
}

export async function queryActionContainer(
  functionName: string,
  ...args: TypedValue[]
): Promise<MultisigAction | null> {
  const result = await query(functionName, ...args);

  if (result.returnData.length === 0) {
    return null;
  }
  const [action] = parseAction(result.outputUntyped()[0]);
  return action;
}

export function queryActionData(
  actionId: number,
): Promise<MultisigAction | null> {
  return queryActionContainer(
    multisigContractFunctionNames.getActionData,
    new U32Value(actionId),
  );
}

export async function queryActionContainerArray(
  functionName: string,
  ...args: TypedValue[]
): Promise<MultisigActionDetailed[]> {
  const result = await query(functionName, ...args);

  const actions = [];
  for (const buffer of result.outputUntyped()) {
    const action = parseActionDetailed(buffer);
    if (action !== null) {
      actions.push(action);
    }
  }
  return actions;
}

export function queryAllActions(): Promise<MultisigActionDetailed[]> {
  return queryActionContainerArray(
    multisigContractFunctionNames.getPendingActionFullInfo,
  );
}
