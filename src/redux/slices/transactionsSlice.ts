import { PayloadAction, createSlice } from '@reduxjs/toolkit';
export interface StateType {
  afterTimestamp: number;
  beforeTimestamp: number;
}

const oneMonthAgo = new Date();
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

const initialState: StateType = {
  afterTimestamp: Math.floor(oneMonthAgo.getTime() / 1000),
  beforeTimestamp: Math.floor(new Date().getTime() / 1000)
};

export const transactionsSlice = createSlice({
  name: 'transactionsSlice',
  initialState,
  reducers: {
    setAfterTimestamp(state: StateType, action: PayloadAction<number>) {
      return {
        ...state,
        afterTimestamp: action.payload
      };
    },
    setBeforeTimestamp(state: StateType, action: PayloadAction<number>) {
      return {
        ...state,
        beforeTimestamp: action.payload
      };
    }
  }
});

export const { setAfterTimestamp, setBeforeTimestamp } =
  transactionsSlice.actions;
export default transactionsSlice.reducer;
