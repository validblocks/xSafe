import { operations } from '@elrondnetwork/dapp-utils';
import { BigUIntValue, Address } from '@elrondnetwork/erdjs';
import { BytesValue } from '@elrondnetwork/erdjs/out/smartcontracts/typesystem';
import i18next from 'i18next';
import { denomination } from '../config';
import { MultisigAction } from './MultisigAction';

import { MultisigActionType } from './MultisigActionType';

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
    args: BytesValue[] = []
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
    const denominatedAmount = operations.denominate({
      input: this.amount.valueOf().toString(),
      denomination,
      decimals: 4,
      showLastNonZeroDecimal: true
    });
    return `${i18next.t('Amount')}: ${denominatedAmount}`;
  }

  tooltip(): string {
    return ` upgradeable: ${this.upgradeable}
 payable: ${this.payable} 
 readable: ${this.readable} 
    `;
  }
}
