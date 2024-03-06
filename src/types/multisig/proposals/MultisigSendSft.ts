import { Address } from '@multiversx/sdk-core/out';
import i18next from 'i18next';
import { MultisigAction } from '../MultisigAction';
import { MultisigActionType } from '../MultisigActionType';

export class MultisigSendSft extends MultisigAction {
  address: Address;

  identifier: string;

  nonce: string;

  amount: string;

  constructor(
    address: Address,
    identifier: string,
    amount: string,
    nonce: string,
  ) {
    super(MultisigActionType.SendTransferExecute);
    this.address = address;
    this.identifier = identifier;
    this.amount = amount;
    this.nonce = nonce;
  }

  title() {
    return i18next.t('Send SFT');
  }

  description() {
    return `${this.identifier} (${this.description}), ${this.amount}`;
  }

  tooltip() {
    return '';
  }
}
