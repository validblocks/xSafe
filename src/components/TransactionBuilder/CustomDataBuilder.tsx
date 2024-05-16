import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Reorder } from 'framer-motion';
import { Box } from '@mui/material';
import { useState, useCallback } from 'react';
import {
  TextInput,
  RemoveItemsButton,
  MainButton,
} from '../Theme/StyledComponents';
import { useCustomTranslation } from 'src/hooks/useCustomTranslation';
import { CustomTextInput } from '../Utils/styled';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { useCustomTheme } from 'src/hooks/useCustomTheme';
import { useFormData } from 'src/hooks/useFormData';

type CustomArg = {
  value: string;
  type: string;
  key: string;
};

interface Props {
  error: boolean;
  functionName: string;
  handleFormKeyChange?: (index: string) => any;
  handleFunctionNameBlur: (e?: React.FocusEvent) => void;
  handleNewArgs?: (newArgs: Record<string, string>) => void;
  handleFunctionNameChange: (e?: React.ChangeEvent) => void;
}

export const CustomDataBuilder = ({
  error,
  handleNewArgs,
  handleFormKeyChange,
  handleFunctionNameBlur,
  handleFunctionNameChange,
}: Props) => {
  const t = useCustomTranslation();
  const theme = useCustomTheme();

  const [customArgs, setCustomArgs] = useState<CustomArg[]>([]);
  const [functionName, setFunctionName] = useState<string>('');

  const { formData, onFormChange } = useFormData(
    handleFormKeyChange,
    handleNewArgs,
  );

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
      handleFunctionNameBlur(e);
    },
    [handleFunctionNameBlur],
  );

  return (
    <>
      <Box>
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
            onChange={onFunctionNameChange}
            onBlur={onFunctionNameBlur}
            value={functionName}
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
                        <TextInput
                          placeholder={`Argument ${idx + 1}`}
                          label={`Argument ${idx + 1}`}
                          value={formData[idx]}
                          autoComplete="off"
                          onChange={onFormChange(idx.toString())}
                          className={error ? 'isAddressError' : ''}
                        />
                      </Box>
                      <RemoveItemsButton
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
};
