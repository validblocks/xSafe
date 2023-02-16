import { createDeepEqualSelector } from './helpers';
import { RootState } from '../store';

const selector = (state: RootState) => state;
export const addressBookSelector = createDeepEqualSelector(
  selector,
  (state) => {
    const { addressBook } = state.addressBook;
    const currentContractAddress = state.multisigContracts?.currentMultisigContract?.address;
    return currentContractAddress in addressBook ? addressBook[currentContractAddress] : {
      [currentContractAddress]: {},
    };
  },
);
