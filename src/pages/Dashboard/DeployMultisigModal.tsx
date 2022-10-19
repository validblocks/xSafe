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

const DeployStepsModal = ({
  show,
  handleClose,
  setNewContracts,
}: DeployStepsModalType) => {
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
          finalActionText="Change owner"
          steps={steps}
        />
      </Modal>
    </MultisigCreationFormContext.Provider>
  );
};

export default DeployStepsModal;
