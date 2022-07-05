import { Address } from '@elrondnetwork/erdjs/out';
import { createDeepEqualSelector } from './helpers';
import { RootState } from '../store';

const mainSelector = (state: RootState) => state.multisigContracts;

export const multisigContractsFetchedSelector = createDeepEqualSelector(
  mainSelector,
  (state) => state.fetched,
);

export const multisigContractsSelector = createDeepEqualSelector(
  mainSelector,
  (state) => state.multisigContracts,
);

export const currentMultisigContractSelector = createDeepEqualSelector(
  mainSelector,
  (state) => state?.currentMultisigContract,
);

export const currentMultisigTransactionIdSelector = createDeepEqualSelector(
  mainSelector,
  (state) => state?.currentMultisigTransactionId,
);

export const currentMultisigAddressSelector = createDeepEqualSelector(
  currentMultisigContractSelector,
  (currentMultisigContract) => {
    const address = currentMultisigContract?.address;
    if (address != null) {
      return new Address(address);
    }
    return address;
  },
);
