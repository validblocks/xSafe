import { createSlice } from '@reduxjs/toolkit';

export interface StateType {
  safeNames: Record<string, string>;
}

const initialState: StateType = {
  safeNames: {},
};

export const safeNameSlice = createSlice({
  name: 'safeNameSlice',
  initialState,
  reducers: {
    setSafeName(state: StateType, { payload: { address, newSafeName } }: any) {
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
