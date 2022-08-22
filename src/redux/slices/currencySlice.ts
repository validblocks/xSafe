import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SupportedCurrencies } from 'src/utils/supportedCurrencies';

export type IConversionRates = Record<SupportedCurrencies, number>;

export interface StateType {
  currencyConverted: number;
  selectedCurrency: string;
  previousCurrency: string;
  valueInUsd: number;
  conversionRates: IConversionRates;
}

const initialState: StateType = {
  currencyConverted: 0,
  selectedCurrency: 'USD',
  previousCurrency: 'USD',
  valueInUsd: 0,
  conversionRates: {
    USD: 1,
    EUR: 1,
    RON: 1,
  },
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
      return {
        ...state,
        previousCurrency:
          action.payload !== state.selectedCurrency
            ? state.selectedCurrency
            : state.previousCurrency,
        selectedCurrency: action.payload,
      };
    },
    setValueInUsd(state: StateType, action: any) {
      return { ...state, valueInUsd: action.payload };
    },
    setConversionRates(
      state: StateType,
      action: PayloadAction<IConversionRates>,
    ) {
      return { ...state, conversionRates: action.payload };
    },
  },
});

export const {
  setTotalValueConverted,
  setSelectedCurrency,
  setValueInUsd,
  setConversionRates,
} = currencySlice.actions;

export default currencySlice.reducer;
