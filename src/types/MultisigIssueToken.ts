import i18next from 'i18next';
import { MultisigAction } from './MultisigAction';
import { MultisigActionType } from './MultisigActionType';

export class MultisigIssueToken extends MultisigAction {
  name: string;

  identifier: string;

  amount: number;

  decimals: number;

  canFreeze = false;

  canWipe = false;

  canPause = false;

  canMint = false;

  canBurn = false;

  canChangeOwner = false;

  canUpgrade = true;

  constructor(
    name: string,
    identifier: string,
    amount: number,
    decimals: number,
  ) {
    super(MultisigActionType.SendTransferExecute);
    this.name = name;
    this.identifier = identifier;
    this.amount = amount;
    this.decimals = decimals;
  }

  title() {
    return i18next.t('Issue Token');
  }

  description() {
    return `${this.name} (${this.description})`;
  }

  tooltip() {
    return '';
  }
}
