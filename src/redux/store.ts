import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import localStorage from 'redux-persist/lib/storage';
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
    'transactions'
  ]
};

const persistedReducer = persistReducer(persistConfig, makeRootReducer());

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
