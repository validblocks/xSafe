import React, { memo } from 'react';
import { TextInput } from '../Theme/StyledComponents';

interface ArgumentInputProps {
  value: string;
  classname?: string;
  label?: string;
  placeholder?: string;
  testId?: string;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ArgumentInput = memo(
  ({
    testId,
    value,
    onChange,
    className,
    placeholder,
    label,
  }: ArgumentInputProps) => {
    return (
      <TextInput
        data-testid={testId}
        placeholder={placeholder}
        label={label}
        value={value}
        autoComplete="off"
        onChange={onChange}
        className={className}
      />
    );
  },
);
