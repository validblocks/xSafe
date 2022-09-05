import { getAccountProviderType, transactionServices } from '@elrondnetwork/dapp-core';
import { Address } from '@elrondnetwork/erdjs/out';
import { Box } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMultistepFormContext } from 'src/components/Utils/MultistepForm';
import { gasLimit } from 'src/config';
import { buildBlockchainTransaction } from 'src/contracts/transactionUtils';
import { useMultisigCreationFormContext } from './DeployMultisigModal';

interface DeployStepsModalType {
    handleClose: () => void;
}

const DeployMultisigStepTwo = ({
  handleClose,
}: DeployStepsModalType) => {
  const { t } = useTranslation();

  const [newOwnerAddress, setName] = useState('');
  const providerType = getAccountProviderType();
  const { pendingDeploymentData: { pendingDeploymentContractData } } =
    useMultisigCreationFormContext();

  const { setIsFinalStepButtonActive, setBuiltFinalActionHandler } = useMultistepFormContext();

  const onSignChangeContractOwner = useCallback(async () => {
    const address = Address.fromBech32(pendingDeploymentContractData?.multisigAddress);
    try {
      const data = `ChangeOwnerAddress@${address.hex()}`;

      const transaction = buildBlockchainTransaction(
        0,
        providerType,
        new Address(pendingDeploymentContractData?.multisigAddress),
        data,
        gasLimit,
      );
      transactionServices.sendTransactions({ transactions: transaction });
      handleClose();
    } catch (error) {
      console.error('An error occurred, please try again');
    }
  }, [handleClose, pendingDeploymentContractData?.multisigAddress, providerType]);

  useEffect(() => {
    setIsFinalStepButtonActive(true);
    setBuiltFinalActionHandler(() => () => { onSignChangeContractOwner(); });
  }, [onSignChangeContractOwner, setBuiltFinalActionHandler, setIsFinalStepButtonActive]);

  return (
    <div className="card">
      <div className="card-body p-spacer ">
        <p className="h3 text-center" data-testid="delegateTitle">
          {t('Multisig Deployment') as string}
        </p>
        <Box>
          New Contract Address:
          ${pendingDeploymentContractData?.multisigAddress}
        </Box>
        ``
        <div className="modal-control-container">
          <label htmlFor={newOwnerAddress}>
            {t('Address') as string}
            :
          </label>
          <input
            id={newOwnerAddress}
            type="text"
            className="form-control"
            value={newOwnerAddress}
            autoComplete="off"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

      </div>
    </div>
  );
};

export default DeployMultisigStepTwo;
