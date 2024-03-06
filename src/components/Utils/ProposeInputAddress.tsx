import { useCallback, useState } from 'react';
import { Address } from '@multiversx/sdk-core';
import { useCustomTranslation } from 'src/hooks/useCustomTranslation';
import { ProposeAddressInput } from 'src/components/Theme/StyledComponents';
import { useMediaQuery } from '@mui/material';
import { useCustomTheme } from 'src/hooks/useCustomTheme';

interface ProposeInputAddressType {
  handleParamsChange: (params: Address) => void;
  setSubmitDisabled: (value: boolean) => void;
  invalidAddress?: boolean;
  disabled?: boolean;
}

function ProposeInputAddress({
  handleParamsChange,
  setSubmitDisabled,
  disabled,
}: ProposeInputAddressType) {
  const theme = useCustomTheme();
  const [address, setAddress] = useState('');
  const [error, setError] = useState(false);
  const t = useCustomTranslation();
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddressChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = String(event.target.value);
    try {
      const parsedValue = new Address(newAddress);
      setError(false);
      setAddress(newAddress);
      handleParamsChange(parsedValue);
      setSubmitDisabled(false);
    } catch (err) {
      setSubmitDisabled(true);
      setAddress(newAddress);
      setError(true);
      if (newAddress.length < 3) {
        setErrorMessage('Too short!');
      } else {
        setErrorMessage('Address is invalid!');
      }
      if (newAddress.length > 500) {
        setErrorMessage('Too long!');
      }
    }
  };

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
        label={`${t('Wallet address')}`}
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
        }}
      />
    </div>
  );
}

export default ProposeInputAddress;
