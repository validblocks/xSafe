import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface StateType {
  intervalStartTimestamp: number;
  intervalEndTimestamp: number;
  intervalStartTimestampForFiltering: number;
}

const oneMonthAgo = new Date();
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

const oneDayAgo = new Date();
oneDayAgo.setDate(oneDayAgo.getDate() - 1);

const initialState: StateType = {
  intervalStartTimestamp: Math.floor(oneDayAgo.getTime() / 1000),
  intervalEndTimestamp: Math.floor(new Date().getTime() / 1000),
  intervalStartTimestampForFiltering: Math.floor(oneDayAgo.getTime() / 1000),
};

export const transactionsSlice = createSlice({
  name: 'transactionsSlice',
  initialState,
  reducers: {
    setIntervalStartTimestamp(state: StateType, action: PayloadAction<number>) {
      return {
        ...state,
        intervalStartTimestamp: action.payload,
      };
    },
    setIntervalStartTimestampForFiltering(
      state: StateType,
      action: PayloadAction<number>,
    ) {
      return {
        ...state,
        intervalStartTimestampForFiltering: action.payload,
      };
    },
    setIntervalEndTimestamp(state: StateType, action: PayloadAction<number>) {
      return {
        ...state,
        intervalEndTimestamp: action.payload,
      };
    },
    enlargeInterval(state: StateType, action: PayloadAction<number>) {
      return {
        ...state,
        intervalEndTimestamp: state.intervalStartTimestamp,
        intervalStartTimestamp: action.payload,
        intervalStartTimestampForFiltering: action.payload,
      };
    },
    dwindleInterval(state: StateType, action: PayloadAction<number>) {
      return {
        ...state,
        intervalEndTimestamp: new Date().getTime() / 1000,
        intervalStartTimestamp: action.payload,
      };
    },
  },
});

export const {
  setIntervalStartTimestamp,
  setIntervalEndTimestamp,
  setIntervalStartTimestampForFiltering,
  enlargeInterval,
  dwindleInterval,
} = transactionsSlice.actions;
export default transactionsSlice.reducer;
