import { OrganizationToken } from 'src/pages/Organization/types';
import { createDeepEqualSelector } from './helpers';
import { RootState } from '../store';

export const accountSelector = (state: RootState) => state.account;

const DEFAULT_ORGANIZATION_TOKEN = {
  prettyIdentifier: 'Unknown identifier',
  tokenPrice: 'Unknown price',
  tokenValue: 'Unknown value',
  tokenAmount: 'Unknown amount',
};

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

export const getTokenPhotoUrlById = (
  state: RootState,
  tokenIdentifier: string,
) =>
  state.organizationTokens?.find(
    (token: OrganizationToken) => token.identifier === tokenIdentifier,
  )?.photoUrl;

export const getTokenPhotoById = (state: RootState, tokenIdentifier: string) =>
  state.organizationTokens?.find(
    (token: OrganizationToken) => token.identifier === tokenIdentifier,
  ) ?? DEFAULT_ORGANIZATION_TOKEN;

export const organizationTokenByIdentifierSelector = createDeepEqualSelector(
  accountSelector,
  (state) => (tokenIdentifier: string) => {
    const res = state.organizationTokens?.find(
      (token: OrganizationToken) => token.identifier === tokenIdentifier,
    );
    return res ?? DEFAULT_ORGANIZATION_TOKEN;
  },
);

export const multisigBalanceSelector = createDeepEqualSelector(
  accountSelector,
  (state) => JSON.parse(state.multisigBalance),
);
