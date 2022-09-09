import { useEffect, useState } from 'react';
import { DappUI, useGetLoginInfo } from '@elrondnetwork/dapp-core';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Navigate, useNavigate } from 'react-router-dom';
import { ReactComponent as IconElrond } from 'src/assets/img/elrond-web-wallet.svg';
import { ReactComponent as IconLedger } from 'src/assets/img/ledger.svg';
import { ReactComponent as IconMaiar } from 'src/assets/img/maiar-app.svg';
import { ReactComponent as IconMaiarWallet } from 'src/assets/img/maiar-defi-wallet.svg';
import { network } from 'src/config';
import { accessTokenServices, maiarIdApi } from 'src/services/accessTokenServices';
import routeNames from 'src/routes/routeNames';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { useSelector } from 'react-redux';
import { useOrganizationInfoContext } from '../Organization/OrganizationInfoContextProvider';

declare global {
  interface Window {
    elrondWallet: { extensionId: string };
  }
}

const Unlock = () => {
  const [token, setToken] = useState('');
  const { loginMethod, isLoggedIn } = useGetLoginInfo();
  const currentContract = useSelector(currentMultisigContractSelector);

  useEffect(() => {
    accessTokenServices?.services?.maiarId
      ?.init({ maiarIdApi: `/proxy?route=${maiarIdApi}` })
      .then((loginToken: string) => {
        setToken(loginToken);
      });
  }, []);

  const loginParams = {
    callbackRoute: currentContract?.address
      ? `${routeNames.multisig}/${currentContract?.address}`
      : `${routeNames.multisig}`,
    token,
    logoutRoute: `${routeNames.multisig}/${currentContract?.address}`,
    buttonClassName: 'btn btn-unlock btn-block',
  };

  const navigate = useNavigate();
  const { isMultiWalletMode } = useOrganizationInfoContext();

  useEffect(() => {
    if (isLoggedIn) {
      if (!isMultiWalletMode) { navigate(`${routeNames.multisig}/${currentContract?.address}`); }
    }
  }, [currentContract?.address, isLoggedIn, isMultiWalletMode, navigate]);

  if (loginMethod !== '') {
    return (
      <Navigate to={`${routeNames.multisig}/${currentContract?.address}`} />
    );
  }

  return (
    <div className="unlock-block">
      <div className="unlock text-center">
        {!window.elrondWallet && (
          <a
            rel="noreferrer"
            href="https://chrome.google.com/webstore/detail/dngmlblcodfobpdpecaadgfbcggfjfnm?authuser=0&hl=en"
            target="_blank"
            className="btn btn-unlock btn-block"
          >
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex flex-row method">
                <IconMaiarWallet />
                <div className="title">Maiar DeFi Wallet</div>
              </div>
            </div>
          </a>
        )}

        {window.elrondWallet && (
          <DappUI.ExtensionLoginButton {...loginParams}>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex flex-row method">
                <IconMaiarWallet />
                <div className="title">Maiar DeFi Wallet</div>
              </div>

              <FontAwesomeIcon icon={faArrowRight} className="arrow" />
            </div>
          </DappUI.ExtensionLoginButton>
        )}

        <DappUI.WalletConnectLoginButton {...loginParams}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex flex-row method">
              <IconMaiar />
              <div className="title">Maiar App</div>
            </div>
          </div>
        </DappUI.WalletConnectLoginButton>

        <DappUI.LedgerLoginButton loginButtonText="" {...loginParams}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex flex-row method">
              <IconLedger />
              <div className="title">Ledger</div>
            </div>
          </div>
        </DappUI.LedgerLoginButton>

        <DappUI.WebWalletLoginButton {...loginParams}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex flex-row method">
              <IconElrond />
              <div className="title">Elrond Web Wallet</div>
            </div>
          </div>
        </DappUI.WebWalletLoginButton>
      </div>

      <hr />

      <div className="mt-3">
        <span>New to Elrond?</span>
      </div>
      <div className="mt-1 mb-1">
        <a
          className="link-third-style"
          href={`${network.walletAddress}/create`}
          {...{ target: '_blank' }}
        >
          Learn how to setup a wallet
        </a>
      </div>
    </div>
  );
};

export default Unlock;
