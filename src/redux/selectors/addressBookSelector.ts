import { createDeepEqualSelector } from './helpers';
import { RootState } from '../store';

const selector = (state: RootState) => state.addressBook;
export const addressBookSelector = createDeepEqualSelector(
  selector,
  (state) => state.addressBook,
);
