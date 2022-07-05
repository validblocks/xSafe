import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import routeNames from 'src/routes/routeNames';
import { logoutAction } from '../commonActions';

export interface MultisigOriginType {
  pathname: string;
  search: string;
}

export interface AppConfigStateType {
  multisigOrigin: MultisigOriginType;
}

function getInitialState(): AppConfigStateType {
  return {
    multisigOrigin: {
      pathname: routeNames?.welcome,
      search: '',
    },
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
  },
  extraReducers: (builder) => {
    builder.addCase(logoutAction, () => getInitialState());
  },
});

export const { setMultisigOrigin } = appConfigSlice.actions;

export default appConfigSlice.reducer;
