import { getIntValueFromBytes } from 'src/helpers/converters';
import { MultisigAction, MultisigChangeQuorum } from 'src/types/multisig';
import { ActionParsingStrategy } from 'src/types/multisig/ActionParsingStrategy';

export class ChangeQuorumParsingStrategy implements ActionParsingStrategy {
  parse(remainingBytes: Buffer): [MultisigAction | null, Buffer] {
    const action = new MultisigChangeQuorum(
      getIntValueFromBytes(remainingBytes.slice(0, 4)),
    );
    remainingBytes = remainingBytes.slice(4);

    return [action, remainingBytes];
  }
}
