import { Address } from '@multiversx/sdk-core/out';
import i18next from 'i18next';
import ActionOnAddress from 'src/components/Utils/ActionOnAddress';
import { MultisigAction } from '../MultisigAction';
import { MultisigActionType } from '../MultisigActionType';

export class MultisigRemoveUser extends MultisigAction {
  address: Address;

  constructor(address: Address) {
    super(MultisigActionType.RemoveUser);
    this.address = address;
  }

  title() {
    return i18next.t('Remove User');
  }

  description() {
    return <ActionOnAddress title={this.title()} address={this.address} />;
  }

  tooltip() {
    return '';
  }
}
