import { useTokenDetails } from './useTokenDetails';
import { useGetTokenToSendIdentifier } from './useGetTokenToSendIdentifier';
import { useMemo } from 'react';

export const useTokenToSendDetails = () => {
  const { identifier } = useGetTokenToSendIdentifier();
  const tokenDetails = useTokenDetails(identifier);

  return useMemo(() => ({ ...tokenDetails }), [tokenDetails]);
};

export default { useTokenToSendDetails };
