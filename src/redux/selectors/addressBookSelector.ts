import { RootState } from '../store';
import { createDeepEqualSelector } from './helpers';

const selector = (state: RootState) => state.addressBook;
export const addressBookSelector = createDeepEqualSelector(
  selector,
  (state) => state.addressBook
);
