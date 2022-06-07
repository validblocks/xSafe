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
    addEntry(state: StateType, action: any) {
      return {
        ...state,
        addressBook: action.payload
      };
    }
  }
});

export const { addEntry } = addressBookSlice.actions;
export default addressBookSlice.reducer;
