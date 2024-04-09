import { Address } from '@multiversx/sdk-core/out';
import { MultisigAction } from './MultisigAction';

export class MultisigActionDetailed {
  actionId: number;

  signers: Address[];

  action: MultisigAction;

  constructor(action: MultisigAction, actionId: number, signers: Address[]) {
    this.action = action;
    this.actionId = actionId;
    this.signers = signers;
  }

  title(): string {
    return this.action.title();
  }

  description(): string {
    return this.action.description();
  }

  tooltip(): string {
    return this.action.tooltip();
  }

  typeNumber(): number {
    return this.action.type;
  }

  getData(): string | undefined {
    return this.action.getData();
  }
}
