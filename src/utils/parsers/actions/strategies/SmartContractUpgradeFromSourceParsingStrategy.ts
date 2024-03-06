import { Address, BigUIntType, BytesValue } from '@multiversx/sdk-core/out';
import { NumericalBinaryCodec } from '@multiversx/sdk-core/out/smartcontracts/codec/numerical';
import { getIntValueFromBytes } from 'src/helpers/converters';
import {
  MultisigAction,
  MultisigUpgradeContractFromSource,
} from 'src/types/multisig';
import { ActionParsingStrategy } from 'src/types/multisig/ActionParsingStrategy';

export class SmartContractUpgradeFromSourceParsingStrategy
  implements ActionParsingStrategy
{
  parse(remainingBytes: Buffer): [MultisigAction | null, Buffer] {
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
}
