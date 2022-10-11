import { RootState } from '../store';
import { createDeepEqualSelector } from './helpers';

const searchSelector = (state: RootState) => state.search;

export const navbarSearchSelector = createDeepEqualSelector(
  searchSelector,
  (state) => state.navbarSearchParam,
);
