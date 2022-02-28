import React, { useState } from 'react';
import { Ui } from '@elrondnetwork/dapp-utils';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { faExternalLinkAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  removeContractFromMultisigContractsList,
  updateMultisigContractOnServer
} from 'apiCalls/multisigContractsCalls';
import { ReactComponent as Wallet } from 'assets/img/wallet-logo.svg';
import TrustedBadge from 'components/TrustedBadge';
import { network } from 'config';
import { uniqueContractAddress } from 'multisigConfig';
import {
  setMultisigContracts,
  updateMultisigContract
} from 'redux/slices/multisigContractsSlice';
import { MultisigContractInfoType } from 'types/multisigContracts';
import ConfirmUnregisterModal from './ConfirmUnregisterModal';
import EditContractNameModal from './EditContractNameModal';

const MultisigCard = ({ contract }: { contract: MultisigContractInfoType }) => {
  const [confirmDeleteContract, setConfirmDeleteContract] = useState(false);
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleUpdateContractName(name: string) {
    const newContract = {
      ...contract,
      name
    };
    updateMultisigContractOnServer(newContract);
    dispatch(updateMultisigContract(newContract));
  }

  function handleOpenUnregisterModal(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setConfirmDeleteContract(true);
  }

  function handleOpenEditNameModal(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setShowEditNameModal(true);
  }

  function handleCloseUnregisterModal(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setConfirmDeleteContract(false);
  }

  function handleCloseEditNameModal(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setShowEditNameModal(false);
  }

  function ontTrustVerificationComplete(isContractTrusted: boolean) {
    dispatch(
      updateMultisigContract({
        address: contract.address,
        isTrusted: isContractTrusted
      })
    );
  }

  const onEnterClicked = () => {
    navigate('/multisig/' + contract.address);
  };

  const onUnregisterContract = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    const newContracts = await removeContractFromMultisigContractsList(
      contract.address
    );
    dispatch(setMultisigContracts(newContracts));
  };

  return (
    <button onClick={onEnterClicked} className='bg-white'>
      {!uniqueContractAddress && (
        <div
          onClick={handleOpenUnregisterModal}
          className={'position-absolute unregister-icon'}
        >
          <FontAwesomeIcon
            icon={faTimes}
            size='lg'
            className='link-second-style'
          />
        </div>
      )}
      <div className='d-flex icon'>
        <Wallet className='logo' />
      </div>
      <div className='align-items-center justify-content-between mb-2'>
        <div className='wallet-details'>
          {contract.name && (
            <div className={'d-flex justify-content-center'}>
              <h5 onClick={handleOpenEditNameModal} className='name mb-20'>
                {contract.name}
                <FontAwesomeIcon className={'edit-icon'} icon={faPencilAlt} />
              </h5>
            </div>
          )}

          <div className='d-flex wallet-address'>
            <TrustedBadge
              contractAddress={contract.address}
              onVerificationComplete={ontTrustVerificationComplete}
              initialValue={contract.isTrusted}
            />
            <Ui.Trim text={contract.address} />
            <a
              href={`${network.explorerAddress}/accounts/${contract.address}`}
              target='_blank'
              onClick={(e) => e.stopPropagation()}
              rel='noreferrer'
              className='link-second-style ml-2'
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} size='lg' />
            </a>
          </div>
          <ConfirmUnregisterModal
            show={confirmDeleteContract}
            handleClose={handleCloseUnregisterModal}
            onConfirmed={onUnregisterContract}
            address={contract.address}
          />
          <EditContractNameModal
            show={showEditNameModal}
            contractName={contract.name}
            onCancel={handleCloseEditNameModal}
            onConfirm={handleUpdateContractName}
          />
        </div>
      </div>
    </button>
  );
};

export default MultisigCard;
