import { RootState } from '../store';
import { createDeepEqualSelector } from './helpers';

const accountSelector = (state: RootState) => state.account;

export const usernameSelector = createDeepEqualSelector(
  accountSelector,
  (state) => state.username
);

export const organizationTokensSelector = createDeepEqualSelector(
  accountSelector,
  (state) => state.organizationTokens
);

export const multisigBalanceSelector = createDeepEqualSelector(
  accountSelector,
  (state) => {
    console.log('balance: ', state.multisigBalance);
    return JSON.parse(state.multisigBalance);
  }
);
