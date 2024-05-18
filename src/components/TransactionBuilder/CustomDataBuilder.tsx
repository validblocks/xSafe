import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Reorder } from 'framer-motion';
import { Box } from '@mui/material';
import { useState, useCallback } from 'react';
import { RemoveItemsButton, MainButton } from '../Theme/StyledComponents';
import { useCustomTranslation } from 'src/hooks/useCustomTranslation';
import { CustomTextInput } from '../Utils/styled';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { useCustomTheme } from 'src/hooks/useCustomTheme';
import { useFormData } from 'src/hooks/useFormData';
import React from 'react';
import { ArgumentInput } from './ArgumentInput';

type CustomArg = {
  value: string;
  type: string;
  key: string;
};

interface Props<TValidationResults> {
  validationResults?: TValidationResults;
  handleNewArgs?: (newArgs: Record<string, string>) => void;
  handleChangeEvent?: (e?: React.ChangeEvent) => void;
  handleFormKeyChange?: (index: string) => any;
  handleFunctionNameBlur?: (e?: React.FocusEvent) => void;
  handleFunctionNameChange?: (e?: React.ChangeEvent) => void;
}

export const CustomDataBuilder = React.memo(
  <TValidationResults extends any[]>({
    validationResults,
    handleNewArgs,
    handleChangeEvent,
    handleFormKeyChange,
    handleFunctionNameBlur,
    handleFunctionNameChange,
  }: Props<TValidationResults>) => {
    const t = useCustomTranslation();
    const theme = useCustomTheme();

    const [customArgs, setCustomArgs] = useState<CustomArg[]>([]);
    const [functionName, setFunctionName] = useState<string>('');

    const { formData, onFormChange } = useFormData({
      handleFormKeyChange,
      handleNewArgs,
      handleChangeEvent,
    });

    const addNewArgsField = useCallback(() => {
      setCustomArgs((oldArgs) => [
        ...oldArgs,
        { value: '', type: 'custom', key: Math.random().toString() },
      ]);
    }, []);

    const removeArg = useCallback((argkey: string) => {
      setCustomArgs((oldArgs) => oldArgs.filter((arg) => arg.key !== argkey));
    }, []);

    const onFunctionNameChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFunctionNameChange?.(e);
        setFunctionName(e.target.value);
      },
      [handleFunctionNameChange],
    );

    const onFunctionNameBlur = useCallback(
      (e: React.FocusEvent) => {
        handleFunctionNameBlur?.(e);
      },
      [handleFunctionNameBlur],
    );

    console.log({ customArgs, validationResults });

    return (
      <>
        <Box data-testid="cdb-container">
          <Box
            sx={{
              borderTop: `2px solid ${theme.palette.background.default}`,
              p: '2rem',
            }}
          >
            <Text
              sx={{
                fontSize: '16px',
                fontWeight: 'bold',
              }}
              data-testid="cdb-title"
            >
              Custom Data
            </Text>
          </Box>
          <Box px="2rem" pb="1rem">
            <CustomTextInput
              variant="outlined"
              label={t('Function name') as string}
              id={functionName}
              name="functionName"
              placeholder="Enter function name"
              onChange={onFunctionNameChange}
              onBlur={onFunctionNameBlur}
              value={functionName}
              inputProps={{ 'data-testid': 'cdb-function-name-input' }}
            />
          </Box>

          {functionName?.length > 0 && (
            <Box
              sx={{
                px: '2rem',
                ul: {
                  listStyle: 'none',
                  padding: 0,
                },
              }}
            >
              <Reorder.Group values={customArgs} onReorder={setCustomArgs}>
                {customArgs?.map((arg, idx) => (
                  <Reorder.Item key={arg.key} value={arg} draggable>
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
                            testId={`cdb-argument-${idx + 1}-text-input`}
                            placeholder={`Argument ${idx + 1}`}
                            label={`Argument ${idx + 1}`}
                            value={formData[idx]}
                            onChange={onFormChange(idx.toString())}
                            className={
                              !validationResults?.[idx]?.isValid
                                ? 'isAddressError'
                                : ''
                            }
                          />
                          <Box height={'14px'}>
                            {validationResults?.[idx]?.isValid === false && (
                              <Text
                                sx={{
                                  color: theme.palette.danger.main,
                                  fontSize: 11,
                                }}
                                data-testid={`cdb-argument-${idx + 1}-error`}
                              >
                                {validationResults?.[idx]?.error?.reason}
                              </Text>
                            )}
                          </Box>
                        </Box>
                        <RemoveItemsButton
                          data-testid={`cdb-remove-argument-${idx + 1}-button`}
                          onClick={() => removeArg(arg.key)}
                          sx={{
                            alignSelf: 'flex-start',
                          }}
                        >
                          <FontAwesomeIcon
                            className="mx-2"
                            icon={faMinus as IconProp}
                          />
                        </RemoveItemsButton>
                      </Box>
                    </Box>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
              <Box display="flex" gap="1.25rem">
                <MainButton
                  sx={{
                    width: '100%',
                    mb: '1rem !important',
                    flex: 1,
                  }}
                  data-testid="cdb-add-argument-button"
                  onClick={addNewArgsField}
                >
                  Add argument
                </MainButton>
              </Box>
            </Box>
          )}
        </Box>
      </>
    );
  },
);
