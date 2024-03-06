import { Address, INonce } from '@multiversx/sdk-core';
import { NumericalBinaryCodec } from '@multiversx/sdk-core/out/smartcontracts/codec/numerical';
import {
  BigUIntType,
  U32Value,
  U64Value,
} from '@multiversx/sdk-core/out/smartcontracts/typesystem';
import BigNumber from 'bignumber.js';
import createKeccakHash from 'keccak';

import {
  MultisigActionDetailed,
  MultisigContractInfoType,
} from 'src/types/multisig';
import { MultisigActionParserInstance } from 'src/utils/parsers/actions/MultisigActionsParser';

export function getIntValueFromBytes(buffer: Buffer) {
  return (
    buffer[buffer.length - 1] |
    (buffer[buffer.length - 2] << 8) |
    (buffer[buffer.length - 3] << 16) |
    (buffer[buffer.length - 4] << 24)
  );
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

export function get64BitBufferFromBigIntBE(value: bigint) {
  const paddedBuffer = Buffer.alloc(8);
  const encodedValue = new U64Value(new BigNumber(value.toString())).valueOf();

  const encodedBuffer = getBytesFromHexString(encodedValue.toString());
  const concatenatedBuffer = Buffer.concat([paddedBuffer, encodedBuffer]);
  return concatenatedBuffer.slice(-8);
}

export function get64BitBufferFromBigIntLE(value: bigint) {
  const paddedBuffer = Buffer.alloc(8);
  const encodedValue = new U64Value(new BigNumber(value.toString())).valueOf();

  const encodedBuffer = getBytesFromHexString(
    encodedValue.toString(),
  ).reverse();
  const concatenatedBuffer = Buffer.concat([encodedBuffer, paddedBuffer]);
  return concatenatedBuffer.slice(0, 8);
}

export function computeSmartContractAddress(owner: Address, nonce: INonce) {
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

export function hexToBigInt(hex: string): bigint | null {
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

export function parseActionDetailed(
  buffer: Buffer,
): MultisigActionDetailed | null {
  const actionId = getIntValueFromBytes(buffer.slice(0, 4));
  const actionBytes = buffer.slice(4);

  // eslint-disable-next-line prefer-const
  let [action, remainingBytes] =
    MultisigActionParserInstance.parseAction(actionBytes);
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
