import { useState } from 'react';
import { Address } from '@elrondnetwork/erdjs';
import { useTranslation } from 'react-i18next';
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
      <ProposeAddressInput
        label={`${t('Address')}`}
        id={address}
        disabled={disabled}
        value={address}
        autoComplete="off"
        onChange={handleAddressChanged}
        helperText={error ? `${t('Invalid address')}` : ''}
        className={error ? 'isAddressError' : ''}
      />
      {invalidAddress && !error && (
        <p className="text-danger">
          {t('This is not a valid multisig address')}
        </p>
      )}
    </div>
  );
}

export default ProposeInputAddress;
