import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { uniqueContractAddress } from 'src/multisigConfig';
import NewDashboard from 'src/pages/NewDashboard';
import { multisigContractsFetchedSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { setMultisigContracts } from 'src/redux/slices/multisigContractsSlice';
import { storageApi } from 'src/services/accessTokenServices';
import { MultisigContractInfoType } from 'src/types/multisigContracts';
import { ElrondApiProvider } from 'src/services/ElrondApiNetworkProvider';
import AddMultisigModal from './AddMultisigModal';
import DeployStepsModal from './DeployMultisigModal';

function Dashboard() {
  const multisigContractsFetched = useSelector(
    multisigContractsFetchedSelector,
  );
  const dispatch = useDispatch();
  const { t }: { t: any } = useTranslation();
  const [showAddMultisigModal, setShowAddMultisigModal] = useState(false);
  const [showDeployMultisigModal, setShowDeployMultisigModal] = useState(false);
  const [invalidMultisigContract, setInvalidMultisigContract] = useState(false);
  async function checkSingleContractValidity() {
    if (uniqueContractAddress || !storageApi) {
      const isValidMultisigContract = await ElrondApiProvider.validateMultisigAddress(
        uniqueContractAddress,
      );
      if (!isValidMultisigContract) {
        setInvalidMultisigContract(true);
      }
    }
  }

  useEffect(() => {
    checkSingleContractValidity();
  }, []);

  async function updateMultisigContract(
    newContracts: MultisigContractInfoType[],
  ) {
    dispatch(setMultisigContracts(newContracts));
  }

  if (!multisigContractsFetched) {
    return null;
  }
  if (invalidMultisigContract) {
    return (
      <div className="d-flex flex-fill justify-content-center align-items-center flex-column">
        <p className="h2">
          {t(
            'The address you provided does not belong to a valid Multisig contract',
          )}
        </p>
        <p className="h3 mt-5">
          {t(
            'Please check project configuration in multisigConfig and try again',
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="owner w-100 d-flex justify-content-center align-items-center flex-column">
      <NewDashboard />
      <AddMultisigModal
        show={showAddMultisigModal}
        handleClose={() => {
          setShowAddMultisigModal(false);
        }}
        setNewContracts={(newContracts) => updateMultisigContract(newContracts)}
      />
      <DeployStepsModal
        show={showDeployMultisigModal}
        handleClose={() => setShowDeployMultisigModal(false)}
        setNewContracts={(newContracts) => updateMultisigContract(newContracts)}
      />
      <p className="info-msg">
        New to Multisig?&nbsp;&nbsp;&nbsp;&nbsp;
        <Button variant="text">Learn more</Button>
      </p>
    </div>
  );
}

export default Dashboard;
