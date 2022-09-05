import { Modal } from 'react-bootstrap';
import { MultisigContractInfoType } from 'src/types/multisigContracts';
import MultistepForm from 'src/components/Utils/MultistepForm';
import { createContext, useContext, useMemo, useState } from 'react';
import DeployMultisigStepOne from './DeployMultisigStepOne';
import DeployMultisigStepTwo from './DeployMultisigStepTwo';

export interface DeployStepsModalType {
  show: boolean;
  handleClose: () => void;
  setNewContracts: (contracts: MultisigContractInfoType[]) => void;
}

export interface PendingDeploymentContractData {
  multisigAddress: string;
  transactionId: string | null;
}

interface IMultisigCreationFormContextType {
    pendingDeploymentData: any
}

const MultisigCreationFormContext = createContext<IMultisigCreationFormContextType>(
  {} as IMultisigCreationFormContextType,
);

export const useMultisigCreationFormContext = () =>
  useContext(MultisigCreationFormContext);

function DeployStepsModal({
  show,
  handleClose,
  setNewContracts,
}: DeployStepsModalType) {
  const steps = [
    <DeployMultisigStepOne
      handleClose={handleClose}
      setNewContracts={setNewContracts}
    />,
    <DeployMultisigStepTwo
      handleClose={handleClose}
    />,
  ];

  const [pendingDeploymentContractData, setPendingDeploymentContractData] =
    useState<PendingDeploymentContractData | null>(null);

  return (
    <MultisigCreationFormContext.Provider
      value={useMemo(() => ({
        pendingDeploymentData: { pendingDeploymentContractData, setPendingDeploymentContractData },
      }),
      [pendingDeploymentContractData])}
    >
      <Modal
        show={show}
        onHide={handleClose}
        className="modal-container"
        animation={false}
        centered
      >
        <MultistepForm
          finalActionText="Create Multisig"
          steps={steps}
        />
        {/* <div className="card">
        <div className="card-body p-spacer ">
          <p className="h3 text-center" data-testid="delegateTitle">
            {t('Multisig Deployment') as string}
          </p>

          <div className="modal-control-container">
            <label htmlFor={name}>
              {t('Name') as string}
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
              {t('Cancel') as string}
            </button>
            <button disabled={!isLoggedIn} onClick={onDeploy} className="btn btn-primary mb-3">
              {isLoggedIn ? 'Sign and Deploy' : 'Login first'}
            </button>
          </div>
        </div>
      </div> */}
      </Modal>
    </MultisigCreationFormContext.Provider>
  );
}

export default DeployStepsModal;
