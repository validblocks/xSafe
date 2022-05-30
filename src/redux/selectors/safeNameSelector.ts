import { RootState } from '../store';
import { createDeepEqualSelector } from './helpers';

const safeNameSelector = (state: RootState) => state.safeName;
export const safeNameStoredSelector = createDeepEqualSelector(
  safeNameSelector,
  (state) => state.safeNameStored
);
