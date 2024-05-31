import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { useCustomTheme } from 'src/hooks/useCustomTheme';
import { TextInput } from '../Theme/StyledComponents';
import { Box } from '@mui/material';
import { SmartContract } from '@multiversx/sdk-core/out';
import { useFormData } from 'src/hooks/useFormData';
import CustomSelect from '../Utils/CustomSelect';
import { CustomArg } from './CustomDataBuilder';

interface Props<TValidationResult> {
  error: TValidationResult;
  smartContract: SmartContract;
  availableContractEndpoints: string[];
  handleSelectedEndpointChange: (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => void;
  handleFormKeyChange?: (index: string) => any;
  handleNewArgs?: (newArgs: CustomArg[]) => void;
}

export const TransactionBuilderWithAbi = <TValidationResult,>({
  error,
  smartContract,
  handleNewArgs,
  availableContractEndpoints,
  handleSelectedEndpointChange,
  handleFormKeyChange,
}: Props<TValidationResult>) => {
  const theme = useCustomTheme();

  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
  const { formData, onFormChange } = useFormData({
    handleFormKeyChange,
  });

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

      const args = smartContract.getEndpoint(selectedEndpoint).input;

      return args;
    } catch (e) {
      console.error(e);
      return [];
    }
  }, [selectedEndpoint, smartContract]);

  useEffect(() => {
    const argsArray = endpointArguments?.reduce(
      (acc: CustomArg[], item) => [
        ...acc,
        {
          key: item.name,
          value: formData[item.name],
          type: 'custom',
        },
      ],
      [],
    );
    handleNewArgs?.(argsArray);
  }, [endpointArguments, formData, handleNewArgs]);

  const endpointOptions = useMemo(
    () =>
      availableContractEndpoints.map((item) => ({
        key: item,
        value: item,
        displayValue: item,
      })),
    [availableContractEndpoints],
  );

  return (
    <Box data-testid="tbwa-container">
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
            <CustomSelect
              width="100%"
              handleSelectionChanged={onSelectedInputChanged}
              options={endpointOptions}
            />
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
        {endpointArguments.map((arg, idx) => (
          <Box key={`${arg.name} ${idx}`} pt={2}>
            <TextInput
              label={`${arg.name} (${arg.type.getName()} in hex)`}
              placeholder={`${arg.name} (${arg.type.getName()} in hex)`}
              value={formData[arg.name]}
              autoComplete="off"
              onChange={onFormChange(arg.name)}
              className={error ? 'isAddressError' : ''}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
