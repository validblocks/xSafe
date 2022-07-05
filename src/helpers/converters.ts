import { Address, Nonce } from '@elrondnetwork/erdjs';
import { NumericalBinaryCodec } from '@elrondnetwork/erdjs/out/smartcontracts/codec/numerical';
import {
  BigUIntType,
  BytesValue,
  U32Value,
  U64Value,
} from '@elrondnetwork/erdjs/out/smartcontracts/typesystem';
import BigNumber from 'bignumber.js';
import * as createKeccakHash from 'keccak';
import { MultisigAction } from 'types/MultisigAction';
import { MultisigActionDetailed } from 'types/MultisigActionDetailed';
import { MultisigActionType } from 'types/MultisigActionType';
import { MultisigAddBoardMember } from 'types/MultisigAddBoardMember';
import { MultisigAddProposer } from 'types/MultisigAddProposer';
import { MultisigChangeQuorum } from 'types/MultisigChangeQuorum';
import { MultisigContractInfoType } from 'types/multisigContracts';
import { MultisigDeployContractFromSource } from 'types/MultisigDeployContractFromSource';
import { MultisigRemoveUser } from 'types/MultisigRemoveUser';
import { MultisigSendEgld } from 'types/MultisigSendEgld';
import { MultisigUpgradeContractFromSource } from 'types/MultisigUpgradeContractFromSource';
import { MultisigSmartContractCall } from '../types/MultisigSmartContractCall';

export function getIntValueFromBytes(buffer: Buffer) {
  return (
    buffer[buffer.length - 1] |
    (buffer[buffer.length - 2] << 8) |
    (buffer[buffer.length - 3] << 16) |
    (buffer[buffer.length - 4] << 24)
  );
}

function parseAddBoardMember(
  remainingBytes: Buffer,
): [MultisigAction | null, Buffer] {
  const action = new MultisigAddBoardMember(
    new Address(remainingBytes.slice(0, 32)),
  );
  remainingBytes = remainingBytes.slice(32);

  return [action, remainingBytes];
}

function parseAddProposer(
  remainingBytes: Buffer,
): [MultisigAction | null, Buffer] {
  const action = new MultisigAddProposer(
    new Address(remainingBytes.slice(0, 32)),
  );
  remainingBytes = remainingBytes.slice(32);

  return [action, remainingBytes];
}

function parseRemoveUser(
  remainingBytes: Buffer,
): [MultisigAction | null, Buffer] {
  const action = new MultisigRemoveUser(
    new Address(remainingBytes.slice(0, 32)),
  );
  remainingBytes = remainingBytes.slice(32);

  return [action, remainingBytes];
}

function parseChangeQuorum(
  remainingBytes: Buffer,
): [MultisigAction | null, Buffer] {
  const action = new MultisigChangeQuorum(
    getIntValueFromBytes(remainingBytes.slice(0, 4)),
  );
  remainingBytes = remainingBytes.slice(4);

  return [action, remainingBytes];
}

function parseSendEgld(
  remainingBytes: Buffer,
): [MultisigAction | null, Buffer] {
  const targetAddress = new Address(remainingBytes.slice(0, 32));
  remainingBytes = remainingBytes.slice(32);

  const amountSize = getIntValueFromBytes(remainingBytes.slice(0, 4));
  remainingBytes = remainingBytes.slice(4);

  const amountBytes = remainingBytes.slice(0, amountSize);
  remainingBytes = remainingBytes.slice(amountSize);

  const codec = new NumericalBinaryCodec();
  const amount = codec.decodeTopLevel(amountBytes, new BigUIntType());

  const functionNameSize = getIntValueFromBytes(remainingBytes.slice(0, 4));
  remainingBytes = remainingBytes.slice(4);

  const dataBytes = remainingBytes.slice(0, functionNameSize);
  remainingBytes = remainingBytes.slice(functionNameSize);

  const functionName = dataBytes.toString();

  const argsSize = getIntValueFromBytes(remainingBytes.slice(0, 4));
  remainingBytes = remainingBytes.slice(4);

  const args: BytesValue[] = [];
  for (let i = 0; i < argsSize; i++) {
    const argSize = getIntValueFromBytes(remainingBytes.slice(0, 4));
    remainingBytes = remainingBytes.slice(4);

    const argBytes = remainingBytes.slice(0, argSize);
    remainingBytes = remainingBytes.slice(argSize);

    args.push(new BytesValue(argBytes));
  }

  const action = new MultisigSendEgld(
    targetAddress,
    amount,
    functionName,
    args,
  );

  return [action, remainingBytes];
}

function parseSmartContractCall(
  remainingBytes: Buffer,
): [MultisigAction | null, Buffer] {
  const targetAddress = new Address(remainingBytes.slice(0, 32));
  remainingBytes = remainingBytes.slice(32);

  const amountSize = getIntValueFromBytes(remainingBytes.slice(0, 4));
  remainingBytes = remainingBytes.slice(4);

  const amountBytes = remainingBytes.slice(0, amountSize);
  remainingBytes = remainingBytes.slice(amountSize);

  const codec = new NumericalBinaryCodec();
  const amount = codec.decodeTopLevel(amountBytes, new BigUIntType());

  const functionNameSize = getIntValueFromBytes(remainingBytes.slice(0, 4));
  remainingBytes = remainingBytes.slice(4);

  const dataBytes = remainingBytes.slice(0, functionNameSize);
  remainingBytes = remainingBytes.slice(functionNameSize);

  const functionName = dataBytes.toString();

  const argsSize = getIntValueFromBytes(remainingBytes.slice(0, 4));
  remainingBytes = remainingBytes.slice(4);

  const args: BytesValue[] = [];
  for (let i = 0; i < argsSize; i++) {
    const argSize = getIntValueFromBytes(remainingBytes.slice(0, 4));
    remainingBytes = remainingBytes.slice(4);

    const argBytes = remainingBytes.slice(0, argSize);
    remainingBytes = remainingBytes.slice(argSize);

    args.push(new BytesValue(argBytes));
  }

  const action = new MultisigSmartContractCall(
    targetAddress,
    amount,
    functionName,
    args,
  );

  return [action, remainingBytes];
}
function parseSmartContractDeployFromSource(
  remainingBytes: Buffer,
): [MultisigAction | null, Buffer] {
  const amountSize = getIntValueFromBytes(remainingBytes.slice(0, 4));
  remainingBytes = remainingBytes.slice(4);
  const amountBytes = remainingBytes.slice(0, amountSize);
  remainingBytes = remainingBytes.slice(amountSize);
  const codec = new NumericalBinaryCodec();
  const amount = codec.decodeTopLevel(amountBytes, new BigUIntType());

  const sourceAddress = new Address(remainingBytes.slice(0, 32));
  remainingBytes = remainingBytes.slice(32);

  const codeMetadataBytes = remainingBytes.slice(0, 2);
  remainingBytes = remainingBytes.slice(2);

  const codeMetadata = Number(codeMetadataBytes.toString('hex'));
  const upgradeable = Boolean(codeMetadata & 100);
  const payable = Boolean(codeMetadata & 2);
  const readable = Boolean(codeMetadata & 400);
  const argsSize = getIntValueFromBytes(remainingBytes.slice(0, 4));
  remainingBytes = remainingBytes.slice(4);

  const args = [];
  for (let i = 0; i < argsSize; i++) {
    const argSize = getIntValueFromBytes(remainingBytes.slice(0, 4));
    remainingBytes = remainingBytes.slice(4);

    const argBytes = remainingBytes.slice(0, argSize);
    remainingBytes = remainingBytes.slice(argSize);

    args.push(new BytesValue(argBytes));
  }

  const action = new MultisigDeployContractFromSource(
    amount,
    sourceAddress,
    upgradeable,
    payable,
    readable,
    args,
  );

  return [action, remainingBytes];
}

function parseSmartContractUpgradeFromSource(
  remainingBytes: Buffer,
): [MultisigAction | null, Buffer] {
  const address = new Address(remainingBytes.slice(0, 32));
  remainingBytes = remainingBytes.slice(32);
  const amountSize = getIntValueFromBytes(remainingBytes.slice(0, 4));
  remainingBytes = remainingBytes.slice(4);
  const amountBytes = remainingBytes.slice(0, amountSize);
  remainingBytes = remainingBytes.slice(amountSize);
  const codec = new NumericalBinaryCodec();
  const amount = codec.decodeTopLevel(amountBytes, new BigUIntType());

  const sourceAddress = new Address(remainingBytes.slice(0, 32));
  remainingBytes = remainingBytes.slice(32);

  const codeMetadataBytes = remainingBytes.slice(0, 2);
  remainingBytes = remainingBytes.slice(2);

  const codeMetadata = Number(codeMetadataBytes.toString('hex'));
  const upgradeable = Boolean(codeMetadata & 100);
  const payable = Boolean(codeMetadata & 2);
  const readable = Boolean(codeMetadata & 400);
  const argsSize = getIntValueFromBytes(remainingBytes.slice(0, 4));
  remainingBytes = remainingBytes.slice(4);

  const args = [];
  for (let i = 0; i < argsSize; i++) {
    const argSize = getIntValueFromBytes(remainingBytes.slice(0, 4));
    remainingBytes = remainingBytes.slice(4);

    const argBytes = remainingBytes.slice(0, argSize);
    remainingBytes = remainingBytes.slice(argSize);

    args.push(new BytesValue(argBytes));
  }

  const action = new MultisigUpgradeContractFromSource(
    address,
    amount,
    sourceAddress,
    upgradeable,
    payable,
    readable,
    args,
  );

  return [action, remainingBytes];
}

export function parseContractInfo(
  buffer: Buffer,
): MultisigContractInfoType | null {
  let remainingBytes = buffer;

  const addressBytes = remainingBytes.slice(0, 32);
  const address = new Address(addressBytes);
  remainingBytes = remainingBytes.slice(32);

  const nameSize = getIntValueFromBytes(remainingBytes.slice(0, 4));
  remainingBytes = remainingBytes.slice(4);

  const nameBytes = remainingBytes.slice(0, nameSize);
  const name = nameBytes.toString();

  return { address: address.bech32(), name };
}

export function getBytesFromHexString(hex: string) {
  const bytes = [];
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }
  return Buffer.from(bytes);
}

export function get32BitBufferFromNumber(value: number) {
  const paddedBuffer = Buffer.alloc(4);
  const encodedValue = new U32Value(value).valueOf();

  const encodedBuffer = getBytesFromHexString(encodedValue.toString());
  const concatenatedBuffer = Buffer.concat([paddedBuffer, encodedBuffer]);
  return concatenatedBuffer.slice(-4);
}

export function get64BitBufferFromBigIntBE(value: BigInt) {
  const paddedBuffer = Buffer.alloc(8);
  const encodedValue = new U64Value(new BigNumber(value.toString())).valueOf();

  const encodedBuffer = getBytesFromHexString(encodedValue.toString());
  const concatenatedBuffer = Buffer.concat([paddedBuffer, encodedBuffer]);
  return concatenatedBuffer.slice(-8);
}

export function get64BitBufferFromBigIntLE(value: BigInt) {
  const paddedBuffer = Buffer.alloc(8);
  const encodedValue = new U64Value(new BigNumber(value.toString())).valueOf();

  const encodedBuffer = getBytesFromHexString(
    encodedValue.toString(),
  ).reverse();
  const concatenatedBuffer = Buffer.concat([encodedBuffer, paddedBuffer]);
  return concatenatedBuffer.slice(0, 8);
}

export function computeSmartContractAddress(owner: Address, nonce: Nonce) {
  const initialPadding = Buffer.alloc(8, 0);
  const ownerPubkey = owner.pubkey();
  const shardSelector = ownerPubkey.slice(30);
  const ownerNonceBytes = get64BitBufferFromBigIntLE(BigInt(nonce.valueOf()));
  const bytesToHash = Buffer.concat([ownerPubkey, ownerNonceBytes]);
  const hash = createKeccakHash('keccak256').update(bytesToHash).digest();
  const vmTypeBytes = Buffer.from('0500', 'hex');
  const addressBytes = Buffer.concat([
    initialPadding,
    vmTypeBytes,
    hash.slice(10, 30),
    shardSelector,
  ]);
  return new Address(addressBytes);
}

export function hexToString(hex: string): string | null {
  try {
    const bytes = getBytesFromHexString(hex);
    return bytes.toString();
  } catch {
    console.error(`Could not parse hex '${hex} to string'`);
    return null;
  }
}

export function hexToNumber(hex: string): number | null {
  try {
    const bytes = getBytesFromHexString(hex);
    return getIntValueFromBytes(bytes);
  } catch {
    console.error(`Could not parse hex '${hex} to number'`);
    return null;
  }
}

export function hexToAddress(hex: string): Address | null {
  try {
    return new Address(hex);
  } catch {
    console.error(`Could not parse hex '${hex} to address'`);
    return null;
  }
}

export function hexToBigInt(hex: string): BigInt | null {
  const bytes = getBytesFromHexString(hex);

  try {
    const codec = new NumericalBinaryCodec();
    const value = codec.decodeTopLevel(bytes, new BigUIntType()).valueOf();
    return BigInt(value.toString());
  } catch {
    console.error(`Could not parse hex '${hex}' to BigInt`);
    return null;
  }
}

export function addressToPlainAddress(address: Address) {
  return {
    hex: address.hex(),
    bech32: address.bech32(),
    pubKey: address.pubkey(),
  };
}

export function parseAction(buffer: Buffer): [MultisigAction | null, Buffer] {
  const actionTypeByte = buffer.slice(0, 1)[0];
  const remainingBytes = buffer.slice(1);

  switch (actionTypeByte) {
    case MultisigActionType.AddBoardMember:
      return parseAddBoardMember(remainingBytes);
    case MultisigActionType.AddProposer:
      return parseAddProposer(remainingBytes);
    case MultisigActionType.RemoveUser:
      return parseRemoveUser(remainingBytes);
    case MultisigActionType.ChangeQuorum:
      return parseChangeQuorum(remainingBytes);
    case MultisigActionType.SendTransferExecute:
      return parseSendEgld(remainingBytes);
    case MultisigActionType.SendAsyncCall:
      return parseSmartContractCall(remainingBytes);
    case MultisigActionType.SCDeployFromSource:
      return parseSmartContractDeployFromSource(remainingBytes);
    case MultisigActionType.SCUpgradeFromSource:
      return parseSmartContractUpgradeFromSource(remainingBytes);
    default:
      console.error(`Unrecognized action ${actionTypeByte}`);
      return [null, remainingBytes];
  }
}
export function parseActionDetailed(
  buffer: Buffer,
): MultisigActionDetailed | null {
  const actionId = getIntValueFromBytes(buffer.slice(0, 4));
  const actionBytes = buffer.slice(4);

  // eslint-disable-next-line prefer-const
  let [action, remainingBytes] = parseAction(actionBytes);
  if (action === null) {
    return null;
  }

  const signerCount = getIntValueFromBytes(remainingBytes.slice(0, 4));
  remainingBytes = remainingBytes.slice(4);

  const signers = [];
  for (let i = 0; i < signerCount; i++) {
    const addressBytes = remainingBytes.slice(0, 32);
    const address = new Address(addressBytes);
    remainingBytes = remainingBytes.slice(32);

    signers.push(address);
  }

  return new MultisigActionDetailed(action, actionId, signers);
}
