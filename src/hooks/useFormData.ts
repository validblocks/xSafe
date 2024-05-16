import { useState, useCallback } from 'react';

export const useFormData = (
  handleFormKeyChange?: (formKey: string) => any,
  handleNewArgs?: (newArgs: Record<string, string>) => void,
) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const onFormChange = useCallback(
    (formKey: string) => {
      handleFormKeyChange?.(formKey);
      return (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((oldForm) => {
          const newArgs = {
            ...oldForm,
            [formKey]: e.target.value,
          };
          handleNewArgs?.(newArgs);
          return newArgs;
        });
      };
    },
    [handleFormKeyChange, handleNewArgs],
  );

  return { formData, onFormChange };
};
