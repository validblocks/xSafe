import { Buffer } from 'buffer';
import { ActionParsingStrategy } from 'src/types/multisig/ActionParsingStrategy';
import { actionStrategyMap } from './strategies/actionStrategyMap';
import { MultisigAction } from 'src/types/multisig/MultisigAction';

export class MultisigActionParser {
  private strategies: Map<number, ActionParsingStrategy>;

  constructor() {
    this.strategies = new Map<number, ActionParsingStrategy>();
    this.initializeStrategies();
  }

  private initializeStrategies() {
    actionStrategyMap.forEach(([actionType, strategy]) => {
      this.strategies.set(actionType, strategy);
    });
  }

  parseAction(buffer: Buffer): [MultisigAction | null, Buffer] {
    try {
      const actionTypeByte = buffer[0];
      const remainingBytes = buffer.slice(1);

      const strategy = this.strategies.get(actionTypeByte);
      if (strategy) {
        return strategy.parse(remainingBytes);
      } else {
        console.error(`Unrecognized action ${actionTypeByte}`);
        return [null, remainingBytes];
      }
    } catch (error) {
      console.error('Error parsing action', error);
      return [null, buffer];
    }
  }
}

export const MultisigActionParserInstance = new MultisigActionParser();
