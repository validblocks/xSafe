import { Balance as BalanceType, Balance } from '@elrondnetwork/erdjs';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  OrganizationToken,
  TokenTableRowItem,
} from 'src/pages/Organization/types';
import { logoutAction } from '../commonActions';

export interface StateType {
  address: string;
  nonce: number;
  balance: string;
  rootHash: string;
  txCount: number;
  username: string;
  shard: number;
  tokenTableRows: TokenTableRowItem[];
  organizationTokens: OrganizationToken[];
  multisigBalance: any;
}

const initialState: StateType = {
  address: '',
  nonce: 0,
  balance: '',
  rootHash: '',
  txCount: 0,
  username: '',
  shard: 0,
  tokenTableRows: [],
  organizationTokens: [],
  multisigBalance: Balance.Zero() as BalanceType,
};

export const accountSlice = createSlice({
  name: 'accountSlice',
  initialState,
  reducers: {
    setAccountData(state: StateType, action: PayloadAction<StateType>) {
      return action.payload;
    },
    setTokenTableRows(
      state: StateType,
      action: PayloadAction<TokenTableRowItem[]>,
    ) {
      return {
        ...state,
        tokenTableRows: action.payload,
      };
    },
    setOrganizationTokens(
      state: StateType,
      action: PayloadAction<OrganizationToken[]>,
    ) {
      return {
        ...state,
        organizationTokens: action.payload,
      };
    },
    setMultisigBalance(state: StateType, action: PayloadAction<string>) {
      return {
        ...state,
        multisigBalance: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutAction, () => initialState);
  },
});

export const {
  setAccountData,
  setTokenTableRows,
  setMultisigBalance,
  setOrganizationTokens,
} = accountSlice.actions;

export default accountSlice.reducer;
