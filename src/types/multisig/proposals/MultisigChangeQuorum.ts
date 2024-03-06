import i18next from 'i18next';
import { MultisigAction } from '../MultisigAction';
import { MultisigActionType } from '../MultisigActionType';

export class MultisigChangeQuorum extends MultisigAction {
  newSize: number;

  constructor(newSize: number) {
    super(MultisigActionType.ChangeQuorum);
    this.newSize = newSize;
  }

  title() {
    return i18next.t('Change quorum');
  }

  description() {
    return `${i18next.t('New quorum size')}: ${this.newSize.toString()}`;
  }

  tooltip() {
    return '';
  }
}
