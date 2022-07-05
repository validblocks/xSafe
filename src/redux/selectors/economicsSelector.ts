import { createDeepEqualSelector } from './helpers';
import { RootState } from '../store';

const economicsSelector = (state: RootState) => state.economics;

export const priceSelector = createDeepEqualSelector(
  economicsSelector,
  (state) => state.price,
);
