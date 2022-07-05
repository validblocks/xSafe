import { createDeepEqualSelector } from './helpers';
import { RootState } from '../store';

const accountSelector = (state: RootState) => state.account;

export const usernameSelector = createDeepEqualSelector(
  accountSelector,
  (state) => state.username,
);

export const organizationTokensSelector = createDeepEqualSelector(
  accountSelector,
  (state) => state.organizationTokens,
);

export const multisigBalanceSelector = createDeepEqualSelector(
  accountSelector,
  (state) => JSON.parse(state.multisigBalance),
);
