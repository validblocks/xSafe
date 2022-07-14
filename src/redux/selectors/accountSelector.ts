import { OrganizationToken } from 'src/pages/Organization/types';
import { createDeepEqualSelector } from './helpers';
import { RootState } from '../store';

const accountSelector = (state: RootState) => state.account;

export const usernameSelector = createDeepEqualSelector(
  accountSelector,
  (state) => state.username,
);

export const tokenTableRowsSelector = createDeepEqualSelector(
  accountSelector,
  (state) => state.tokenTableRows,
);

export const organizationTokensSelector = createDeepEqualSelector(
  accountSelector,
  (state) => state.organizationTokens,
);

export const organizationTokenPhotoUrlSelector = createDeepEqualSelector(
  accountSelector,
  (state) => (tokenIdentifier: string) =>
    state.organizationTokens?.find(
      (token: OrganizationToken) => token.prettyIdentifier === tokenIdentifier,
    )?.photoUrl,
);

export const organizationTokenByIdentifierSelector = createDeepEqualSelector(
  accountSelector,
  (state) => (tokenIdentifier: string) =>
    state.organizationTokens?.find(
      (token: OrganizationToken) => token.identifier === tokenIdentifier,
    ),
);

export const multisigBalanceSelector = createDeepEqualSelector(
  accountSelector,
  (state) => JSON.parse(state.multisigBalance),
);
