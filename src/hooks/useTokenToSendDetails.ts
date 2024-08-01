import { useTokenDetails } from './useTokenDetails';
import { useGetTokenToSendIdentifier } from './useGetTokenToSendIdentifier';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectedNftToSendSelector } from 'src/redux/selectors/modalsSelector';

interface UseTokenToSendDetailsConfig {
  useNfts?: boolean;
}

export const useTokenToSendDetails = ({
  useNfts = false,
}: UseTokenToSendDetailsConfig) => {
  const { identifier } = useGetTokenToSendIdentifier();
  const selectedNft = useSelector(selectedNftToSendSelector);
  const selectedEsdt = useTokenDetails(identifier);
  const tokenDetails = useNfts ? selectedNft : selectedEsdt;

  return useMemo(
    () => ({
      ...tokenDetails,
      ...(useNfts ? { prettyIdentifier: selectedNft?.identifier } : {}),
    }),
    [tokenDetails],
  );
};

export default { useTokenToSendDetails };
