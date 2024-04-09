import { Address } from '@multiversx/sdk-core/out';
import { MultisigAction, MultisigAddBoardMember } from 'src/types/multisig';
import { ActionParsingStrategy } from 'src/types/multisig/ActionParsingStrategy';

export class AddBoardMemberParsingStrategy implements ActionParsingStrategy {
  parse(remainingBytes: Buffer): [MultisigAction | null, Buffer] {
    const action = new MultisigAddBoardMember(
      new Address(remainingBytes.slice(0, 32)),
    );
    remainingBytes = remainingBytes.slice(32);

    return [action, remainingBytes];
  }
}
