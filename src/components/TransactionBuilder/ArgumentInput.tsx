import React, { memo, useCallback } from 'react';
import { TextInput } from '../Theme/StyledComponents';
import { Box, InputAdornment } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

interface ArgumentInputProps {
  value: string;
  classname?: string;
  label?: string;
  placeholder?: string;
  testId?: string;
  className?: string;
  handleStartDragAndDrop?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  otherProps?: any;
}

export const ArgumentInput = memo(
  ({
    testId,
    value,
    onChange,
    className,
    placeholder,
    label,
    handleStartDragAndDrop,
  }: ArgumentInputProps) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e);
      },
      [onChange],
    );

    return (
      <TextInput
        placeholder={placeholder}
        label={label}
        value={value}
        autoComplete="off"
        onChange={handleChange}
        className={className}
        InputProps={{
          'data-testid': testId,
          endAdornment: (
            <InputAdornment position="end">
              <Box
                onPointerDown={handleStartDragAndDrop}
                style={{ touchAction: 'none' }}
              >
                <DragIndicatorIcon sx={{ color: '#6B6B6B' }} />
              </Box>
            </InputAdornment>
          ),
        }}
      />
    );
  },
);
