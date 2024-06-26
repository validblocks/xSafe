import { useState, useCallback } from 'react';

interface UseFormDataConfig {
  handleFormKeyChange?: (formKey: string) => any;
  handleNewArgs?: (newArgs: Record<string, string>) => void;
  handleChangeEvent?: (e?: React.ChangeEvent) => void;
}

export const useFormData = ({
  handleFormKeyChange,
  handleChangeEvent,
}: UseFormDataConfig) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const onFormChange = useCallback(
    (formKey: string) => {
      handleFormKeyChange?.(formKey);
      return (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChangeEvent?.(e);
        setFormData((oldForm) => {
          const newArgs = {
            ...oldForm,
            [formKey]: e.target.value,
          };
          return newArgs;
        });
      };
    },
    [handleChangeEvent, handleFormKeyChange],
  );

  return { formData, onFormChange };
};
