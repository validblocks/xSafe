import { Address } from '@multiversx/sdk-core/out';
import { MultisigAction, MultisigAddProposer } from 'src/types/multisig';
import { ActionParsingStrategy } from 'src/types/multisig/ActionParsingStrategy';

export class AddProposerParsingStrategy implements ActionParsingStrategy {
  parse(remainingBytes: Buffer): [MultisigAction | null, Buffer] {
    const action = new MultisigAddProposer(
      new Address(remainingBytes.slice(0, 32)),
    );
    remainingBytes = remainingBytes.slice(32);

    return [action, remainingBytes];
  }
}
