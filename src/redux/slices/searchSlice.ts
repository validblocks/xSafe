import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SearchSlice {
  navbarSearchParam: string;
}

const initialState: SearchSlice = {
  navbarSearchParam: '',
};

export const searchSlice = createSlice({
  name: 'searchSlice',
  initialState,
  reducers: {
    setNavbarSearchParam(state: SearchSlice, action: PayloadAction<string>) {
      return {
        ...state,
        navbarSearchParam: action.payload,
      };
    },
  },
});

export const { setNavbarSearchParam } = searchSlice.actions;
export default searchSlice.reducer;
