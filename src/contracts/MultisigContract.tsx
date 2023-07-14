import { sendTransactions } from '@multiversx/sdk-dapp/services';
import {
  getAddress,
  getLatestNonce,
  refreshAccount,
} from '@multiversx/sdk-dapp/utils/account';
import {
  ContractFunction,
  Address,
  SmartContract,
  BinaryCodec,
  CodeMetadata,
  Query,
  TokenTransfer,
  ResultsParser,
  Account,
} from '@multiversx/sdk-core';
import BigNumber from '@multiversx/sdk-core/node_modules/bignumber.js';
import { NumericalBinaryCodec } from '@multiversx/sdk-core/out/smartcontracts/codec/numerical';
import {
  AddressValue,
  BigUIntValue,
  BooleanType,
  BooleanValue,
  BytesValue,
  TypedValue,
  U32Type,
  U32Value,
} from '@multiversx/sdk-core/out/smartcontracts/typesystem';
import {
  gasLimit,
  minGasLimit,
  issueTokenContractAddress,
  network,
  xSpotlightContractAddress,
} from 'src/config';
import { parseAction, parseActionDetailed } from 'src/helpers/converters';
import { currentMultisigAddressSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { MultisigAction } from 'src/types/MultisigAction';
import { MultisigActionDetailed } from 'src/types/MultisigActionDetailed';
import { MultisigContractFunction } from 'src/types/multisigFunctionNames';
import { MultisigIssueToken } from 'src/types/MultisigIssueToken';
import { MultisigSendNft } from 'src/types/MultisigSendNft';
import { MultisigSendToken } from 'src/types/MultisigSendToken';
import { setCurrentMultisigTransactionId } from 'src/redux/slices/multisigContractsSlice';
import { store } from 'src/redux/store';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { MultiversxApiProvider } from 'src/services/MultiversxApiNetworkProvider';
import { MultisigSendSft } from 'src/types/MultisigSendSft';
import { getChainID } from '@multiversx/sdk-dapp/utils';

const proposeDeployGasLimit = 256_000_000;
const proxy = new ProxyNetworkProvider(network?.apiAddress ?? '');

export async function queryOnContract(
  functionName: string,
  contractAddress: string,
  ...args: TypedValue[]
) {
  const smartContract = new SmartContract({
    address: new Address(contractAddress),
  });
  const newQuery = new Query({
    address: smartContract.getAddress(),
    func: new ContractFunction(functionName),
    args,
  });
  return proxy.queryContract(newQuery);
}

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

  return proxy.queryContract(newQuery);
}

export async function queryNumber(
  functionName: string,
  ...args: TypedValue[]
): Promise<number> {
  const result = await query(functionName, ...args);

  const codec = new NumericalBinaryCodec();
  const resultsParser = new ResultsParser();
  const parsedResult = resultsParser.parseUntypedQueryResponse(result);
  return codec
    .decodeTopLevel(parsedResult.values[0], new U32Type())
    .valueOf()
    .toNumber();
}

export async function queryNumberOnContract(
  functionName: string,
  contractAddress: string,
  ...args: TypedValue[]
): Promise<number> {
  if (!contractAddress) return Promise.resolve(-1);
  const result = await queryOnContract(functionName, contractAddress, ...args);

  const codec = new NumericalBinaryCodec();
  const resultsParser = new ResultsParser();
  const parsedResult = resultsParser.parseUntypedQueryResponse(result);
  return codec
    .decodeTopLevel(parsedResult.values[0], new U32Type())
    .valueOf()
    .toNumber();
}

export async function queryBoolean(
  functionName: string,
  ...args: TypedValue[]
): Promise<boolean> {
  const result = await query(functionName, ...args);

  const resultsParser = new ResultsParser();
  const parsedResult = resultsParser.parseUntypedQueryResponse(result);
  const codec = new BinaryCodec();
  return codec
    .decodeTopLevel<BooleanValue>(parsedResult.values[0], new BooleanType())
    .valueOf();
}

export async function queryAddressArray(
  functionName: string,
  ...args: TypedValue[]
): Promise<Address[]> {
  const result = await query(functionName, ...args);
  const resultsParser = new ResultsParser();
  const parsedResult = resultsParser.parseUntypedQueryResponse(result);
  return parsedResult.values.map((x: Buffer) => new Address(x));
}

export async function sendTransaction(
  functionName: MultisigContractFunction,
  transactionGasLimit = gasLimit,
  ...args: TypedValue[]
) {
  try {
    const currentMultisigAddress = currentMultisigAddressSelector(
      store.getState(),
    );

    // -------

    let contract = new SmartContract({ address: currentMultisigAddress });

    const walletAddressBech32 = await getAddress();
    const walletAddress = new Address(walletAddressBech32);

    console.log({ walletAddressBech32, currentMultisigAddress });

    let transaction = contract.call({
      caller: walletAddress,
      receiver: currentMultisigAddress,
      func: new ContractFunction(functionName),
      gasLimit: transactionGasLimit,
      args,
      chainID: getChainID(),
    });

    transaction.setNonce(
      getLatestNonce(new Account(new Address(await getAddress()))),
    );

    // const smartContract = new SmartContract({
    //   address: currentMultisigAddress,
    // });

    // const transaction = await buildTransaction(
    //   0,
    //   functionName,
    //   smartContract,
    //   transactionGasLimit,
    //   ...args,
    // );

    await refreshAccount();
    const { sessionId } = await sendTransactions({
      transactions: [transaction],
      minGasLimit,
      // skipGuardian: true,
    });
    store.dispatch(setCurrentMultisigTransactionId(sessionId));

    console.log({ sessionId });
    return sessionId;
  } catch (e) {
    console.error(e);
  }
}

export function mutateSign(actionId: number) {
  return sendTransaction(
    MultisigContractFunction.SIGN,
    gasLimit,
    new U32Value(actionId),
  );
}

export function mutateUnsign(actionId: number) {
  return sendTransaction(
    MultisigContractFunction.UNSIGN,
    gasLimit,
    new U32Value(actionId),
  );
}

export function mutatePerformAction(
  actionId: number,
  transactionGasLimit: number,
) {
  return sendTransaction(
    MultisigContractFunction.PERFORM_ACTION,
    transactionGasLimit,
    new U32Value(actionId),
  );
}

export function mutateDiscardAction(actionId: number) {
  return sendTransaction(
    MultisigContractFunction.DISCARD_ACTION,
    gasLimit,
    new U32Value(actionId),
  );
}

export function mutateProposeChangeQuorum(quorumSize: number) {
  return sendTransaction(
    MultisigContractFunction.PROPOSE_CHANGE_QUORUM,
    gasLimit,
    new U32Value(quorumSize),
  );
}

export function mutateProposeAddProposer(address: Address) {
  return sendTransaction(
    MultisigContractFunction.PROPOSE_ADD_PROPOSER,
    gasLimit,
    new AddressValue(address),
  );
}

export function mutateProposeAddBoardMember(address: Address) {
  return sendTransaction(
    MultisigContractFunction.PROPOSE_ADD_BOARD_MEMBER,
    gasLimit,
    new AddressValue(address),
  );
}

export function mutateProposeRemoveUser(address: Address) {
  return sendTransaction(
    MultisigContractFunction.PROPOSE_REMOVE_USER,
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
    MultisigContractFunction.PROPOSE_TRANSFER_EXECUTE,
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
  ...args: (BytesValue | U32Value | TypedValue)[]
) {
  const allArgs: TypedValue[] = [
    new AddressValue(address),
    amount,
    BytesValue.fromUTF8(endpointName),
    ...args,
  ];

  return sendTransaction(
    MultisigContractFunction.PROPOSE_ASYNC_CALL,
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
    MultisigContractFunction.PROPOSE_SC_DEPLOY_FROM_SOURCE,
    gasLimit,
    ...allArgs,
  );
}

export function mutateUpgradeContractFromSource(
  address: Address,
  amount: BigUIntValue,
  // source: Address,
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
    MultisigContractFunction.PROPOSE_SC_UPGRADE_FROM_SOURCE,
    proposeDeployGasLimit,
    ...allArgs,
  );
}

export function mutateEsdtSendToken(proposal: MultisigSendToken) {
  mutateSmartContractCall(
    proposal.address,
    new BigUIntValue(new BigNumber(0)),
    MultisigContractFunction.ESDT_TRANSFER,
    BytesValue.fromUTF8(proposal.identifier),
    new U32Value(proposal.amount),
  );
}

export function mutateEsdtSendNft(proposal: MultisigSendNft) {
  const identifierWithoutNonce = proposal.identifier
    .split('-')
    .slice(0, 2)
    .join('-');
  const currentMultisigAddress = currentMultisigAddressSelector(
    store.getState(),
  );

  const smartContract = new SmartContract({
    address: currentMultisigAddress,
  });

  mutateSmartContractCall(
    new Address(smartContract.getAddress().bech32()),
    new BigUIntValue(new BigNumber(0)),
    MultisigContractFunction.ESDT_NFT_TRANSFER,
    BytesValue.fromUTF8(identifierWithoutNonce),
    new U32Value(new BigNumber(proposal.nonce)),
    new U32Value(1),
    new AddressValue(proposal.address),
  );
}

export function mutateAuctionNftOnXSpotlight(proposal: MultisigSendNft) {
  const identifierWithoutNonce = proposal.identifier
    .split('-')
    .slice(0, 2)
    .join('-');
  const currentMultisigAddress = currentMultisigAddressSelector(
    store.getState(),
  );

  const smartContract = new SmartContract({
    address: currentMultisigAddress,
  });

  mutateSmartContractCall(
    new Address(smartContract.getAddress().bech32()),
    new BigUIntValue(new BigNumber(0)),
    MultisigContractFunction.ESDT_NFT_TRANSFER,
    BytesValue.fromUTF8(identifierWithoutNonce),
    new U32Value(new BigNumber(proposal.nonce)),
    new U32Value(1),
    new AddressValue(new Address(xSpotlightContractAddress)),
    BytesValue.fromUTF8('auctionToken'),
    BytesValue.fromHex('5af3107a4000'),
    BytesValue.fromHex(''),
    BytesValue.fromHex('64c4f7fe'),
    BytesValue.fromHex('45474c44'),
  );
}

export function mutateEsdtSendSft(proposal: MultisigSendSft) {
  const identifierWithoutNonce = proposal.identifier
    .split('-')
    .slice(0, 2)
    .join('-');
  const currentMultisigAddress = currentMultisigAddressSelector(
    store.getState(),
  );

  const smartContract = new SmartContract({
    address: currentMultisigAddress,
  });

  mutateSmartContractCall(
    new Address(smartContract.getAddress().bech32()),
    new BigUIntValue(new BigNumber(0)),
    MultisigContractFunction.ESDT_NFT_TRANSFER,
    BytesValue.fromUTF8(identifierWithoutNonce),
    new U32Value(new BigNumber(proposal.nonce)),
    new U32Value(Number(proposal.amount)),
    new AddressValue(proposal.address),
  );
}

export function mutateEsdtIssueToken(proposal: MultisigIssueToken) {
  const esdtAddress = new Address(issueTokenContractAddress);
  const esdtAmount = new BigUIntValue(
    TokenTransfer.egldFromAmount(0.05).valueOf(),
  );

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
    MultisigContractFunction.ISSUE,
    ...args,
  );
}

export function queryUserRole(userAddress: string): Promise<number> {
  return queryNumber(
    MultisigContractFunction.USER_ROLE,
    new AddressValue(new Address(userAddress)),
  );
}

export async function queryUserRoleOnContract(
  userAddress: string,
  contractAddress: string,
): Promise<number> {
  const isValidMultisigContract =
    await MultiversxApiProvider.validateMultisigAddress(contractAddress);
  if (!userAddress || !contractAddress || !isValidMultisigContract)
    return Promise.resolve(-1);
  return queryNumberOnContract(
    MultisigContractFunction.USER_ROLE,
    contractAddress,
    new AddressValue(new Address(userAddress)),
  );
}

export function queryBoardMemberAddresses(): Promise<Address[]> {
  return queryAddressArray(MultisigContractFunction.GET_ALL_BOARD_MEMBERS);
}

export function queryProposerAddresses(): Promise<Address[]> {
  return queryAddressArray(MultisigContractFunction.GET_ALL_PROPOSERS);
}

export function queryActionSignerAddresses(
  actionId: number,
): Promise<Address[]> {
  return queryAddressArray(
    MultisigContractFunction.GET_ACTION_SIGNERS,
    new U32Value(actionId),
  );
}

export function queryProposersCount(): Promise<number> {
  return queryNumber(MultisigContractFunction.GET_NUM_PROPOSERS);
}

export function queryQuorumCount(): Promise<number> {
  return queryNumber(MultisigContractFunction.GET_QUORUM);
}

export function queryActionLastId(): Promise<number> {
  return queryNumber(MultisigContractFunction.GET_ACTION_LAST_INDEX);
}

export function queryActionSignerCount(actionId: number): Promise<number> {
  return queryNumber(
    MultisigContractFunction.GET_ACTION_SIGNER_COUNT,
    new U32Value(actionId),
  );
}

export function queryActionValidSignerCount(actionId: number): Promise<number> {
  return queryNumber(
    MultisigContractFunction.GET_ACTION_VALID_SIGNER_COUNT,
    new U32Value(actionId),
  );
}

export function queryActionIsQuorumReached(actionId: number): Promise<boolean> {
  return queryBoolean(
    MultisigContractFunction.QUORUM_REACHED,
    new U32Value(actionId),
  );
}

export function queryActionIsSignedByAddress(
  userAddress: Address,
  actionId: number,
): Promise<boolean> {
  return queryBoolean(
    MultisigContractFunction.SIGNED,
    new AddressValue(userAddress),
    new U32Value(actionId),
  );
}

export function queryBoardMembersCount(): Promise<number> {
  return queryNumber(MultisigContractFunction.GET_NUM_BOARD_MEMBERS);
}

export async function queryActionContainer(
  functionName: string,
  ...args: TypedValue[]
): Promise<MultisigAction | null> {
  const result = await query(functionName, ...args);

  if (result.returnData.length === 0) {
    return null;
  }

  const resultsParser = new ResultsParser();
  const parsedResult = resultsParser.parseUntypedQueryResponse(result);
  const [action] = parseAction(parsedResult.values[0]);

  return action;
}

export function queryActionData(
  actionId: number,
): Promise<MultisigAction | null> {
  return queryActionContainer(
    MultisigContractFunction.GET_ACTION_DATA,
    new U32Value(actionId),
  );
}

export async function queryActionContainerArray(
  functionName: string,
  ...args: TypedValue[]
): Promise<MultisigActionDetailed[]> {
  const result = await query(functionName, ...args);

  const resultsParser = new ResultsParser();
  const parsedResult = resultsParser.parseUntypedQueryResponse(result);
  const actions = [];
  for (const buffer of parsedResult.values) {
    const action = parseActionDetailed(buffer);
    if (action !== null) {
      actions.push(action);
    }
  }
  return actions;
}

export function queryAllActions(): Promise<MultisigActionDetailed[]> {
  return queryActionContainerArray(
    MultisigContractFunction.GET_PENDING_ACTION_FULL_INFO,
  );
}
