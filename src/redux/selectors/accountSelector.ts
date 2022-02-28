import { RootState } from '../store';
import { createDeepEqualSelector } from './helpers';

const accountSelector = (state: RootState) => state.account;

export const usernameSelector = createDeepEqualSelector(
  accountSelector,
  (state) => state.username
);
