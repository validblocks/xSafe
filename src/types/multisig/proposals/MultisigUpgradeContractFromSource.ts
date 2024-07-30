import { BigUIntValue, Address } from '@multiversx/sdk-core';
import { BytesValue } from '@multiversx/sdk-core/out/smartcontracts/typesystem';
import i18next from 'i18next';
import { MultisigAction } from '../MultisigAction';

import { MultisigActionType } from '../MultisigActionType';
import { Converters } from 'src/utils/Converters';

export class MultisigUpgradeContractFromSource extends MultisigAction {
  address: Address;

  amount: BigUIntValue;

  source: Address;

  upgradeable: boolean;

  payable: boolean;

  readable: boolean;

  args: BytesValue[];

  constructor(
    address: Address,
    amount: BigUIntValue,
    source: Address,
    upgradeable = false,
    payable = false,
    readable = false,
    args: BytesValue[] = [],
  ) {
    super(MultisigActionType.SCUpgradeFromSource);
    this.address = address;
    this.amount = amount;
    this.source = source;
    this.upgradeable = upgradeable;
    this.payable = payable;
    this.readable = readable;
    this.args = args;
  }

  title() {
    const hasArgs =
      this.args.length > 1 && this.args[0].valueOf().toString().length > 0;
    return `${i18next.t('Upgrade Contract')} ${
      this.address
    } from ${this.source.bech32()} ${
      hasArgs ? this.args.map((arg) => arg.valueOf().toString('hex')) : ''
    }`;
  }

  description() {
    const denominatedAmount = Converters.denominateWithNDecimals(
      this.amount.valueOf().toString(),
    );
    return `${i18next.t('Amount')}: ${denominatedAmount}`;
  }

  tooltip(): string {
    return ` upgradeable: ${this.upgradeable}
 payable: ${this.payable} 
 readable: ${this.readable} 
    `;
  }
}
