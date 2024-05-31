import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Reorder, useDragControls } from 'framer-motion';
import { RemoveItemsButton } from '../Theme/StyledComponents';
import { ArgumentInput } from './ArgumentInput';
import { Box } from '@mui/material';
import { CustomArg } from './CustomDataBuilder';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { useCustomTheme } from 'src/hooks/useCustomTheme';
import React from 'react';

interface IProps {
  arg: CustomArg;
  onValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeArg: (argKey: string) => void;
  className?: string;
  testId?: string;
  value: string;
  placeholder?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  label?: string;
  errorMessageTestId?: string;
  removeButtonTestId?: string;
}

export const DraggableCustomArgument = ({
  arg,
  onValueChange,
  removeArg,
  className,
  testId,
  value,
  placeholder,
  isInvalid,
  errorMessage,
  errorMessageTestId,
  removeButtonTestId,
  label,
}: IProps) => {
  const theme = useCustomTheme();
  const controls = useDragControls();

  return (
    <Reorder.Item
      key={arg.key}
      value={arg}
      drag
      dragListener={false}
      dragControls={controls}
    >
      <Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              mb: 1,
            }}
          >
            <ArgumentInput
              testId={testId}
              placeholder={placeholder}
              label={label}
              value={value}
              onChange={onValueChange}
              handleStartDragAndDrop={(e) => {
                controls.start(e);
              }}
              className={className}
            />
            <Box height={'14px'}>
              {isInvalid && (
                <Text
                  sx={{
                    color: theme.palette.danger.main,
                    fontSize: 11,
                  }}
                  data-testid={errorMessageTestId}
                >
                  {errorMessage}
                </Text>
              )}
            </Box>
          </Box>
          <RemoveItemsButton
            data-testid={removeButtonTestId}
            onClick={() => removeArg(arg.key)}
            sx={{
              alignSelf: 'flex-start',
            }}
          >
            <FontAwesomeIcon className="mx-2" icon={faMinus as IconProp} />
          </RemoveItemsButton>
        </Box>
      </Box>
    </Reorder.Item>
  );
};
