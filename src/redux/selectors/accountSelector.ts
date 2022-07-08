import {
  OrganizationToken,
  TokenTableRowItem,
} from 'src/pages/Organization/types';
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

export const organizationTokenPhotoUrlSelector = createDeepEqualSelector(
  accountSelector,
  (state) => (tokenIdentifier: string) =>
    state.tokenTableRows?.find(
      (token: TokenTableRowItem) => token.identifier === tokenIdentifier,
    )?.balanceDetails.photoUrl,
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
