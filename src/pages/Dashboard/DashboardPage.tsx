/* eslint-disable react/no-unstable-nested-components */
import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { uniqueContractAddress } from 'src/multisigConfig';
import NewDashboard from 'src/pages/NewDashboard';
import {
  multisigContractsSelector,
} from 'src/redux/selectors/multisigContractsSelectors';
import { setMultisigContracts } from 'src/redux/slices/multisigContractsSlice';
import { storageApi } from 'src/services/accessTokenServices';
import { MultisigContractInfoType } from 'src/types/multisigContracts';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getIsProviderEqualTo } from '@elrondnetwork/dapp-core';
import { providerTypes } from 'src/helpers/constants';
import { faArrowRight, faPlus, faWallet } from '@fortawesome/free-solid-svg-icons';
import CreateWallet from 'src/assets/img/create-wallet.svg';
import OpenWallet from 'src/assets/img/open-wallet.svg';
import { ElrondApiProvider } from 'src/services/ElrondApiNetworkProvider';
import wawe from 'src/assets/img/wawe.svg';
import AddMultisigModal from './AddMultisigModal';
import DeployStepsModal from './DeployMultisigModal';
import MultisigListItem from './MultisigListItem';

function Dashboard() {
  // const multisigContractsFetched = useSelector(
  //   multisigContractsFetchedSelector,
  // );
  const dispatch = useDispatch();
  const { t }: { t: any } = useTranslation();
  const [showAddMultisigModal, setShowAddMultisigModal] = useState(false);
  const [showDeployMultisigModal, setShowDeployMultisigModal] = useState(false);
  const [invalidMultisigContract, setInvalidMultisigContract] = useState(false);
  const isWalletProvider = getIsProviderEqualTo(providerTypes.wallet);
  const multisigContracts = useSelector(multisigContractsSelector);

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

  async function onDeployClicked() {
    setShowDeployMultisigModal(true);
  }

  function onAddMultisigClicked() {
    setShowAddMultisigModal(true);
  }

  const deployButton = (
    <button
      disabled={isWalletProvider}
      onClick={onDeployClicked}
      className="shadow-sm"
      style={{ pointerEvents: isWalletProvider ? 'none' : 'auto' }}
    >
      <figure>
        <img src={CreateWallet} alt="create-wallet-icon" />
      </figure>
      <p className="action">
        {t('Create wallet')}
        <FontAwesomeIcon icon={faArrowRight} />
      </p>
      <p className="info-text">Create an organization</p>
    </button>
  );

  const deployButtonContainer = isWalletProvider ? (
    <OverlayTrigger
      placement="top"
      delay={{ show: 250, hide: 400 }}
      overlay={(props) => (
        <Tooltip id="deploy-button-tooltip" {...props}>
          {t('Please use another login method to deploy a contract')}
        </Tooltip>
      )}
    >
      <span className="d-inline-block">{deployButton}</span>
    </OverlayTrigger>
  ) : (
    deployButton
  );

  const deployButtonSecondary = (
    <button
      className="btn btn-light d-flex flex-row align-items-center"
      onClick={onDeployClicked}
      disabled={isWalletProvider}
    >
      <FontAwesomeIcon icon={faPlus} size="lg" />
      <div className="navbar-address  d-lg-block">Create</div>
    </button>
  );

  const deployButtonSecondaryContainer = isWalletProvider ? (
    <OverlayTrigger
      placement="top"
      delay={{ show: 250, hide: 400 }}
      overlay={(props) => (
        <Tooltip id="deploy-button-tooltip" {...props}>
          {t('Please use another login method to deploy a contract')}
        </Tooltip>
      )}
    >
      <span className="d-inline-block">{deployButtonSecondary}</span>
    </OverlayTrigger>
  ) : (
    deployButtonSecondary
  );

  useEffect(() => {
    checkSingleContractValidity();
  }, []);

  async function updateMultisigContract(
    newContracts: MultisigContractInfoType[],
  ) {
    dispatch(setMultisigContracts(newContracts));
  }

  console.log('rendering dashboardPage');

  // if (!multisigContractsFetched) {
  //   console.log('multisigContracts not fetched');
  //   return null;
  // }

  if (invalidMultisigContract) {
    return (
      <>
        <div className="my-wallets">
          <div className="welcome text-center">
            <h2>
              Welcome to Multisig
              <span>
                <img src={wawe} alt="wawe-icon" width="36" height="36" />
              </span>
            </h2>
            <p>Create your own organization in a few minutes</p>
          </div>
          {multisigContracts.length === 0 ? (
            <div className="c-o-wallet-card">
              <div className="d-flex wallet-spacer">
                {deployButtonContainer}

                <button onClick={onAddMultisigClicked} className="shadow-sm">
                  <figure>
                    <img src={OpenWallet} alt="create-wallet-icon" />
                  </figure>
                  <p className="action">
                    {t('Open wallet')}
                    <FontAwesomeIcon icon={faArrowRight} />
                  </p>
                  <p className="info-text">
                    Search and explore existing organizations
                  </p>
                </button>
              </div>
            </div>
          ) : (
            <div className="wallets-section shadow bg-white">
              <div className="top-bar">
                <h3 className="title">
                  {uniqueContractAddress ? 'My wallet' : 'My wallets'}
                </h3>
                {!uniqueContractAddress && (
                <div className="create-btns d-flex">
                  {deployButtonSecondaryContainer}
                  <button
                    className="btn address-btn btn-light d-flex flex-row align-items-center"
                    onClick={onAddMultisigClicked}
                  >
                    <FontAwesomeIcon icon={faWallet} size="lg" />
                    <div className="navbar-address ml-2 d-lg-block">Open</div>
                  </button>
                </div>
                )}
              </div>
              <div className="list-wallets">
                {multisigContracts.map((contract: MultisigContractInfoType) => (
                  <MultisigListItem
                    key={contract.address}
                    contract={contract}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
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
      </>
    );
  }

  return (
    <div className="owner w-100 d-flex justify-content-center align-items-center flex-column">

      <NewDashboard />

      <p className="info-msg">
        New to Multisig?&nbsp;&nbsp;&nbsp;&nbsp;
        <Button variant="text">Learn more</Button>
      </p>
    </div>
  );
}

export default Dashboard;
