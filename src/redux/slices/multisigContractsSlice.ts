import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MultisigContractInfoType } from 'src/types/multisig/multisigContracts';
import { logoutAction } from '../commonActions';

interface MultisigContractsSlice {
  fetched: boolean;
  multisigContracts: MultisigContractInfoType[];
  currentMultisigContract: MultisigContractInfoType | null;
  isMultisigContractInvalid: boolean;
  currentMultisigTransactionId: string | null;
  hasUnknownOwner: boolean | null;
}

const initialState: MultisigContractsSlice = {
  multisigContracts: [],
  fetched: false,
  isMultisigContractInvalid: false,
  currentMultisigContract: null,
  currentMultisigTransactionId: null,
  hasUnknownOwner: null,
};

export const multisigContractsSlice = createSlice({
  name: 'multisigContracts',
  initialState,
  reducers: {
    setMultisigContracts: (
      state: MultisigContractsSlice,
      action: PayloadAction<MultisigContractInfoType[]>,
    ) => {
      state.multisigContracts = action.payload;
      state.fetched = true;
    },
    setHasUnknownOwner: (
      state: MultisigContractsSlice,
      action: PayloadAction<boolean>,
    ) => {
      state.hasUnknownOwner = action.payload;
    },
    setIsMultisigContractInvalid: (
      state: MultisigContractsSlice,
      action: PayloadAction<boolean>,
    ) => {
      state.isMultisigContractInvalid = action.payload;
    },
    setCurrentMultisigTransactionId: (
      state: MultisigContractsSlice,
      action: PayloadAction<string | null>,
    ) => {
      state.currentMultisigTransactionId = action.payload;
    },
    setCurrentMultisigContract: (
      state: MultisigContractsSlice,
      action: PayloadAction<string>,
    ) => {
      const contracts = state.multisigContracts;
      const currentContract = Array.isArray(contracts)
        ? contracts?.find((contract) => contract.address === action.payload)
        : null;

      if (currentContract != null) {
        return { ...state, currentMultisigContract: currentContract };
      }

      return {
        ...state,
        currentMultisigContract: {
          address: action.payload,
          name: '',
        },
      };
    },
    updateMultisigContract: (
      state: MultisigContractsSlice,
      action: PayloadAction<MultisigContractInfoType>,
    ) => {
      const { address } = action.payload;
      if (address !== null) {
        state.multisigContracts = state.multisigContracts.map((contract) => {
          if (contract.address === address) {
            return {
              ...contract,
              ...action.payload,
            };
          }
          if (state?.currentMultisigContract?.address === address) {
            state.currentMultisigContract = {
              ...state.currentMultisigContract,
              ...action.payload,
            };
          }
          return contract;
        });
      }
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutAction, () => initialState);
  },
});

export const {
  setCurrentMultisigContract,
  setIsMultisigContractInvalid,
  setCurrentMultisigTransactionId,
  updateMultisigContract,
  setMultisigContracts,
  setHasUnknownOwner,
} = multisigContractsSlice.actions;

export default multisigContractsSlice.reducer;
