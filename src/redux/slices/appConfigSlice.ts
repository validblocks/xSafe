import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import routeNames from 'src/routes/routeNames';
import { logoutAction } from '../commonActions';

export interface MultisigOriginType {
  pathname: string;
  search: string;
}

export interface AppConfigStateType {
  multisigOrigin: MultisigOriginType;
  selectedTheme: 'Light' | 'Dark';
}

function getInitialState(): AppConfigStateType {
  return {
    multisigOrigin: {
      pathname: routeNames?.welcome,
      search: '',
    },
    selectedTheme: 'Light',
  };
}

export const appConfigSlice = createSlice({
  name: 'appConfig',
  initialState: getInitialState(),
  reducers: {
    setMultisigOrigin: (
      state: AppConfigStateType,
      action: PayloadAction<MultisigOriginType>,
    ) => {
      state.multisigOrigin = action.payload;
    },
    setSelectedTheme: (
      state: AppConfigStateType,
      action: PayloadAction<'Light' | 'Dark'>,
    ) => {
      console.log('setting theme', action.payload);
      state.selectedTheme = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutAction, () => getInitialState());
  },
});

export const { setMultisigOrigin, setSelectedTheme } = appConfigSlice.actions;

export default appConfigSlice.reducer;
