import { Address } from '@multiversx/sdk-core/out';
import { Utils } from '@pulsar.money/core';
import BigNumber from 'bignumber.js';

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

  static denominateWithNDecimals(
    value: string | number | BigNumber,
    decimals = 18,
  ): string {
    return Utils.Number.denominateWithNDecimals(value, decimals);
  }

  static denominateBigIntHexWithNDecimals(
    value: string,
    decimals = 18,
  ): string {
    return Utils.Number.denominateWithNDecimals(
      BigNumber(value ?? '0', 16).toString(10),
      decimals,
    );
  }

  static nominatedStringToHex(nominatedString: string): string {
    return new BigNumber(nominatedString).toString(16);
  }

  static approximateToNDecimals(
    numberToApproximate: number,
    decimals: number,
  ): number {
    return Utils.Number.approximateToNDecimals(numberToApproximate, decimals);
  }
}
