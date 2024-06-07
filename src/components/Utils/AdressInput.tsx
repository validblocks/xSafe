import { useCallback, useEffect, useState } from 'react';
import { Address } from '@multiversx/sdk-core';
import { useCustomTranslation } from 'src/hooks/useCustomTranslation';
import { ProposeAddressInput } from 'src/components/Theme/StyledComponents';
import { useMediaQuery } from '@mui/material';
import { useCustomTheme } from 'src/hooks/useCustomTheme';

interface AddressInputProps {
  handleParamsChange: (params: Address) => void;
  handleAddressIsInvalid?: (
    errorMessage: string | null,
    newAddress: string,
  ) => void;
  invalidAddress?: boolean;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  initialAddress?: string;
}

function AddressInput({
  handleParamsChange,
  disabled,
  placeholder = 'Enter Address',
  label = 'Address',
  handleAddressIsInvalid,
  initialAddress = '',
}: AddressInputProps) {
  const theme = useCustomTheme();
  const [address, setAddress] = useState(initialAddress ?? '');
  const [error, setError] = useState(false);
  const t = useCustomTranslation();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    try {
      handleParamsChange(new Address(address));
    } catch (e) {
      console.error(e);
    }
  }, [address, handleParamsChange]);

  const handleAddressChanged = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newAddress = String(event.target.value);
      const addressLength = 62;
      try {
        const parsedValue = new Address(newAddress);
        setError(false);
        setAddress(newAddress);
        handleParamsChange(parsedValue);
        handleAddressIsInvalid?.(null, newAddress);
      } catch (err) {
        setAddress(newAddress);
        setError(true);
        let errorMessage = 'Address is invalid!';
        if (newAddress.length < addressLength) {
          errorMessage = 'Too short!';
        } else if (newAddress.length > addressLength) {
          errorMessage = 'Address too long!';
        }

        setErrorMessage(errorMessage);
        handleAddressIsInvalid?.(errorMessage, newAddress);
      }
    },
    [handleAddressIsInvalid, handleParamsChange],
  );

  const minWidth600 = useMediaQuery('(min-width:600px)');
  const focusInput = useCallback(
    (input: any) => {
      if (minWidth600) input?.focus();
    },
    [minWidth600],
  );

  return (
    <div>
      <ProposeAddressInput
        error={error}
        label={`${t(label)}`}
        placeholder={`${t(placeholder)}`}
        id={address}
        disabled={disabled}
        value={address}
        inputRef={focusInput}
        autoComplete="off"
        onChange={handleAddressChanged}
        helperText={error ? errorMessage : null}
        className={error ? 'isAddressError' : ''}
        sx={{
          '& label': {
            color: theme.palette.text.primary,
          },
          '& input': {
            color: theme.palette.text.primary,
          },
          '& fieldset': {
            borderColor: `${theme.palette.borders.secondary} !important`,
          },
          '&:hover fieldset': {
            borderColor: `${theme.palette.borders.active} !important`,
          },
          '& p.MuiFormHelperText-root': {
            ml: '.35rem !important',
            fontSize: '11.2px',
          },
          '&:focus-within': {
            '& fieldset': { borderColor: '#4c2ffc !important' },
            '& label': { color: theme.palette.primary.main },
          },
          '&.isAddressError:focus-within': {
            '& label': { color: '#e51a3e !important' },
          },
          '& .MuiInputLabel-root,& .MuiInputLabel-formControl': {
            color: theme.palette.text.primary,
            zIndex: 0,
          },
        }}
        inputProps={{ 'data-testid': 'address-input' }}
      />
    </div>
  );
}

export default AddressInput;
