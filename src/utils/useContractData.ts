import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { MultiversxApiProvider } from 'src/services/MultiversxApiNetworkProvider';
import { IContractData } from 'src/types/types';

export const useContractData = () => {
  const currentContract = useSelector(currentMultisigContractSelector);
  const [isLoading, setIsLoading] = useState(true);
  const [contractData, setContractData] = useState<IContractData | null>(
    null,
  );
  useEffect(() => {
    if (!currentContract?.address) return;
    (async () => {
      setIsLoading(true);
      const fetchedContractData =
          await MultiversxApiProvider.getAccountDetails(
            currentContract?.address,
          );
      setContractData(fetchedContractData);
      setIsLoading(false);
    })();
  }, [currentContract?.address]);

  return {
    isLoading,
    contractData,
  };
};
