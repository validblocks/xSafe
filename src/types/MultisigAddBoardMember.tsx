import React from 'react';
import { Address } from '@elrondnetwork/erdjs/out';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import i18next from 'i18next';
import ExplorerLink from 'components/ExplorerLink';
import { truncateInTheMiddle } from 'utils/addressUtils';
import { MultisigAction } from './MultisigAction';
import { MultisigActionType } from './MultisigActionType';

export class MultisigAddBoardMember extends MultisigAction {
  address: Address;

  constructor(address: Address) {
    super(MultisigActionType.AddBoardMember);
    this.address = address;
  }

  title() {
    return i18next.t('Add Board Member');
  }

  description() {
    return (
      <>
        <h2>{this.title()}</h2>
        <div className="address">
          {truncateInTheMiddle(this.address.bech32(), 15)}
          <ExplorerLink
            page={`accounts/${this.address.bech32()}`}
            text={<FontAwesomeIcon icon={faExternalLinkAlt} size="sm" />}
            className="link-second-style ml-2"
          />
        </div>
      </>
    );
  }

  tooltip() {
    return '';
  }
}
