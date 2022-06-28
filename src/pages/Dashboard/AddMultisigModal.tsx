import React, { useState } from 'react';
import { Address } from '@elrondnetwork/erdjs';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  addContractToMultisigContractsList,
  validateMultisigAddress
} from 'apiCalls/multisigContractsCalls';
import { MultisigContractInfoType } from 'types/multisigContracts';
import ProposeInputAddress from '../MultisigDetails/ProposeModal/ProposeInputAddress';

interface AddMultisigModalType {
  show: boolean;
  handleClose: () => void;
  setNewContracts: (contracts: MultisigContractInfoType[]) => void;
}

function AddMultisigModal({
  show,
  handleClose,
  setNewContracts
}: AddMultisigModalType) {
  const { t } = useTranslation();

  const [address, setAddress] = useState(Address.Zero());
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [invalidMultisigAddress, setInvalidMultisigAddress] = useState(false);
  const [name, setName] = useState('');

  async function onAddressParamChange(newAddress: Address) {
    setInvalidMultisigAddress(false);
    setAddress(newAddress);
  }
  async function onContractNameChange(e: any) {
    setName(e.target.value);
  }
  async function onAddClicked() {
    const contractAddress = address.bech32();
    const isAddressValid = await validateMultisigAddress(contractAddress);
    if (!isAddressValid) {
      return setInvalidMultisigAddress(true);
    }
    const newContracts = await addContractToMultisigContractsList({
      address: contractAddress,
      name
    });
    setNewContracts(newContracts);
    handleClose();
  }

  return (
    <Modal
      size='lg'
      show={show}
      onHide={handleClose}
      className='modal-container'
      animation={false}
      centered
    >
      <div className='card'>
        <div className='card-body '>
          <p className='h3 text-center' data-testid='delegateTitle'>
            {t('Add Multisig')}
          </p>
          <ProposeInputAddress
            invalidAddress={invalidMultisigAddress}
            setSubmitDisabled={setSubmitDisabled}
            handleParamsChange={onAddressParamChange}
          />{' '}
          <div className='modal-control-container'>
            <label>{t('Name (optional)')} </label>
            <input
              type='text'
              className='form-control'
              value={name}
              autoComplete='off'
              onChange={onContractNameChange}
            />
          </div>
          <div className='modal-action-btns'>
            <button
              onClick={handleClose}
              className='btn btn-primary btn-light '
            >
              <FontAwesomeIcon icon={faTimes} />
              {t('Cancel')}
            </button>
            <button
              disabled={submitDisabled}
              onClick={onAddClicked}
              className='btn btn-primary mb-3'
            >
              {t('Add')}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default AddMultisigModal;
