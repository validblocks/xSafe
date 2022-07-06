import { Ui } from '@elrondnetwork/dapp-utils';
import { Address } from '@elrondnetwork/erdjs/out';
import {
  BigUIntValue,
  BytesValue,
} from '@elrondnetwork/erdjs/out/smartcontracts/typesystem';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import i18next from 'i18next';
import ExplorerLink from 'src/components/ExplorerLink';
import { MultisigAction } from './MultisigAction';

import { MultisigActionType } from './MultisigActionType';

export class MultisigSendEgld extends MultisigAction {
  address: Address;

  amount: BigUIntValue;

  functionName: string;

  args: BytesValue[];

  constructor(
    address: Address,
    amount: BigUIntValue,
    functionName: string,
    args: BytesValue[] = [],
  ) {
    super(MultisigActionType.SendTransferExecute);
    this.address = address;
    this.amount = amount;
    this.functionName = functionName;
    this.args = args;
  }

  tooltip() {
    return '';
  }

  getData() {
    return this.functionName;
  }

  title() {
    return i18next.t('Transfer EGLD');
  }

  description() {
    return (
      <div className="d-flex flex-wrap transaction">
        <span className="mr-1 text-body">
          <Ui.Denominate
            value={this.amount.valueOf().toString()}
            showLastNonZeroDecimal
            showLabel
          />
        </span>
        <span className='mr-1'>{i18next.t('to')}</span>
        <div className='address'>
          <Ui.Trim text={this.address.bech32()} />
          <ExplorerLink
            page={`accounts/${this.address.bech32()}`}
            text={<FontAwesomeIcon icon={faExternalLinkAlt} size='sm' />}
            className='link-second-style'
          />
        </div>
      </div>
    );
  }
}
