import { OrganizationToken } from 'src/types/organization';
import { createDeepEqualSelector } from './helpers';
import { RootState } from '../store';

export const accountSelector = (state: RootState) => state.accountGeneralInfo;

const DEFAULT_ORGANIZATION_TOKEN = {
  prettyIdentifier: 'EGLD',
  tokenPrice: '0',
  tokenValue: '0',
  balanceLocaleString: '0',
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

export const safeTokensSelector = createDeepEqualSelector(
  accountSelector,
  (state) => state.safeTokens,
);

export const getTokenPhotoUrlById = (
  state: ReturnType<typeof accountSelector>,
  tokenIdentifier: string,
) =>
  state.safeTokens?.find(
    (token: OrganizationToken) =>
      token.identifier === tokenIdentifier ||
      token.prettyIdentifier === tokenIdentifier,
  )?.photoUrl;

export const getTokenPhotoById = (
  state: ReturnType<typeof accountSelector>,
  tokenIdentifier: string,
) => {
  console.log(
    '!!! WARNING: watchout for comparison here and in getTokenPhotoUrlById',
  );
  const res =
    state.safeTokens?.find(
      (token: OrganizationToken) =>
        token.identifier === tokenIdentifier ||
        token.prettyIdentifier === tokenIdentifier,
    ) ?? DEFAULT_ORGANIZATION_TOKEN;

  return res;
};

export const organizationTokenByIdentifierSelector = (identifier: string) =>
  createDeepEqualSelector(
    accountSelector,
    (state: ReturnType<typeof accountSelector>) =>
      getTokenPhotoById(state, identifier),
  );

export const activeDelegationsRowsSelector = createDeepEqualSelector(
  accountSelector,
  (state) => state.activeDelegationsRows,
);

export const isInReadOnlyModeSelector = createDeepEqualSelector(
  accountSelector,
  (state) => state.isInReadOnlyMode,
);
