import { createSlice } from '@reduxjs/toolkit';

export interface StateType {
  currencyConverted: number;
  selectedCurrency: string;
}

const initialState: StateType = {
  currencyConverted: 0,
  selectedCurrency: ''
};

export const currencySlice = createSlice({
  name: 'currencySlice',
  initialState,
  reducers: {
    setTotalValueConverted(state: StateType, action: any) {
      return {
        ...state,
        currencyConverted: action.payload
      };
    },
    setSelectedCurrency(state: StateType, action: any) {
      return { ...state, selectedCurrency: action.payload };
    }
  }
});

export const { setTotalValueConverted, setSelectedCurrency } =
  currencySlice.actions;

export default currencySlice.reducer;
