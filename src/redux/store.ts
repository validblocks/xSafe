import { configureStore } from '@reduxjs/toolkit';
import persistReducer from 'redux-persist/es/persistReducer';
import persistStore from 'redux-persist/es/persistStore';
import localStorage from 'redux-persist/es/storage';
import makeRootReducer from './makeRootReducer';

const persistConfig = {
  key: 'multisig-root',
  storage: localStorage,
  whitelist: [
    'account',
    'appConfig',
    'multisigContracts',
    'economics',
    'currency',
    'safeName',
    'addressBook',
    'transactions'
  ]
};

const persistedReducer = persistReducer(persistConfig, makeRootReducer());

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
