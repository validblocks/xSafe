import { TypedValue } from '@multiversx/sdk-core/out';
import { FunctionArgumentStrategy } from './ArgumentsParser';

export class IssueNonFungibleArgumentParser implements FunctionArgumentStrategy {
  parseArguments(args: TypedValue[]) {
    return {
      tokenName: args[0].valueOf().toString(),
      tokenTicker: args[1].valueOf().toString(),
      properties: this.parseNftProperties(args.slice(2)),
    };
  }

  parseNftProperties(args: TypedValue[]) {
    const stringArgs = args.map((arg) => arg.valueOf().toString());
    const properties = {} as Record<string, boolean>;
    for (let i = 0, j = 1; i < args.length - 1 && j < args.length; i += 2, j += 2) {
      properties[stringArgs[i]] = stringArgs[j] === 'true';
    }
    return properties;
  }
}
