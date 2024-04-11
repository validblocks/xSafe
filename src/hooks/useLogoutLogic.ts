import { TokenTransfer } from '@multiversx/sdk-core/out';
import { logout } from '@multiversx/sdk-dapp/utils';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  setMultisigBalance,
  setTokenTableRows,
  setOrganizationTokens,
} from 'src/redux/slices/accountGeneralInfoSlice';
import { setProposeModalSelectedOption } from 'src/redux/slices/modalsSlice';
import { setCurrentMultisigContract } from 'src/redux/slices/multisigContractsSlice';

export interface BrowserCleanupConfig {
  withClearCookie?: boolean;
  withClearLocalStorage?: boolean;
  withClearSessionStorage?: boolean;
}

export interface UseLayoutLogicConfig {
  afterLogoutCallback?: CallableFunction;
  withBrowserCleanup?: boolean | BrowserCleanupConfig | CallableFunction;
  withReduxCleanup?: boolean;
}

const DEFAULT_CONFIG: UseLayoutLogicConfig = {
  withBrowserCleanup: true,
  withReduxCleanup: true,
};

export const useLogoutLogic = ({
  afterLogoutCallback,
  withBrowserCleanup = true,
  withReduxCleanup = true,
}: UseLayoutLogicConfig = DEFAULT_CONFIG) => {
  const dispatch = useDispatch();

  const clearBrowser = useCallback(() => {
    document.cookie = '';
    localStorage.clear();
    sessionStorage.clear();
  }, []);

  const logoutWithCleanup = useCallback(async () => {
    if (withBrowserCleanup) {
      clearBrowser();
      console.log('Deleted Browser info.');
    }

    if (withReduxCleanup) {
      dispatch(setCurrentMultisigContract(''));
      dispatch(setProposeModalSelectedOption(null));
      dispatch(
        setMultisigBalance(
          JSON.stringify(TokenTransfer.egldFromAmount('0').amount.toString()),
        ),
      );
      dispatch(setTokenTableRows([]));
      dispatch(setOrganizationTokens([]));
      dispatch(setCurrentMultisigContract(''));
      console.log('Deleted Redux info.');
    }

    logout(`${window.location.origin}/multisig`);

    afterLogoutCallback?.();
  }, [
    clearBrowser,
    dispatch,
    afterLogoutCallback,
    withBrowserCleanup,
    withReduxCleanup,
  ]);

  return {
    logoutWithCleanup,
  };
};
