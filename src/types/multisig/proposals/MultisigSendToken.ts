import { Address } from '@multiversx/sdk-core/out';
import i18next from 'i18next';
import { MultisigAction } from '../MultisigAction';
import { MultisigActionType } from '../MultisigActionType';
import BigNumber from 'bignumber.js';

export class MultisigSendToken extends MultisigAction {
  address: Address;

  identifier: string;

  amount: BigNumber;

  constructor(address: Address, identifier: string, amount: BigNumber) {
    super(MultisigActionType.SendTransferExecute);
    this.address = address;
    this.identifier = identifier;
    this.amount = amount;
  }

  title() {
    return i18next.t('Send Token');
  }

  description() {
    return `${this.amount} (${this.description})`;
  }

  tooltip() {
    return '';
  }
}
