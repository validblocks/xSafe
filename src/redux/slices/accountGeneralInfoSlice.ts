import { createSlice, PayloadAction, Draft } from '@reduxjs/toolkit';
import { OrganizationToken, TokenTableRowItem } from 'src/types/organization';
import { IdentityWithColumns } from 'src/types/staking';
import { logoutAction } from '../commonActions';
import BigNumber from 'bignumber.js';

export interface AccountGeneralInfoSlice {
  address: string;
  nonce: number;
  balance: BigNumber;
  rootHash: string;
  txCount: number;
  username: string;
  shard: number;
  tokenTableRows: TokenTableRowItem[];
  safeTokens: OrganizationToken[];
  activeDelegationsRows: IdentityWithColumns[];
  isInReadOnlyMode: boolean;
  totalUsdValue: BigNumber;
}

const initialState: AccountGeneralInfoSlice = {
  shard: 0,
  nonce: 0,
  txCount: 0,
  address: '',
  rootHash: '',
  username: '',
  isInReadOnlyMode: true,
  tokenTableRows: [],
  safeTokens: [],
  activeDelegationsRows: [],
  balance: new BigNumber(0),
  totalUsdValue: new BigNumber(0),
};

export const accountGeneralInfoSlice = createSlice({
  name: 'accountGeneralInfoSlice',
  initialState,
  reducers: {
    setAccountData(
      state: Draft<AccountGeneralInfoSlice>,
      action: PayloadAction<AccountGeneralInfoSlice>,
    ) {
      return {
        ...state,
        ...action.payload,
      };
    },
    setTotalUsdBalance(
      state: Draft<AccountGeneralInfoSlice>,
      action: PayloadAction<number>,
    ) {
      state.totalUsdValue = new BigNumber(action.payload);
    },
    setTokenTableRows(
      state: Draft<AccountGeneralInfoSlice>,
      action: PayloadAction<TokenTableRowItem[]>,
    ) {
      state.tokenTableRows = action.payload;
    },
    setOrganizationTokens(
      state: Draft<AccountGeneralInfoSlice>,
      action: PayloadAction<OrganizationToken[]>,
    ) {
      state.safeTokens = action.payload;
    },
    setActiveDelegationRows(
      state: Draft<AccountGeneralInfoSlice>,
      action: PayloadAction<IdentityWithColumns[]>,
    ) {
      state.activeDelegationsRows = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutAction, () => initialState);
  },
});

export const {
  setAccountData,
  setTotalUsdBalance,
  setTokenTableRows,
  setOrganizationTokens,
  setActiveDelegationRows,
} = accountGeneralInfoSlice.actions;

export default accountGeneralInfoSlice.reducer;
