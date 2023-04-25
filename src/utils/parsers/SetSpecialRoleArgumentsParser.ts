import { Address, TypedValue } from '@multiversx/sdk-core/out';
import { FunctionArgumentStrategy } from './ArgumentsParser';

export class SetSpecialRoleArgumentsParser implements FunctionArgumentStrategy {
  parseArguments(args: TypedValue[]) {
    return {
      tokenIdentifier: args[0].valueOf().toString(),
      address: Address.fromHex(args[1].valueOf().toString('hex')).bech32(),
      roles: this.parseRoles(args.slice(2)),
    };
  }

  parseRoles(args: TypedValue[]) {
    return args.map((arg) => arg.valueOf().toString());
  }
}
