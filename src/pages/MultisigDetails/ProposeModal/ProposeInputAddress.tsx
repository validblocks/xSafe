import { useState } from 'react';
import { Address } from '@elrondnetwork/erdjs';
import { useTranslation } from 'react-i18next';
import { ProposeAddressInput } from 'src/components/Theme/StyledComponents';
import { Typography } from '@mui/material';

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
  const [address, setAddress] = useState('');
  const [error, setError] = useState(false);
  const { t }: { t: any } = useTranslation();

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
    }
  };

  return (
    <div>
      <Typography fontSize={24} pb={'21px'} lineHeight={1}>
        Add a new owner
      </Typography>

      <ProposeAddressInput
        error={error}
        label={`${t('Address')}`}
        id={address}
        disabled={disabled}
        value={address}
        autoComplete="off"
        onChange={handleAddressChanged}
        helperText={error ? `${t('This is not a valid multisig address')}` : ''}
        className={error ? 'isAddressError' : ''}
        sx={{
          '&:hover fieldset': {
            borderColor: '#08041D',
          },
          '& p.MuiFormHelperText-root': {
            ml: '.35rem !important',
            fontSize: '11.2px',
          },
          '& fieldset': {
            borderColor: '#4c2ffc8a !important',
          },
          '&:focus-within': {
            '& fieldset': { borderColor: '#4c2ffc !important' },
            '& label': { color: '#4c2ffc' },
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
