import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectedTokenToSendSelector } from 'src/redux/selectors/modalsSelector';

export const useGetTokenToSendIdentifier = () => {
  const { identifier = 'EGLD' } = useSelector(selectedTokenToSendSelector);

  return useMemo(
    () => ({
      identifier,
    }),
    [identifier],
  );
};
