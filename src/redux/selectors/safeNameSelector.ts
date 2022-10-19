import { RootState } from '../store';
import { createDeepEqualSelector } from './helpers';

const safeNameSelector = (state: RootState) => state;
export const currentSafeNameSelector = createDeepEqualSelector(
  safeNameSelector,
  (state) => {
    const currentContract = state.multisigContracts.currentMultisigContract;
    const currentContractName =
      state.safeName.safeNames?.[currentContract?.address];

    const displayableName =
      currentContractName ??
      currentContract?.name ??
      currentContract?.address.slice(0, 5);

    return displayableName;
  },
);
