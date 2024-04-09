import { Address } from '@multiversx/sdk-core/out';
import { MultisigAction, MultisigRemoveUser } from 'src/types/multisig';
import { ActionParsingStrategy } from 'src/types/multisig/ActionParsingStrategy';

export class RemoveUserParsingStrategy implements ActionParsingStrategy {
  parse(remainingBytes: Buffer): [MultisigAction | null, Buffer] {
    const action = new MultisigRemoveUser(
      new Address(remainingBytes.slice(0, 32)),
    );
    remainingBytes = remainingBytes.slice(32);

    return [action, remainingBytes];
  }
}
