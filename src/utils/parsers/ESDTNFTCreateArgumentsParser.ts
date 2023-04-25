import { TypedValue } from '@multiversx/sdk-core/out';
import { hexToNumber } from 'src/helpers/converters';
import { FunctionArgumentStrategy } from './ArgumentsParser';

export class ESDTNFTCreateArgumentsParser implements FunctionArgumentStrategy {
  parseArguments(args: TypedValue[]) {
    return {
      nftIdentifier: args[0].valueOf().toString(),
      initialQuantity: hexToNumber(args[1].valueOf().toString('hex')),
      nftName: args[2].valueOf().toString(),
      royalties: (hexToNumber(args[3].valueOf().toString('hex')) ?? 0) / 100,
      hash: args[4].valueOf().toString(),
      attributes: this.parseNftAttributes(args[5]),
      uris: this.parseNftUris(args.slice(6)),
    };
  }

  parseNftAttributes(args: TypedValue) {
    const stringArgs = args.valueOf().toString() ?? '';
    const attributes = stringArgs.split(';').reduce((acc: Record<string, any>, item: string) => {
      const [key, commaSeparatedValues] = item.split(':');
      acc[key] = commaSeparatedValues.split(',');
      return acc;
    }, {});

    return attributes;
  }

  parseNftUris(args: TypedValue[]) {
    return args.map((arg) => arg.valueOf().toString());
  }
}
