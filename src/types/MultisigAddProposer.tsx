import React from 'react';
import { Address } from '@elrondnetwork/erdjs/out';
import i18next from 'i18next';
import ActionOnAddress from 'components/Actions/ActionOnAddress';

import { MultisigAction } from './MultisigAction';
import { MultisigActionType } from './MultisigActionType';

export class MultisigAddProposer extends MultisigAction {
  address: Address;

  constructor(address: Address) {
    super(MultisigActionType.AddProposer);
    this.address = address;
  }

  title() {
    return i18next.t('Add Proposer');
  }

  description() {
    return <ActionOnAddress title={this.title()} address={this.address} />;
  }

  tooltip() {
    return '';
  }
}
