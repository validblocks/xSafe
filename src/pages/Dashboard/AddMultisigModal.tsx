import { useState } from 'react';
import { Address } from '@elrondnetwork/erdjs';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  addContractToMultisigContractsList,
} from 'src/apiCalls/multisigContractsCalls';
import { MultisigContractInfoType } from 'src/types/multisigContracts';
import { ElrondApiProvider } from 'src/services/ElrondApiNetworkProvider';
import { useGetLoginInfo } from '@elrondnetwork/dapp-core';
import ProposeInputAddress from '../MultisigDetails/ProposeModal/ProposeInputAddress';

interface AddMultisigModalType {
  show: boolean;
  handleClose: () => void;
  setNewContracts: (contracts: MultisigContractInfoType[]) => void;
}

function AddMultisigModal({
  show,
  handleClose,
  setNewContracts,
}: AddMultisigModalType) {
  const { t } = useTranslation();

  const [address, setAddress] = useState(Address.Zero());
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [invalidMultisigAddress, setInvalidMultisigAddress] = useState(false);
  const [name, setName] = useState('');
  const { isLoggedIn } = useGetLoginInfo();

  async function onAddressParamChange(newAddress: Address) {
    setInvalidMultisigAddress(false);
    setAddress(newAddress);
  }
  async function onContractNameChange(e: any) {
    setName(e.target.value);
  }
  async function onAddClicked() {
    const contractAddress = address.bech32();
    const isAddressValid = await ElrondApiProvider.validateMultisigAddress(contractAddress);
    if (isAddressValid) {
      const newContracts = await addContractToMultisigContractsList({
        address: contractAddress,
        name,
      });
      setNewContracts(newContracts);
      handleClose();
    } else {
      setInvalidMultisigAddress(true);
    }
  }

  return (
    <Modal
      size="lg"
      show={show}
      onHide={handleClose}
      className="modal-container"
      animation={false}
      centered
    >
      <div className="card">
        <div className="card-body ">
          <p className="h3 text-center" data-testid="delegateTitle">
            {t('Add Multisig') as string}
          </p>
          <ProposeInputAddress
            invalidAddress={invalidMultisigAddress}
            setSubmitDisabled={setSubmitDisabled}
            handleParamsChange={(newAddress) =>
              onAddressParamChange(newAddress)
            }
          />
          <div className="modal-control-container">
            <label htmlFor={name}>{t('Name (optional)') as string}</label>
            <input
              id={name}
              type="text"
              className="form-control"
              value={name}
              autoComplete="off"
              onChange={onContractNameChange}
            />
          </div>
          <div className="modal-action-btns">
            <button
              onClick={handleClose}
              className="btn btn-primary btn-light "
            >
              <FontAwesomeIcon icon={faTimes} />
              {t('Cancel') as string}
            </button>
            <button
              disabled={submitDisabled || !isLoggedIn}
              onClick={onAddClicked}
              className="btn btn-primary mb-3"
            >
              {isLoggedIn ? (t('Add') as string) : (t('Login first') as string)}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default AddMultisigModal;
