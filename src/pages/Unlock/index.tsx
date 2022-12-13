import { useEffect, useState } from 'react';
import { ReactComponent as IconMaiar } from 'src/assets/img/maiar-app.svg';
import { ReactComponent as IconMaiarWallet } from 'src/assets/img/maiar-defi-wallet.svg';
import { network } from 'src/config';
import { accessTokenServices, maiarIdApi } from 'src/services/accessTokenServices';
import routeNames from 'src/routes/routeNames';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { useSelector } from 'react-redux';
import {
  StyledIconElrond,
  StyledIconLedger,
  Text,
  UnlockText,
} from 'src/components/StyledComponents/StyledComponents';
import {
  ExtensionLoginButton,
  LedgerLoginButton,
  WalletConnectLoginButton,
  WebWalletLoginButton,
} from '@elrondnetwork/dapp-core/UI';

declare global {
  interface Window {
    elrondWallet: { extensionId: string };
  }
}

const Unlock = () => {
  const [token, setToken] = useState('');
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
                <UnlockText>Maiar DeFi Wallet</UnlockText>
              </div>
            </div>
          </a>
        )}

        {window.elrondWallet && (
          <ExtensionLoginButton {...loginParams}>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex flex-row method">
                <IconMaiarWallet />
                <UnlockText>Maiar DeFi Wallet</UnlockText>
              </div>
            </div>
          </ExtensionLoginButton>
        )}

        <WalletConnectLoginButton {...loginParams}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex flex-row method">
              <IconMaiar />
              <UnlockText>Maiar App</UnlockText>
            </div>
          </div>
        </WalletConnectLoginButton>

        <LedgerLoginButton loginButtonText="" {...loginParams}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex flex-row method">
              <StyledIconLedger />
              <UnlockText>Ledger</UnlockText>
            </div>
          </div>
        </LedgerLoginButton>

        <WebWalletLoginButton {...loginParams}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex flex-row method">
              <StyledIconElrond />
              <UnlockText>Elrond Web Wallet</UnlockText>
            </div>
          </div>
        </WebWalletLoginButton>
      </div>

      <div className="mt-3">
        <Text><span>New to MultiversX?</span></Text>
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
