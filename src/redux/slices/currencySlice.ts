import { createSlice } from '@reduxjs/toolkit';

export interface StateType {
  currencyConverted: number;
}

const initialState: StateType = {
  currencyConverted: 0
};
console.log(initialState, 'initialState');

export const currencySlice = createSlice({
  name: 'currencySlice',
  initialState,
  reducers: {
    setCurrencyConverted(state: StateType, action: any) {
      return {
        ...state,
        currencyConverted: action.payload
      };
    }
  }
});

export const { setCurrencyConverted } = currencySlice.actions;

export default currencySlice.reducer;
