import { Address } from '@elrondnetwork/erdjs/out';
import i18next from 'i18next';
import { MultisigAction } from './MultisigAction';
import { MultisigActionType } from './MultisigActionType';

export class MultisigSendNft extends MultisigAction {
  address: Address;

  identifier: string;

  constructor(address: Address, identifier: string) {
    super(MultisigActionType.SendTransferExecute);
    this.address = address;
    this.identifier = identifier;
  }

  title() {
    return i18next.t('Send NFT');
  }

  description() {
    return `${this.identifier} (${this.description})`;
  }

  tooltip() {
    return '';
  }
}