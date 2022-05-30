import { createSlice } from '@reduxjs/toolkit';

export interface StateType {
  safeNameStored: string;
}

const initialState: StateType = {
  safeNameStored: ''
};

export const safeNameSlice = createSlice({
  name: 'safeNameSlice',
  initialState,
  reducers: {
    setSafeName(state: StateType, action: any) {
      return {
        ...state,
        safeNameStored: action.payload
      };
    }
  }
});

export const { setSafeName } = safeNameSlice.actions;
export default safeNameSlice.reducer;
