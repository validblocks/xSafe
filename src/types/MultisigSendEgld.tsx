import { Address } from '@elrondnetwork/erdjs/out';
import {
  BigUIntValue,
  BytesValue,
} from '@elrondnetwork/erdjs/out/smartcontracts/typesystem';
import i18next from 'i18next';
import { MultisigAction } from './MultisigAction';

import { MultisigActionType } from './MultisigActionType';
import SendTokenProposalPresentation from './SendTokenProposalPresentation';

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
