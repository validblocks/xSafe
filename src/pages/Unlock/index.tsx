import React, { useEffect, useState } from 'react';
import { DappUI, useGetLoginInfo } from '@elrondnetwork/dapp-core';
import { faArrowRight, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { style } from '@mui/system';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { ReactComponent as IconElrond } from 'assets/img/elrond-web-wallet.svg';
import { ReactComponent as IconLedger } from 'assets/img/ledger.svg';
import { ReactComponent as IconMaiar } from 'assets/img/maiar-app.svg';
import { ReactComponent as IconMaiarWallet } from 'assets/img/maiar-defi-wallet.svg';
import { network } from 'config';
import { routeNames } from 'routes';
import { accessTokenServices, maiarIdApi } from 'services/accessTokenServices';

declare global {
  interface Window {
    elrondWallet: { extensionId: string };
  }
}

// const UnlockTitle = () => (
//   <h5 className='unlock-title mb-spacer'>
//     <OverlayTrigger
//       placement='top'
//       delay={{ show: 250, hide: 400 }}
//       overlay={(props) => (
//         <Tooltip id='connect-to-wallet-tooltip' {...props}>
//           Connect securely using one of the provided options
//         </Tooltip>
//       )}
//     >
//       <a
//         href='/#'
//         onClick={(e) => {
//           e.preventDefault();
//         }}
//         data-testid='infoConnect'
//       >
//         <FontAwesomeIcon
//           icon={faInfoCircle}
//           className='i-icon text-secondary'
//         />
//       </a>
//     </OverlayTrigger>
//   </h5>
// );

const Unlock = () => {
  const [token, setToken] = useState('');
  const { loginMethod } = useGetLoginInfo();

  useEffect(() => {
    accessTokenServices?.services?.maiarId
      ?.init({ maiarIdApi })
      .then((loginToken: string) => {
        setToken(loginToken);
      });
  }, []);

  const loginParams = {
    callbackRoute: routeNames.dashboard,
    token,
    logoutRoute: routeNames.welcome,
    buttonClassName: 'btn btn-unlock btn-block'
  };

  if (loginMethod != '') {
    return <Navigate to={routeNames.dashboard} />;
  }

  return (
    <div className='unlock-block'>
      <div className='unlock text-center'>
        {!window.elrondWallet && (
          <a
            rel='noreferrer'
            href='https://chrome.google.com/webstore/detail/dngmlblcodfobpdpecaadgfbcggfjfnm?authuser=0&hl=en'
            target='_blank'
            className='btn btn-unlock btn-block'
          >
            <div className='d-flex justify-content-between align-items-center'>
              <div className='d-flex flex-row method'>
                <IconMaiarWallet />
                <div className='title'>Maiar DeFi Wallet</div>
              </div>
            </div>
          </a>
        )}

        {window.elrondWallet && (
          <DappUI.ExtensionLoginButton {...loginParams}>
            <div className='d-flex justify-content-between align-items-center'>
              <div className='d-flex flex-row method'>
                <IconMaiarWallet />
                <div className='title'>Maiar DeFi Wallet</div>
              </div>

              <FontAwesomeIcon icon={faArrowRight} className='arrow' />
            </div>
          </DappUI.ExtensionLoginButton>
        )}

        <DappUI.WalletConnectLoginButton {...loginParams}>
          <div className='d-flex justify-content-between align-items-center'>
            <div className='d-flex flex-row method'>
              <IconMaiar />
              <div className='title'>Maiar App</div>
            </div>
          </div>
        </DappUI.WalletConnectLoginButton>

        <DappUI.LedgerLoginButton loginButtonText={''} {...loginParams}>
          <div className='d-flex justify-content-between align-items-center'>
            <div className='d-flex flex-row method'>
              <IconLedger />
              <div className='title'>Ledger</div>
            </div>
          </div>
        </DappUI.LedgerLoginButton>

        <DappUI.WebWalletLoginButton {...loginParams}>
          <div className='d-flex justify-content-between align-items-center'>
            <div className='d-flex flex-row method'>
              <IconElrond />
              <div className='title'>Elrond Web Wallet</div>
            </div>
          </div>
        </DappUI.WebWalletLoginButton>
      </div>

      <hr />

      <div className='mt-3'>
        <span>New to Elrond?</span>
      </div>
      <div className='mt-1 mb-1'>
        <a
          className='link-third-style'
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
