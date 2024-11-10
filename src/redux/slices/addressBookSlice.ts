import { createSlice } from '@reduxjs/toolkit';
import { AddressBook } from 'src/types/organization';

type MultisigAddress = string;

export type SharedAddressBookSlice = Record<MultisigAddress, AddressBook>;

const initialState: SharedAddressBookSlice = {};

export const sharedAddressBookSlice = createSlice({
  name: 'sharedAddressBookSlice',
  initialState,
  reducers: {
    addEntry(
      state: SharedAddressBookSlice,
      { payload: { contractAddress, address, name } },
    ) {
      return {
        ...state,
        [contractAddress]: {
          ...(state && state[contractAddress]),
          [address]: name,
        },
      };
    },
    removeEntry(
      state: SharedAddressBookSlice,
      { payload: { address, contractAddress } },
    ) {
      delete state[contractAddress][address];
      return state;
    },
  },
});

export const { addEntry, removeEntry } = sharedAddressBookSlice.actions;
export default sharedAddressBookSlice.reducer;
