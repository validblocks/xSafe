import { RootState } from '../store';
import { createDeepEqualSelector } from './helpers';

export const appConfigSelector = (state: RootState) => state.appConfig;

export const multisigOriginSelector = createDeepEqualSelector(
  appConfigSelector,
  (state) => state.multisigOrigin,
);
