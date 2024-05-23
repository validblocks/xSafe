import React from 'react';
import { Reorder } from 'framer-motion';
import { Box } from '@mui/material';
import { useState, useCallback, useEffect } from 'react';
import { MainButton } from '../Theme/StyledComponents';
import { useCustomTranslation } from 'src/hooks/useCustomTranslation';
import { CustomTextInput } from '../Utils/styled';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { useCustomTheme } from 'src/hooks/useCustomTheme';
import { DraggableCustomArgument } from './DraggableCustomArgument';
import { ValidationResults } from './helpers/validateArguments';
import { useSelector } from 'react-redux';
import { selectedTemplateToSendSelector } from 'src/redux/selectors/modalsSelector';

export type CustomArg = {
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
  <TValidationResults extends ValidationResults>({
    validationResults,
    handleNewArgs,
    handleChangeEvent,
    handleFunctionNameBlur,
    handleFunctionNameChange,
  }: Props<TValidationResults>) => {
    const t = useCustomTranslation();
    const theme = useCustomTheme();
    const selectedTemplate = useSelector(selectedTemplateToSendSelector);

    const [customArgs, setCustomArgs] = useState<CustomArg[]>(
      selectedTemplate?.params.map((p: string) => ({
        value: p,
        type: 'custom',
        key: Math.floor(Math.random() * 100000),
      })) ?? [],
    );
    const [functionName, setFunctionName] = useState<string>(
      selectedTemplate?.endpoint ?? '',
    );
    const [formData, setFormData] = useState<Record<string, string>>(
      customArgs?.reduce(
        (acc: Record<string, string>, arg: CustomArg) => ({
          ...acc,
          [arg.key]: arg.value,
        }),
        {},
      ) ?? {},
    );

    useEffect(() => {
      handleNewArgs?.(formData);
    }, [formData, handleNewArgs]);

    const addNewArgsField = useCallback(() => {
      setCustomArgs((oldArgs) => {
        const newArgs = [
          ...oldArgs,
          {
            value: '',
            type: 'custom',
            key: `${Math.floor(Math.random() * 10000)}`,
          },
        ];
        return newArgs;
      });
    }, []);

    const removeArg = useCallback((argkey: string) => {
      setCustomArgs((oldArgs) => oldArgs.filter((arg) => arg.key !== argkey));
      setFormData((oldFormData) => {
        const newFormData = { ...oldFormData };
        delete newFormData[argkey];
        return newFormData;
      });
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

    const onValueChange = useCallback(
      (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((oldForm) => ({
          ...oldForm,
          [key]: e.target.value,
        }));
        handleChangeEvent?.(e);
      },
      [handleChangeEvent],
    );

    const handleReorder = useCallback(
      (newArgs: CustomArg[]) => {
        setCustomArgs(newArgs);
        const newFormData = newArgs.reduce(
          (acc: Record<string, string>, arg: CustomArg) => {
            acc[arg.key] = formData[arg.key] || '';
            return acc;
          },
          {},
        );
        setFormData(newFormData);
      },
      [formData],
    );

    return (
      <Box data-testid="cdb-container">
        <Box
          sx={{
            borderTop: `2px solid ${theme.palette.background.default}`,
            p: '2rem',
          }}
        >
          <Text
            sx={{ fontSize: '16px', fontWeight: 'bold' }}
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
          <Box sx={{ px: '2rem', ul: { listStyle: 'none', padding: 0 } }}>
            <Reorder.Group values={customArgs} onReorder={handleReorder}>
              {customArgs?.map((arg, idx) => (
                <DraggableCustomArgument
                  key={arg.key}
                  arg={arg}
                  onValueChange={onValueChange}
                  removeArg={removeArg}
                  className={
                    validationResults?.[arg.key]?.isValid === false
                      ? 'isAddressError'
                      : ''
                  }
                  testId={`cdb-argument-${idx + 1}-text-input`}
                  value={formData[arg.key]}
                  placeholder={`Argument ${idx + 1}`}
                  isInvalid={validationResults?.[arg.key]?.isValid === false}
                  errorMessage={validationResults?.[arg.key]?.error?.reason}
                  label={`Argument ${idx + 1}`}
                  errorMessageTestId={`cdb-argument-${idx + 1}-error`}
                  removeButtonTestId={`cdb-remove-argument-${idx + 1}-button`}
                />
              ))}
            </Reorder.Group>
            <Box display="flex" gap="1.25rem">
              <MainButton
                sx={{ width: '100%', mb: '1rem !important', flex: 1 }}
                data-testid="cdb-add-argument-button"
                onClick={addNewArgsField}
              >
                Add argument
              </MainButton>
            </Box>
          </Box>
        )}
      </Box>
    );
  },
);
