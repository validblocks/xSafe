import { RootState } from '../store';
import { createDeepEqualSelector } from './helpers';

const economicsSelector = (state: RootState) => state.economics;

export const priceSelector = createDeepEqualSelector(
  economicsSelector,
  (state) => state.price,
);
