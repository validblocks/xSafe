import { createSlice } from '@reduxjs/toolkit';

export type StateType = Record<
  'addressBook',
  Record<string, Record<string, any>>
>;

const initialState: StateType = {
  addressBook: {},
};

export const addressBookSlice = createSlice({
  name: 'addressBookSlice',
  initialState,
  reducers: {
    addEntry(
      state: StateType,
      { payload: { contractAddress, address, name } }: any,
    ) {
      return {
        addressBook: {
          ...state.addressBook,
          [contractAddress]: {
            ...state.addressBook[contractAddress],
            [address]: name,
          },
        },
      };
    },
    removeEntry(
      state: StateType,
      { payload: { address, contractAddress } }: any,
    ) {
      delete state.addressBook[contractAddress][address];
      return state;
    },
  },
});

export const { addEntry, removeEntry } = addressBookSlice.actions;
export default addressBookSlice.reducer;
