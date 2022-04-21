import React, { useState } from 'react';
import { operations } from '@elrondnetwork/dapp-utils';
import { Address } from '@elrondnetwork/erdjs/out';
import { InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { denomination } from 'config';
import { useOrganizationInfoContext } from 'pages/Organization/OrganizationInfoContextProvider';
import { selectedTokenToSendSelector } from 'redux/selectors/modalsSelector';
import { MultisigSendToken } from 'types/MultisigSendToken';

interface ProposeSendTokenType {
  handleChange: (proposal: MultisigSendToken) => void;
}

const ProposeSendToken = ({ handleChange }: ProposeSendTokenType) => {
  const { t } = useTranslation();

  const selectedToken = useSelector(selectedTokenToSendSelector);
  const [address, setAddress] = useState('');
  const [identifier, setIdentifier] = useState(selectedToken.identifier);
  const [amount, setAmount] = useState('');

  const { tokensState } = useOrganizationInfoContext();
  const [availableTokensWithBalances] = useState(
    tokensState.map((token) => ({
      identifier: token.identifier,
      balance: operations.denominate({
        input: token?.balance?.amount as string,
        denomination: parseInt(token?.balance?.decimals as string) as number,
        decimals: parseInt(token?.balance?.decimals as string) as number,
        showLastNonZeroDecimal: true,
        addCommas: false
      })
    }))
  );

  const getProposal = (): MultisigSendToken | null => {
    try {
      const nominatedAmount = operations.nominate(amount, denomination);
      const amountNumeric = Number(nominatedAmount);
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

  const onAmountChanged = (event: any) => {
    setAmount(event.target.value);
  };

  const onIdentifierChanged = (event: SelectChangeEvent) => {
    setIdentifier(event.target.value as string);
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
      <div className='modal-control-container mb-4'>
        <InputLabel id='demo-simple-select-label'>Identifier</InputLabel>
        <Select
          value={identifier}
          fullWidth
          label='Identifier'
          onChange={onIdentifierChanged}
          className='mb-2'
        >
          {availableTokensWithBalances.map((token, idx) => {
            return (
              <MenuItem key={idx} value={token.identifier}>
                {token.identifier?.split('-')[0]}
              </MenuItem>
            );
          })}
        </Select>
        <div>
          Balance:{' '}
          {
            availableTokensWithBalances.find(
              (token) => token.identifier === identifier
            )?.balance
          }
        </div>
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
