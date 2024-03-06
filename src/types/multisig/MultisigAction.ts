import { MultisigActionType } from './MultisigActionType';

export abstract class MultisigAction {
  type: MultisigActionType = MultisigActionType.Nothing;

  data?: string;

  constructor(type: MultisigActionType) {
    this.type = type;
  }

  getData(): any {
    return null;
  }

  abstract title(): any;

  abstract description(): any;

  abstract tooltip(): any;

  static parse(bytes: Buffer): [MultisigAction | null, Buffer] {
    throw new Error(
      'parse method must be implemented in subclasses to parse: ' +
        bytes.toString(),
    );
  }
}
