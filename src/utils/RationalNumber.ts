import { formatAmount } from '@multiversx/sdk-dapp/utils';
import BigNumber from 'bignumber.js';

export default class RationalNumber {
  private numerator: BigNumber;

  private denominator: BigNumber;

  constructor(numerator: BigNumber.Value, denominator: BigNumber.Value) {
    this.numerator = new BigNumber(numerator);
    this.denominator = new BigNumber(denominator);
  }

  static fromBigInteger(amount: BigNumber.Value) {
    try {
      return Number(
        formatAmount({
          input: amount.toString(),
        }),
      );
    } catch (e) {
      console.error(e);
    }

    return 0;
  }

  static fromFungibleBigInteger(
    amountAsBigInteger: BigNumber.Value,
    numDecimals = 18,
  ) {
    const decimals = new BigNumber(10).pow(numDecimals);
    const rational = new RationalNumber(amountAsBigInteger, decimals);
    return rational.toNumber();
  }

  static fromDynamicTokenAmount(
    tokenIdentifier: string,
    amountAsBigInteger: BigNumber.Value,
    numDecimals?: number | undefined,
  ) {
    const result =
      tokenIdentifier !== 'EGLD'
        ? RationalNumber.fromFungibleBigInteger(amountAsBigInteger, numDecimals)
        : RationalNumber.fromBigInteger(amountAsBigInteger);

    return result;
  }

  toNumber(): number {
    return Number(this.numerator.dividedBy(this.denominator).toString());
    // .toFixed(this.denominator.decimalPlaces() ?? 18);
  }
}
