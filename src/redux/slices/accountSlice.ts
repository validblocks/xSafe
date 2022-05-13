import { Balance as BalanceType } from '@elrondnetwork/erdjs';
import { Balance } from '@elrondnetwork/erdjs/out';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TokenTableRowItem } from 'pages/Organization/types';
import { logoutAction } from '../commonActions';

export interface StateType {
  address: string;
  nonce: number;
  balance: string;
  rootHash: string;
  txCount: number;
  username: string;
  shard: number;
  organizationTokens: TokenTableRowItem[];
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
  organizationTokens: [],
  multisigBalance: Balance.Zero() as BalanceType
};

export const accountSlice = createSlice({
  name: 'accountSlice',
  initialState,
  reducers: {
    setAccountData(state: StateType, action: PayloadAction<StateType>) {
      return action.payload;
    },
    setOrganizationTokens(
      state: StateType,
      action: PayloadAction<TokenTableRowItem[]>
    ) {
      return {
        ...state,
        organizationTokens: action.payload
      };
    },
    setMultisigBalance(state: StateType, action: PayloadAction<string>) {
      return {
        ...state,
        multisigBalance: action.payload
      };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(logoutAction, () => {
      return initialState;
    });
  }
});

export const { setAccountData, setOrganizationTokens, setMultisigBalance } =
  accountSlice.actions;

export default accountSlice.reducer;
