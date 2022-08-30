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
  isMultiWalletMode: boolean;
  isInReadOnlyMode: boolean;
  multisigBalance: any;
  totalUsdValue: number;
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
  isMultiWalletMode: false,
  isInReadOnlyMode: true,
  totalUsdValue: 0,
};

export const accountSlice = createSlice({
  name: 'accountSlice',
  initialState,
  reducers: {
    setAccountData(state: StateType, action: PayloadAction<StateType>) {
      return action.payload;
    },
    setTotalUsdBalance(state: StateType, action: PayloadAction<number>) {
      return {
        ...state,
        totalUsdValue: action.payload,
      };
    },
    setIsMultiWalletMode(state: StateType, action: PayloadAction<boolean>) {
      return {
        ...state,
        isMultiWalletMode: action.payload,
      };
    },
    setIsInReadOnlyMode(state: StateType, action: PayloadAction<boolean>) {
      return {
        ...state,
        isInReadOnlyMode: action.payload,
      };
    },
    setTokenTableRows(
      state: StateType,
      action: PayloadAction<TokenTableRowItem[]>,
    ) {
      console.log('state before set ', state);
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
  setTotalUsdBalance,
  setTokenTableRows,
  setMultisigBalance,
  setIsInReadOnlyMode,
  setIsMultiWalletMode,
  setOrganizationTokens,
  setActiveDelegationRows,
} = accountSlice.actions;

export default accountSlice.reducer;
