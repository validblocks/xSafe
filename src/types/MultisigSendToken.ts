import { Address } from '@elrondnetwork/erdjs/out';
import i18next from 'i18next';
import { MultisigAction } from './MultisigAction';
import { MultisigActionType } from './MultisigActionType';

export class MultisigSendToken extends MultisigAction {
  address: Address;
  identifier: string;
  amount: number;

  constructor(address: Address, identifier: string, amount: number) {
    super(MultisigActionType.SendTransferExecute);
    this.address = address;
    this.identifier = identifier;
    this.amount = amount;
  }

  title() {
    return i18next.t('Send token');
  }

  description() {
    return `${this.amount} (${this.description})`;
  }

  tooltip() {
    return '';
  }
}
