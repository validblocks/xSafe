import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MultisigContractInfoType } from 'src/types/multisigContracts';
import { logoutAction } from '../commonActions';

interface StateType {
  fetched: boolean;
  multisigContracts: MultisigContractInfoType[];
  currentMultisigContract: MultisigContractInfoType | null;
  isMultisigContractInvalid: boolean;
  currentMultisigTransactionId: string | null;
  hasUnknownOwner: boolean | null;
}

const initialState: StateType = {
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
      state: StateType,
      action: PayloadAction<MultisigContractInfoType[]>,
    ) => {
      state.multisigContracts = action.payload;
      state.fetched = true;
    },
    setHasUnknownOwner: (
      state: StateType,
      action: PayloadAction<boolean>,
    ) => {
      state.hasUnknownOwner = action.payload;
    },
    setIsMultisigContractInvalid: (
      state: StateType,
      action: PayloadAction<boolean>,
    ) => {
      state.isMultisigContractInvalid = action.payload;
    },
    setCurrentMultisigTransactionId: (
      state: StateType,
      action: PayloadAction<string | null>,
    ) => {
      state.currentMultisigTransactionId = action.payload;
    },
    setCurrentMultisigContract: (
      state: StateType,
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
      state: StateType,
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
