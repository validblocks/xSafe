import { useMediaQuery } from '@mui/material';
import { useMemo } from 'react';

export const useSendTokenButtonMinWidth = () => {
  const maxWidth400 = useMediaQuery('(max-width: 400px)');
  const maxWidth480 = useMediaQuery('(max-width: 480px)');
  const maxWidth520 = useMediaQuery('(max-width: 520px)');
  const maxWidth600 = useMediaQuery('(max-width: 600px)');
  const dynamicMinWidth = useMemo(() => {
    if (maxWidth400) {
      return 100;
    }
    if (maxWidth480) {
      return 120;
    }
    if (maxWidth520) {
      return 160;
    }
    if (maxWidth600) {
      return 180;
    }

    return 156;
  }, [maxWidth400, maxWidth480, maxWidth520, maxWidth600]);

  return {
    dynamicMinWidth,
  };
};
