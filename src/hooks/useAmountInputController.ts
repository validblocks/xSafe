import { useCallback, useState, useMemo } from 'react';

export const useAmountInputController = (initialValue: string) => {
  const [amount, setAmount] = useState<string>(initialValue);
  const [amountError, setAmountError] = useState<string | null>(null);
  const [amountErrorAfterTouch, setAmountErrorAfterTouch] = useState<
    string | null
  >(null);

  const handleAmountInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAmount(e.target.value);
    },
    [],
  );

  const updateAmountError = useCallback(
    (amountErr?: string) => setAmountError(amountErr ?? null),
    [],
  );

  const updateAmountErrorAfterTouch = useCallback(
    (amountErr?: string) => amountErr && setAmountError(amountErr),
    [],
  );

  return useMemo(
    () => ({
      amount,
      setAmount,
      amountError,
      setAmountError,
      amountErrorAfterTouch,
      setAmountErrorAfterTouch,
      handleAmountInputChange,
      updateAmountError,
      updateAmountErrorAfterTouch,
    }),
    [
      amount,
      amountError,
      amountErrorAfterTouch,
      handleAmountInputChange,
      updateAmountErrorAfterTouch,
      updateAmountError,
    ],
  );
};

export default useAmountInputController;
