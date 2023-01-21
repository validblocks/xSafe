import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { queryAllActions } from 'src/contracts/MultisigContract';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import { QueryKeys } from 'src/react-query/queryKeys';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';

export const usePendingActions = () => {
  const currentContract = useSelector(currentMultisigContractSelector);
  const { address } = useGetAccountInfo();
  const { data: allPendingActions, refetch: refetchPendingActions } =
      useQuery(
        QueryKeys.ALL_PENDING_ACTIONS,
        () => queryAllActions().then((resp) => resp),
        {
          ...USE_QUERY_DEFAULT_CONFIG,
        },
      );

  useEffect(() => {
    refetchPendingActions();
  }, [currentContract.address, refetchPendingActions]);

  const actionableByCurrentWallet = useMemo(
    () =>
      allPendingActions?.reduce((acc, item) => {
        const bech32Signers = item.signers.map((s) => s.bech32());

        if (!bech32Signers.includes(address)) acc += 1;
        return acc;
      }, 0),
    [address, allPendingActions],
  );

  return {
    allPendingActions,
    actionableByCurrentWallet,
  };
};
