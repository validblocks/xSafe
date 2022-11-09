import { useState } from 'react';
import { Address } from '@elrondnetwork/erdjs';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import { ProposeAddressInput } from 'src/components/Theme/StyledComponents';

interface ProposeInputAddressType {
  handleParamsChange: (params: Address) => void;
  setSubmitDisabled: (value: boolean) => void;
  invalidAddress?: boolean;
  disabled?: boolean;
}

function ProposeInputAddress({
  handleParamsChange,
  setSubmitDisabled,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  invalidAddress,
  disabled,
}: ProposeInputAddressType) {
  const theme: any = useTheme();
  const [address, setAddress] = useState('');
  const [error, setError] = useState(false);
  const { t }: { t: any } = useTranslation();
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddressChanged = (event: any) => {
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

  return (
    <div>
      <ProposeAddressInput
        error={error}
        label={`${t('Wallet address')}`}
        id={address}
        disabled={disabled}
        value={address}
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
