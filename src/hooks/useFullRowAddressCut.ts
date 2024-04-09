import { useMediaQuery } from '@mui/material';
import { useMemo } from 'react';

export const useFullRowAddressCut = () => {
  const maxWidth400 = useMediaQuery('(max-width: 400px)');
  const maxWidth480 = useMediaQuery('(max-width: 480px)');
  const maxWidth600 = useMediaQuery('(max-width: 600px)');
  const charsLeft = useMemo(() => {
    if (maxWidth400) {
      return 10;
    }
    if (maxWidth480) {
      return 15;
    }
    if (maxWidth600) {
      return 18;
    }

    return 20;
  }, [maxWidth400, maxWidth480, maxWidth600]);

  return {
    charsLeft,
  };
};
