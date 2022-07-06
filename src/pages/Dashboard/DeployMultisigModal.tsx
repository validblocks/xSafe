import { useState } from 'react';
import { transactionServices } from '@elrondnetwork/dapp-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { addContractToMultisigContractsList } from 'src/apiCalls/multisigContractsCalls';
import { deployMultisigContract } from 'src/contracts/ManagerContract';
import { MultisigContractInfoType } from 'src/types/multisigContracts';

interface DeployStepsModalType {
  show: boolean;
  handleClose: () => void;
  setNewContracts: (contracts: MultisigContractInfoType[]) => void;
}

interface PendingDeploymentContractData {
  multisigAddress: string;
  transactionId: string | null;
}

function DeployStepsModal({
  show,
  handleClose,
  setNewContracts
}: DeployStepsModalType) {
  const { t } = useTranslation();

  const [name, setName] = useState('');

  const [pendingDeploymentContractData, setPendingDeploymentContractData] =
    useState<PendingDeploymentContractData | null>(null);

  async function onAddMultisigFinished() {
    const { multisigAddress } = pendingDeploymentContractData!;
    const newContracts = await addContractToMultisigContractsList({
      address: multisigAddress,
      name,
    });
    setNewContracts(newContracts);
    handleClose();
  }

  transactionServices.useTrackTransactionStatus({
    transactionId: pendingDeploymentContractData?.transactionId || null,
    onSuccess: onAddMultisigFinished,
  });

  async function onDeploy() {
    const { multisigAddress, sessionId } = await deployMultisigContract();
    setPendingDeploymentContractData({
      multisigAddress,
      transactionId: sessionId,
    });
    setName('');
    handleClose();
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      className="modal-container"
      animation={false}
      centered
    >
      <div className="card">
        <div className="card-body p-spacer ">
          <p className="h3 text-center" data-testid="delegateTitle">
            {t('Multisig Deployment')}
          </p>

          <div className="modal-control-container">
            <label htmlFor={name}>
              {t('Name')}
              :
            </label>
            <input
              id={name}
              type="text"
              className="form-control"
              value={name}
              autoComplete="off"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="modal-action-btns">
            <button
              onClick={handleClose}
              className="btn btn-primary btn-light "
            >
              <FontAwesomeIcon icon={faTimes} />
              {t('Cancel')}
            </button>
            <button onClick={onDeploy} className="btn btn-primary mb-3">
              Sign and Deploy
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default DeployStepsModal;
