import { createSlice, PayloadAction, Draft } from '@reduxjs/toolkit';
import { OrganizationToken, TokenTableRowItem } from 'src/types/organization';
import { IdentityWithColumns } from 'src/types/staking';
import { logoutAction } from '../commonActions';
import BigNumber from 'bignumber.js';

export interface StateType {
  address: string;
  nonce: number;
  balance: BigNumber;
  rootHash: string;
  txCount: number;
  username: string;
  shard: number;
  tokenTableRows: TokenTableRowItem[];
  organizationTokens: OrganizationToken[];
  activeDelegationsRows: IdentityWithColumns[];
  isMultiWalletMode: boolean;
  isInReadOnlyMode: boolean;
  totalUsdValue: BigNumber;
}

const initialState: StateType = {
  shard: 0,
  nonce: 0,
  txCount: 0,
  address: '',
  rootHash: '',
  username: '',
  isInReadOnlyMode: true,
  isMultiWalletMode: false,
  tokenTableRows: [],
  organizationTokens: [],
  activeDelegationsRows: [],
  balance: new BigNumber(0),
  totalUsdValue: new BigNumber(0),
};

export const accountGeneralInfoSlice = createSlice({
  name: 'accountGeneralInfoSlice',
  initialState,
  reducers: {
    setAccountData(state: Draft<StateType>, action: PayloadAction<StateType>) {
      return {
        ...state,
        ...action.payload,
      };
    },
    setTotalUsdBalance(state: Draft<StateType>, action: PayloadAction<number>) {
      state.totalUsdValue = new BigNumber(action.payload);
    },
    setTokenTableRows(
      state: Draft<StateType>,
      action: PayloadAction<TokenTableRowItem[]>,
    ) {
      state.tokenTableRows = action.payload;
    },
    setOrganizationTokens(
      state: Draft<StateType>,
      action: PayloadAction<OrganizationToken[]>,
    ) {
      state.organizationTokens = action.payload;
    },
    setActiveDelegationRows(
      state: Draft<StateType>,
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
