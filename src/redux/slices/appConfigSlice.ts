import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import routeNames from 'src/routes/routeNames';
import { logoutAction } from '../commonActions';

export interface MultisigOriginType {
  pathname: string;
  search: string;
}

export interface AppConfigSlice {
  multisigOrigin: MultisigOriginType;
  selectedTheme: 'Light' | 'Dark';
  isMobileSidebarOpen: boolean;
}

function getInitialState(): AppConfigSlice {
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
      state: AppConfigSlice,
      action: PayloadAction<MultisigOriginType>,
    ) => {
      state.multisigOrigin = action.payload;
    },
    setSelectedTheme: (
      state: AppConfigSlice,
      action: PayloadAction<'Light' | 'Dark'>,
    ) => {
      state.selectedTheme = action.payload;
    },
    setIsMobileSidebarOpen: (
      state: AppConfigSlice,
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
