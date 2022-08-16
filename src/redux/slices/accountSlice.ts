import { Balance as BalanceType, Balance } from '@elrondnetwork/erdjs';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  OrganizationToken,
  TokenTableRowItem,
} from 'src/pages/Organization/types';
import { IdentityWithColumns } from 'src/types/staking';
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
  activeDelegationsRows: IdentityWithColumns[];
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
  activeDelegationsRows: [],
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
    setActiveDelegationRows(
      state: StateType,
      action: PayloadAction<IdentityWithColumns[]>,
    ) {
      return {
        ...state,
        activeDelegationsRows: action.payload,
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
  setActiveDelegationRows,
} = accountSlice.actions;

export default accountSlice.reducer;
