import React, { useCallback, useMemo, useState } from 'react';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import makeStyles from '@mui/styles/makeStyles/makeStyles';
import { useCustomTheme } from 'src/hooks/useCustomTheme';
import { MainSelect, TextInput } from '../Theme/StyledComponents';
import { Box, MenuItem } from '@mui/material';
import { SmartContract } from '@multiversx/sdk-core/out';
import { useFormData } from 'src/hooks/useFormData';

interface Props {
  error: boolean;
  smartContract: SmartContract;
  availableContractEndpoints: string[];
  handleSelectedEndpointChange: (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => void;
  handleFormKeyChange?: (index: string) => any;
  handleNewArgs?: (newArgs: Record<string, string>) => void;
}

export const TransactionBuilderWithAbi = ({
  error,
  smartContract,
  handleNewArgs,
  availableContractEndpoints,
  handleSelectedEndpointChange,
  handleFormKeyChange,
}: Props) => {
  const theme = useCustomTheme();

  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
  const { formData, onFormChange } = useFormData(
    handleFormKeyChange,
    handleNewArgs,
  );

  const useStyles = makeStyles(() => ({
    dropdown: {
      '& .MuiPaper-root': {
        marginTop: '6px',
        width: '155px',
        backgroundColor: theme.palette.background.secondary,
        '& .MuiButtonBase-root': {
          color: theme.palette.text.primary,
        },
      },
      '@media (max-width:600px)': {
        '& .MuiPaper-root': {
          width: '100%',
        },
      },
    },
  }));
  const styleProp = useStyles();

  const onSelectedInputChanged = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setSelectedEndpoint(value);
      handleSelectedEndpointChange?.(e);
    },
    [handleSelectedEndpointChange],
  );

  const endpointArguments = useMemo(() => {
    try {
      if (!selectedEndpoint || !smartContract) return [];

      const inputParams = smartContract.getEndpoint(selectedEndpoint).input;

      return inputParams;
    } catch (e) {
      console.error(e);
      return [];
    }
  }, [selectedEndpoint, smartContract]);

  return (
    <Box>
      <Box
        sx={{
          p: '2rem',
          borderTop: `2px solid ${theme.palette.background.default}`,
        }}
      >
        <Text
          sx={{
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          Transaction Information
        </Text>
      </Box>
      <Box sx={{ px: '2rem' }}>
        {availableContractEndpoints &&
        availableContractEndpoints?.length > 0 ? (
          <Box>
            <MainSelect
              id="endpoint-select"
              value={selectedEndpoint ?? availableContractEndpoints?.[0]}
              sx={{
                width: '100%',
                padding: '16px 14px !important',
                '& .MuiSelect-select.MuiInputBase-input.MuiInput-input': {
                  padding: '0 !important',
                },
              }}
              size="medium"
              variant="standard"
              MenuProps={{ className: styleProp.dropdown }}
              onChange={onSelectedInputChanged}
            >
              {availableContractEndpoints?.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </MainSelect>
          </Box>
        ) : (
          <Box>
            <Text
              sx={{
                fontSize: '14px',
              }}
            >
              No endpoints on the provided ABI.
            </Text>
          </Box>
        )}
      </Box>
      <Box p="2rem" pt={0}>
        {endpointArguments.map((inputParam, idx) => (
          <Box key={`${inputParam.name} ${idx}`} pt={2}>
            <TextInput
              label={`${inputParam.name} (${inputParam.type.getName()} in hex)`}
              placeholder={`${
                inputParam.name
              } (${inputParam.type.getName()} in hex)`}
              value={formData[inputParam.name]}
              autoComplete="off"
              onChange={onFormChange(inputParam.name)}
              className={error ? 'isAddressError' : ''}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
