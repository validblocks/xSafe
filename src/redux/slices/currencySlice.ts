import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StateType {
  currencyConverted: number;
  selectedCurrency: string;
  previousCurrency: string;
  valueInUsd: number;
}

const initialState: StateType = {
  currencyConverted: 0,
  selectedCurrency: 'USD',
  previousCurrency: 'USD',
  valueInUsd: 0,
};

export const currencySlice = createSlice({
  name: 'currencySlice',
  initialState,
  reducers: {
    setTotalValueConverted(state: StateType, action: PayloadAction<number>) {
      return {
        ...state,
        currencyConverted: action.payload,
      };
    },
    setSelectedCurrency(state: StateType, action: PayloadAction<string>) {
      return {
        ...state,
        previousCurrency:
          action.payload !== state.selectedCurrency
            ? state.selectedCurrency
            : state.previousCurrency,
        selectedCurrency: action.payload,
      };
    },
    setValueInUsd(state: StateType, action: PayloadAction<number>) {
      return { ...state, valueInUsd: action.payload };
    },
  },
});

export const { setTotalValueConverted, setSelectedCurrency, setValueInUsd } =
  currencySlice.actions;

export default currencySlice.reducer;
