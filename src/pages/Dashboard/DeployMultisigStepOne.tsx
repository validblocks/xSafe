import { transactionServices, useGetLoginInfo } from '@elrondnetwork/dapp-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { addContractToMultisigContractsList } from 'src/apiCalls/multisigContractsCalls';
import { FinalStepActionButton } from 'src/components/Theme/StyledComponents';
import { deployMultisigContract } from 'src/contracts/ManagerContract';
import { MultisigContractInfoType } from 'src/types/multisigContracts';
import { useMultisigCreationFormContext } from './DeployMultisigModal';

interface DeployStepsModalType {
    handleClose: () => void;
    setNewContracts: (contracts: MultisigContractInfoType[]) => void;
    enableNextStep?: (enabled: boolean) => ReturnType<React.Dispatch<React.SetStateAction<Record<number, boolean>>>>;
}

const DeployMultisigStepOne = ({
  handleClose,
  setNewContracts,
  enableNextStep = () => null,
}: DeployStepsModalType) => {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const { isLoggedIn } = useGetLoginInfo();

  const { pendingDeploymentData: { pendingDeploymentContractData, setPendingDeploymentContractData } } =
        useMultisigCreationFormContext();

  async function onAddMultisigFinished() {
    const { multisigAddress } = pendingDeploymentContractData!;
    const newContracts = await addContractToMultisigContractsList({
      address: multisigAddress,
      name,
    });
    setNewContracts(newContracts);
    enableNextStep(true);
    setName('');
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
  }
  return (
    <div className="card">
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

          <FinalStepActionButton
            disabled={!isLoggedIn || name.length <= 3}
            onClick={() => onDeploy()}
          >
            {isLoggedIn ? 'Deploy' : 'Login first'}
          </FinalStepActionButton>
        </div>
      </div>
    </div>
  );
};

export default DeployMultisigStepOne;
