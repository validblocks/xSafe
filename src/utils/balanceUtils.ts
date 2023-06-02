import RationalNumber from './RationalNumber';

export interface IDenominatedBalanceConfig {
  precisionAfterComma?: number;
  needsDenomination?: boolean;
}

// export const fungibleFromBigInteger = (tokenIdentifier: string, amountAsBigInteger: BigNumber.Value, numDecimals?: number | undefined) => '0';

export const getDenominatedBalance = <T extends string | number>(
  stringBalance: string,
  {
    precisionAfterComma = 4,
    needsDenomination = true,
  }: IDenominatedBalanceConfig,
): T => {
  const balanceAfterDenomination = needsDenomination
    ? RationalNumber.fromBigInteger(stringBalance ?? 0)
    : parseFloat(stringBalance);
  const balanceFloor = Math.floor(balanceAfterDenomination);
  const balanceSubunit = balanceAfterDenomination - balanceFloor;
  const balanceSubunitAfterPrecision = parseFloat(
    balanceSubunit.toFixed(precisionAfterComma),
  );
  const denominatedBalance = balanceFloor + balanceSubunitAfterPrecision;

  return denominatedBalance as T;
};
