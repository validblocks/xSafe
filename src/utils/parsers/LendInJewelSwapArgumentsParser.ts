import { TypedValue } from '@multiversx/sdk-core/out';
import { FunctionArgumentStrategy } from './ArgumentsParser';

export class LendInJewelSwapArgumentsParser
  implements FunctionArgumentStrategy
{
  // will be further extended
  parseArguments(args: TypedValue[]) {
    return args;
  }

  parseRoles(args: TypedValue[]) {
    return args.map((arg) => arg.valueOf().toString());
  }
}
