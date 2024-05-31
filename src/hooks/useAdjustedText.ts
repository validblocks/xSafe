import { useState, useEffect, RefObject } from 'react';
import { adjustTextByWidth } from 'src/utils/stringUtils';

interface UseAdjustedTextParams {
  initialText: string | undefined;
  textToAdjust: string | undefined;
  containerRef: RefObject<HTMLDivElement>;
  dependencies: any[];
}

export const useAdjustedText = ({
  initialText,
  textToAdjust,
  containerRef,
  dependencies,
}: UseAdjustedTextParams) => {
  const [adjustedOwnerAddress, setAdjustedOwnerAddress] = useState<string>(
    initialText ?? '',
  );

  useEffect(() => {
    if (containerRef.current) {
      setAdjustedOwnerAddress(
        adjustTextByWidth({
          text: textToAdjust,
          containerWidth: containerRef.current?.offsetWidth ?? 0,
          containerPadding2X: 25,
        }),
      );
    }
  }, [containerRef, textToAdjust, ...dependencies]);

  return adjustedOwnerAddress;
};
