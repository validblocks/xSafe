import { useEffect, useState } from 'react';
import { DappUI } from '@elrondnetwork/dapp-core';
import { ReactComponent as IconElrond } from 'src/assets/img/elrond-web-wallet.svg';
import { ReactComponent as IconLedger } from 'src/assets/img/ledger.svg';
import { ReactComponent as IconMaiar } from 'src/assets/img/maiar-app.svg';
import { ReactComponent as IconMaiarWallet } from 'src/assets/img/maiar-defi-wallet.svg';
import { network } from 'src/config';
import routeNames from 'src/routes/routeNames';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { useSelector } from 'react-redux';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import * as DappCoreInternal from '@elrondnetwork/dapp-core-internal';

declare global {
  interface Window {
    elrondWallet: { extensionId: string };
  }
}

const Unlock = () => {
  const [token, setToken] = useState('');
  const currentContract = useSelector(currentMultisigContractSelector);

  useEffect(() => {
    DappCoreInternal.services?.maiarId
      ?.init({ maiarIdApi: `/proxy?route=${(network as any).maiarIdApi}` })
      .then((loginToken: string) => {
        setToken(loginToken);
      })
      .catch((err: any) => {
        console.log({ err });
      });
  }, []);

  const loginParams = {
    callbackRoute: currentContract?.address
      ? `${routeNames.multisig}/${currentContract?.address}`
      : `${routeNames.multisig}`,
    token,
    logoutRoute: `${routeNames.multisig}`,
    buttonClassName: 'btn btn-unlock btn-block',
  };

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
                <Text className="title" marginBottom={'0 !important'} fontWeight={600}>Maiar DeFi Wallet</Text>
              </div>
            </div>
          </DappUI.ExtensionLoginButton>
        )}

        <DappUI.WalletConnectLoginButton {...loginParams}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex flex-row method">
              <IconMaiar />
              <Text className="title" marginBottom={'0 !important'} fontWeight={600}>Maiar App</Text>
            </div>
          </div>
        </DappUI.WalletConnectLoginButton>

        <DappUI.LedgerLoginButton loginButtonText="" {...loginParams}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex flex-row method">
              <IconLedger />
              <Text className="title" marginBottom={'0 !important'} fontWeight={600}>Ledger</Text>
            </div>
          </div>
        </DappUI.LedgerLoginButton>

        <DappUI.WebWalletLoginButton {...loginParams}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex flex-row method">
              <IconElrond />
              <Text className="title" marginBottom={'0 !important'} fontWeight={600}>Elrond Web Wallet</Text>
            </div>
          </div>
        </DappUI.WebWalletLoginButton>
      </div>

      <hr />

      <div className="mt-3">
        <Text><span>New to Elrond?</span></Text>
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
