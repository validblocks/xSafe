import IconMaiar from 'src/assets/img/maiar-app.svg';
import IconMaiarWallet from 'src/assets/img/maiar-defi-wallet.svg';
import { network, walletConnectV2ProjectId } from 'src/config';
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
} from '@multiversx/sdk-dapp/UI';
import * as Styled from './styled';

declare global {
  interface Window {
    elrondWallet: { extensionId: string };
  }
}

const Unlock = () => {
  const currentContract = useSelector(currentMultisigContractSelector);

  const commonProps = {
    nativeAuth: true,
    callbackRoute: currentContract?.address
      ? `${routeNames.multisig}/${currentContract?.address}`
      : `${routeNames.multisig}`,
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
            className="btn btn-unlock btn-block w-100"
          >
            <div className="d-flex justify-content-between align-items-center method">
              <img src={IconMaiarWallet} />
              <UnlockText>MultiversX DeFi Wallet</UnlockText>
              <Styled.ArrowToRight />
            </div>
          </a>
        )}

        {window.elrondWallet && (
          <ExtensionLoginButton {...commonProps}>
            <div className="d-flex justify-content-between align-items-center method">
              <img src={IconMaiarWallet} />
              <UnlockText>MultiversX DeFi Wallet</UnlockText>
              <Styled.ArrowToRight />
            </div>
          </ExtensionLoginButton>
        )}

        <WalletConnectLoginButton
          {...commonProps}
          {...(walletConnectV2ProjectId
            ? {
              isWalletConnectV2: true,
            }
            : {})}
        >
          <div className="d-flex justify-content-between align-items-center method">
            <img src={IconMaiar} />
            <UnlockText>xPortal Mobile Wallet</UnlockText>
            <Styled.ArrowToRight />
          </div>
        </WalletConnectLoginButton>

        <LedgerLoginButton loginButtonText="" {...commonProps}>
          <div className="d-flex justify-content-between align-items-center method">
            <StyledIconLedger />
            <UnlockText>Ledger</UnlockText>
            <Styled.ArrowToRight />
          </div>
        </LedgerLoginButton>

        <WebWalletLoginButton {...commonProps}>
          <div className="d-flex justify-content-between align-items-center method">
            <StyledIconElrond />
            <UnlockText>MultiversX Web Wallet</UnlockText>
            <Styled.ArrowToRight />
          </div>
        </WebWalletLoginButton>
      </div>

      <div className="mt-3">
        <Text><span>New to MultiversX?</span></Text>
      </div>
      <div className="mt-1 mb-1">
        <Styled.MultisigLink
          href={`${network.walletAddress}/create`}
          {...{ target: '_blank' }}
        >
          Learn how to setup a wallet
        </Styled.MultisigLink>
      </div>
    </div>
  );
};

export default Unlock;
