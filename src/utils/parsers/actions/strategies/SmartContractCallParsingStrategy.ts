import { Address, BigUIntType, BytesValue } from '@multiversx/sdk-core/out';
import { NumericalBinaryCodec } from '@multiversx/sdk-core/out/smartcontracts/codec/numerical';
import { getIntValueFromBytes } from 'src/helpers/converters';
import {
  ExternalContractFunction,
  MultisigAction,
  MultisigLendInJewelSwap,
  MultisigSmartContractCall,
} from 'src/types/multisig';
import { ActionParsingStrategy } from 'src/types/multisig/ActionParsingStrategy';

export class SmartContractCallParsingStrategy implements ActionParsingStrategy {
  parse(remainingBytes: Buffer): [MultisigAction | null, Buffer] {
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

    let action;
    switch (functionName) {
      case ExternalContractFunction.LEND_IN_JEWELSWAP:
        action = new MultisigLendInJewelSwap(
          targetAddress,
          amount,
          functionName,
          args,
        );
        break;
      default:
        action = new MultisigSmartContractCall(
          targetAddress,
          amount,
          functionName,
          args,
        );
        break;
    }

    return [action, remainingBytes];
  }
}
