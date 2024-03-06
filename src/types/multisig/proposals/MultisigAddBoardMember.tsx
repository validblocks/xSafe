import { Address } from '@multiversx/sdk-core/out';
import i18next from 'i18next';
import ActionOnAddress from 'src/components/Utils/ActionOnAddress';
import { MultisigAction } from '../MultisigAction';
import { MultisigActionType } from '../MultisigActionType';

export class MultisigAddBoardMember extends MultisigAction {
  address: Address;

  constructor(address: Address) {
    super(MultisigActionType.AddBoardMember);
    this.address = address;
  }

  title() {
    return i18next.t('Add member');
  }

  description() {
    return <ActionOnAddress title={this.title()} address={this.address} />;
  }

  parse(remainingBytes: Buffer): [MultisigAction | null, Buffer] {
    const action = new MultisigAddBoardMember(
      new Address(remainingBytes.slice(0, 32)),
    );
    remainingBytes = remainingBytes.slice(32);

    return [action, remainingBytes];
  }

  tooltip() {
    return '';
  }
}
