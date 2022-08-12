import { LOCAL_STORAGE_KEYS } from 'src/pages/Marketplace/localStorageKeys';
import createObserver from './createObserver';

export const LocalStorageObserver = createObserver<
  LOCAL_STORAGE_KEYS,
  string
>();

export const { subscribe, publish } = LocalStorageObserver;
