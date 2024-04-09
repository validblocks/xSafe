import { Buffer } from 'buffer';
import { MultisigAction } from './MultisigAction';

export interface ActionParsingStrategy {
  parse(buffer: Buffer): [MultisigAction | null, Buffer];
}
