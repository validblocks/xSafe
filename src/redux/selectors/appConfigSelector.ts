import { createDeepEqualSelector } from 'src/redux/selectors/helpers';
import { RootState } from '../store';

export const appConfigSelector = (state: RootState) => state.appConfig;

export const multisigOriginSelector = createDeepEqualSelector(
  appConfigSelector,
  (state) => state.multisigOrigin,
);
