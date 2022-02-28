import React from 'react';
import { Ui } from '@elrondnetwork/dapp-utils';
import { Address } from '@elrondnetwork/erdjs/out';
import i18next from 'i18next';
import ExplorerLink from 'components/ExplorerLink';
import { MultisigAction } from './MultisigAction';
import { MultisigActionType } from './MultisigActionType';

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
    return (
      <ExplorerLink
        page={`accounts/${this.address.bech32()}`}
        text={
          <div className='address'>
            <Ui.Trim text={this.address.bech32()} />
          </div>
        }
      />
    );
  }

  tooltip() {
    return '';
  }
}
