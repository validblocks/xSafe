import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { organizationTokenByIdentifierSelector } from 'src/redux/selectors/accountSelector';

export const useTokenDetails = (identifier: string) => {
  const tokenByIdentifier = useSelector(
    organizationTokenByIdentifierSelector(identifier),
  );

  return useMemo(
    () => ({
      ...tokenByIdentifier,
    }),
    [tokenByIdentifier],
  );
};

export default useTokenDetails;
