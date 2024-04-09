import { Address } from '@multiversx/sdk-core/out';
import {
  BigUIntType,
  BigUIntValue,
  BytesValue,
} from '@multiversx/sdk-core/out/smartcontracts/typesystem';
import i18next from 'i18next';
import { MultisigAction } from '../MultisigAction';

import { MultisigActionType } from '../MultisigActionType';
import SendTokenProposalPresentation from './SendTokenProposalPresentation';
import { NumericalBinaryCodec } from '@multiversx/sdk-core/out/smartcontracts/codec/numerical';
import { getIntValueFromBytes } from 'src/helpers/converters';

export class MultisigSendEgld extends MultisigAction {
  address: Address;

  amount: BigUIntValue;

  functionName: string;

  args: BytesValue[];

  constructor(
    address: Address,
    amount: BigUIntValue,
    functionName: string,
    args: BytesValue[] = [],
  ) {
    super(MultisigActionType.SendTransferExecute);
    this.address = address;
    this.amount = amount;
    this.functionName = functionName;
    this.args = args;
  }

  tooltip() {
    return '';
  }

  getData() {
    return this.functionName;
  }

  title() {
    return i18next.t('Send EGLD');
  }

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

    const action = new MultisigSendEgld(
      targetAddress,
      amount,
      functionName,
      args,
    );

    return [action, remainingBytes];
  }

  description() {
    return (
      <SendTokenProposalPresentation
        identifier={'EGLD'}
        amount={this.amount.valueOf()}
        address={this.address}
        title="Send EGLD"
      />
    );
  }
}
