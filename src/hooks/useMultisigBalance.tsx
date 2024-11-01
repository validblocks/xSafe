import { StateType } from '@multiversx/sdk-dapp/reduxStore/slices';
import { TokenType } from '@multiversx/sdk-dapp/types/tokens.types';
import { getAccount } from '@multiversx/sdk-dapp/utils';
import BigNumber from 'bignumber.js';
import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import { QueryKeys } from 'src/react-query/queryKeys';
import { priceSelector } from 'src/redux/selectors/economicsSelector';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { MultiversxApiProvider } from 'src/services/MultiversxApiNetworkProvider';
import { MultisigContractInfoType } from 'src/types/multisig';
import { Converters } from 'src/utils/Converters';

interface MultisigBalance {
  multisigTotalUsdValue: BigNumber;
  multisigEsdtsUsdValue: BigNumber;
  multisigEgldUsdValue: BigNumber;
}

export const useMultisigBalance = (): MultisigBalance => {
  const egldPrice = useSelector(priceSelector);
  const currentContract = useSelector<StateType, MultisigContractInfoType>(
    currentMultisigContractSelector,
  );

  const getMultisigEsdts = useCallback(
    () => MultiversxApiProvider.getAddressTokens(currentContract?.address),
    [currentContract],
  );

  const getMultisigEgldBalance = useCallback(
    () => getAccount(currentContract?.address),
    [currentContract],
  );

  const { data: multisigEsdts } = useQuery(
    [QueryKeys.ADDRESS_ESDT_TOKENS],
    getMultisigEsdts,
    USE_QUERY_DEFAULT_CONFIG,
  );

  console.log({
    multisigEsdts,
  });

  const { data: multisigEgldBalance } = useQuery(
    [QueryKeys.ADDRESS_EGLD_TOKENS],
    getMultisigEgldBalance,
    {
      ...USE_QUERY_DEFAULT_CONFIG,
      enabled: !!multisigEsdts,
    },
  );

  const multisigEgldUsdValue = useMemo(() => {
    if (multisigEgldBalance == null || egldPrice == null) {
      return new BigNumber(0);
    }

    const denominatedEgldBalance = Converters.denominateWithNDecimals(
      new BigNumber(multisigEgldBalance),
      18,
    );
    const multisigEgldBalanceBigNumber = new BigNumber(denominatedEgldBalance);
    return multisigEgldBalanceBigNumber.times(new BigNumber(egldPrice));
  }, [multisigEgldBalance, egldPrice]);

  const multisigEsdtsUsdValue = useMemo(
    () =>
      multisigEsdts?.reduce((acc: BigNumber, token: TokenType) => {
        if (token.valueUsd != null) {
          const valueUsd = BigNumber.isBigNumber(token.valueUsd)
            ? token.valueUsd
            : new BigNumber(token.valueUsd);
          console.log({ valueUsd });
          return acc.plus(valueUsd);
        }

        if (
          token.balance == null ||
          token.price == null ||
          token.decimals == null
        ) {
          console.warn(
            `Token ${token.identifier} is missing balance, price or decimals`,
          );
          return acc;
        }

        const denominatedBalance = Converters.denominateWithNDecimals(
          token.balance,
          token.decimals,
        );
        const esdtBalanceBigNumber = new BigNumber(denominatedBalance);
        const tokenPrice = BigNumber.isBigNumber(token.price)
          ? token.price
          : new BigNumber(token.price);
        const esdtValue = esdtBalanceBigNumber.times(tokenPrice);

        return acc.plus(esdtValue);
      }, new BigNumber(0)) ?? new BigNumber(0),
    [multisigEsdts],
  );

  const multisigTotalUsdValue: BigNumber = useMemo(() => {
    if (multisigEsdts == null || multisigEgldBalance == null) {
      return new BigNumber(0);
    }

    return multisigEgldUsdValue.plus(multisigEsdtsUsdValue);
  }, [
    multisigEsdts,
    multisigEgldBalance,
    multisigEgldUsdValue,
    multisigEsdtsUsdValue,
  ]);

  return useMemo(
    () => ({
      multisigTotalUsdValue,
      multisigEsdtsUsdValue,
      multisigEgldUsdValue,
    }),
    [multisigEgldUsdValue, multisigEsdtsUsdValue, multisigTotalUsdValue],
  );
};
