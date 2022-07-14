import { createSlice } from '@reduxjs/toolkit';

export interface StateType {
  currencyConverted: number;
  selectedCurrency: string;
  valueInUsd: number;
}

const initialState: StateType = {
  currencyConverted: 0,
  selectedCurrency: 'USD',
  valueInUsd: 0,
};

export const currencySlice = createSlice({
  name: 'currencySlice',
  initialState,
  reducers: {
    setTotalValueConverted(state: StateType, action: any) {
      return {
        ...state,
        currencyConverted: action.payload,
      };
    },
    setSelectedCurrency(state: StateType, action: any) {
      return { ...state, selectedCurrency: action.payload };
    },
    setValueInUsd(state: StateType, action: any) {
      return { ...state, valueInUsd: action.payload };
    },
  },
});

export const { setTotalValueConverted, setSelectedCurrency, setValueInUsd } = currencySlice.actions;

export default currencySlice.reducer;
