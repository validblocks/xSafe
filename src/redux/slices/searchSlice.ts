import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StateType {
  navbarSearchParam: string;
}

const initialState: StateType = {
  navbarSearchParam: '',
};

export const searchSlice = createSlice({
  name: 'searchSlice',
  initialState,
  reducers: {
    setNavbarSearchParam(state: StateType, action: PayloadAction<string>) {
      return {
        ...state,
        navbarSearchParam: action.payload,
      };
    },
  },
});

export const { setNavbarSearchParam } = searchSlice.actions;
export default searchSlice.reducer;
