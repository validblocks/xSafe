import { Ui } from '@elrondnetwork/dapp-utils';
import { Address } from '@elrondnetwork/erdjs/out';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import i18next from 'i18next';
import ExplorerLink from 'components/ExplorerLink';

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
    return (
      <div className="address">
        <Ui.Trim text={this.address.bech32()} />
        <ExplorerLink
          page={`accounts/${this.address.bech32()}`}
          text={<FontAwesomeIcon icon={faExternalLinkAlt} size="sm" />}
          className="link-second-style"
        />
      </div>
    );
  }

  tooltip() {
    return '';
  }
}
