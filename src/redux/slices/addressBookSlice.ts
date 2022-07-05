import { createSlice } from '@reduxjs/toolkit';

export interface StateType {
  addressBook: Record<string, any>;
}

const initialState: StateType = {
  addressBook: {}
};

export const addressBookSlice = createSlice({
  name: 'addressBookSlice',
  initialState,
  reducers: {
    addEntry(state: StateType, { payload: { address, name } }: any) {
      return {
        ...state,
        addressBook: { ...state.addressBook, [address]: name }
      };
    }
  }
});

export const { addEntry } = addressBookSlice.actions;
export default addressBookSlice.reducer;
