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
    },
    removeEntry(state: StateType, { payload: { address } }: any) {
      console.log(address);
      delete state.addressBook[address];
      return state;
    }
  }
});

export const { addEntry, removeEntry } = addressBookSlice.actions;
export default addressBookSlice.reducer;
