import { Balance } from '@elrondnetwork/erdjs/out';

export interface IDenominatedBalanceConfig {
  precisionAfterComma?: number;
  needsDenomination?: boolean;
}

export const getDenominatedBalance = <T extends string | number>(
  stringBalance: string,
  {
    precisionAfterComma = 4,
    needsDenomination = true,
  }: IDenominatedBalanceConfig,
): T => {
  const balanceAfterDenomination = parseFloat(
    needsDenomination
      ? Balance.fromString(stringBalance).toDenominated()
      : stringBalance,
  );
  const balanceFloor = Math.floor(balanceAfterDenomination);
  const balanceSubunit = balanceAfterDenomination - balanceFloor;
  const balanceSubunitAfterPrecision = parseFloat(
    balanceSubunit.toFixed(precisionAfterComma),
  );
  const denominatedBalance = balanceFloor + balanceSubunitAfterPrecision;

  return denominatedBalance as T;
};
