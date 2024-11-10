import { createSlice } from '@reduxjs/toolkit';

export interface SafeNameSlice {
  safeNames: Record<string, string>;
}

const initialState: SafeNameSlice = {
  safeNames: {},
};

export const safeNameSlice = createSlice({
  name: 'safeNameSlice',
  initialState,
  reducers: {
    setSafeName(state: SafeNameSlice, { payload: { address, newSafeName } }) {
      return {
        ...state,
        safeNames: {
          ...state.safeNames,
          [address]: newSafeName,
        },
      };
    },
  },
});

export const { setSafeName } = safeNameSlice.actions;
export default safeNameSlice.reducer;
