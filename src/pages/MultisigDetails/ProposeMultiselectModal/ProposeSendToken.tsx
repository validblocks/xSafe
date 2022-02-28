import React, { useState } from 'react';
import { Address } from '@elrondnetwork/erdjs/out';
import { useTranslation } from 'react-i18next';
import { MultisigSendToken } from 'types/MultisigSendToken';

interface ProposeSendTokenType {
  handleChange: (proposal: MultisigSendToken) => void;
}

const ProposeSendToken = ({ handleChange }: ProposeSendTokenType) => {
  const { t } = useTranslation();

  const [address, setAddress] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [amount, setAmount] = useState('');

  const getProposal = (): MultisigSendToken | null => {
    try {
      const amountNumeric = Number(amount);
      if (isNaN(amountNumeric)) {
        return null;
      }
      const parsedAddress = new Address(address);

      return new MultisigSendToken(parsedAddress, identifier, amountNumeric);
    } catch (err) {
      return null;
    }
  };

  const refreshProposal = () => {
    setTimeout(() => {
      const proposal = getProposal();

      if (proposal !== null) {
        handleChange(proposal);
      }
    }, 100);
  };

  const onAddressChanged = (event: any) => {
    setAddress(event.target.value);
  };

  const onIdentifierChanged = (event: any) => {
    setIdentifier(event.target.value);
  };

  const onAmountChanged = (event: any) => {
    setAmount(event.target.value);
  };

  React.useEffect(() => {
    refreshProposal();
  }, [address, identifier, amount]);

  return (
    <div>
      <div className='modal-control-container'>
        <label>{t('Address')}: </label>
        <input
          type='text'
          className='form-control'
          value={address}
          autoComplete='off'
          onChange={onAddressChanged}
        />
      </div>
      <div className='modal-control-container'>
        <label>{t('Identifier')}: </label>
        <input
          type='text'
          className='form-control'
          value={identifier}
          autoComplete='off'
          onChange={onIdentifierChanged}
        />
      </div>
      <div className='modal-control-container'>
        <label>{t('Amount')}: </label>
        <input
          type='number'
          className='form-control'
          value={amount}
          autoComplete='off'
          onChange={onAmountChanged}
        />
      </div>
    </div>
  );
};

export default ProposeSendToken;
