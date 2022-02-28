import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logoutAction } from '../commonActions';

export interface StateType {
  totalSupply: number;
  circulatingSupply: number;
  staked: number;
  price: number;
  marketCap: number;
  apr: number;
  topUpApr: number;
  baseApr: number;
}

const initialState: StateType = {
  totalSupply: 22488795,
  circulatingSupply: 19828795,
  staked: 12059824,
  price: 223.05,
  marketCap: 4354194414,
  apr: 0.145685,
  topUpApr: 0.110861,
  baseApr: 0.166948
};

export const economicsSlice = createSlice({
  name: 'economicsSlice',
  initialState,
  reducers: {
    setEconomics(state: StateType, action: PayloadAction<StateType>) {
      return action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(logoutAction, () => {
      return initialState;
    });
  }
});

export const { setEconomics } = economicsSlice.actions;

export default economicsSlice.reducer;
