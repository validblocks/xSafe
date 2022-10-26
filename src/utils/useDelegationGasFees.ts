import { ApiNetworkProvider } from '@elrondnetwork/erdjs-network-providers/out';
import { useEffect, useState } from 'react';
import { network } from 'src/config';

export interface IDelegationConstants {
  chainID: string;
  gasLimit: {
    claimRewards: number;
    delegate: number;
    reDelegateRewards: number;
    unDelegate: number;
    withdraw: number;
  };
  gasPrice: number;
  version: number;
}

const networkProvider2 = new ApiNetworkProvider(network.delegationApi);

export default function useDelegationGasFees() {
  const [gasFees, setGasFees] = useState<IDelegationConstants | null>(null);
  useEffect(() => {
    async function fetchGasFees() {
      const gasFees = await networkProvider2.doGetGeneric('constants');

      setGasFees(gasFees);
    }
    fetchGasFees();
  }, []);

  return gasFees;
}
