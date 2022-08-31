import { OrganizationToken } from 'src/pages/Organization/types';
import { createDeepEqualSelector } from './helpers';
import { RootState } from '../store';
import { StateType } from '../slices/accountSlice';

export const accountSelector = (state: RootState) => state.account;

const DEFAULT_ORGANIZATION_TOKEN = {
  prettyIdentifier: 'ID',
  tokenPrice: '0',
  tokenValue: '0',
  tokenAmount: '0',
};

export const usernameSelector = createDeepEqualSelector(
  accountSelector,
  (state) => state.username,
);

export const tokenTableRowsSelector = createDeepEqualSelector(
  accountSelector,
  (state) => state.tokenTableRows,
);

export const totalUsdValueSelector = createDeepEqualSelector(
  accountSelector,
  (state) => state.totalUsdValue,
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
    (token: OrganizationToken) =>
      token.identifier === tokenIdentifier ||
      token.prettyIdentifier === tokenIdentifier,
  )?.photoUrl;

export const getTokenPhotoById = (
  state: RootState,
  tokenIdentifier: string,
) => {
  console.log(
    '!!! WARNING: watchout for comparison here and in getTokenPhotoUrlById',
  );
  const res =
    state.organizationTokens?.find(
      (token: OrganizationToken) =>
        token.identifier === tokenIdentifier ||
        token.prettyIdentifier === tokenIdentifier,
    ) ?? DEFAULT_ORGANIZATION_TOKEN;

  return res;
};

export const organizationTokenByIdentifierSelector = (identifier: string) =>
  createDeepEqualSelector(accountSelector, (state: StateType) =>
    getTokenPhotoById(state, identifier),
  );

export const multisigBalanceSelector = createDeepEqualSelector(
  accountSelector,
  (state) => JSON.parse(state.multisigBalance),
);

export const activeDelegationsRowsSelector = createDeepEqualSelector(
  accountSelector,
  (state) => state.activeDelegationsRows,
);

export const isInReadOnlyModeSelector = createDeepEqualSelector(
  accountSelector,
  (state) => state.isInReadOnlyMode,
);
