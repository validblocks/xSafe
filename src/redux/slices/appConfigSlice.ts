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
  isMobileSidebarOpen: boolean;
}

function getInitialState(): AppConfigStateType {
  return {
    multisigOrigin: {
      pathname: routeNames?.welcome,
      search: '',
    },
    selectedTheme: 'Dark',
    isMobileSidebarOpen: false,
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
      state.selectedTheme = action.payload;
    },
    setIsMobileSidebarOpen: (
      state: AppConfigStateType,
      action: PayloadAction<boolean>,
    ) => {
      state.isMobileSidebarOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutAction, () => getInitialState());
  },
});

export const { setMultisigOrigin, setSelectedTheme, setIsMobileSidebarOpen } =
  appConfigSlice.actions;

export default appConfigSlice.reducer;
