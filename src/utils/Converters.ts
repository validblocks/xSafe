import { Address } from '@multiversx/sdk-core/out';
import { Utils } from '@pulsar.money/core';

export class Converters {
  static bech32ToHex(bech32String: string): string {
    return Address.fromBech32(bech32String).toHex();
  }

  static stringToHex(inputString: string): string {
    return Utils.Converters.stringToHex(inputString);
  }

  static numberToHex(inputNumber: number): string {
    return Utils.Converters.numberToHex(inputNumber);
  }

  static bigIntToHex(bigInt: bigint): string {
    return bigInt.toString();
  }

  static hexToString(hex: string): string {
    return Utils.Converters.hexToString(hex);
  }
}
