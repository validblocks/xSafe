import { createDeepEqualSelector } from './helpers';
import { RootState } from '../store';

const selector = (state: RootState) => state;
export const addressBookSelector = createDeepEqualSelector(
  selector,
  (state) => {
    const { addressBook } = state;
    const currentContractAddress =
      state.multisigContracts.currentMultisigContract?.address;
    return currentContractAddress && currentContractAddress in addressBook
      ? state.addressBook[currentContractAddress]
      : {};
  },
);
