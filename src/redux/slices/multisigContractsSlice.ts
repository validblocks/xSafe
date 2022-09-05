import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MultisigContractInfoType } from 'src/types/multisigContracts';
import { logoutAction } from '../commonActions';

interface StateType {
  fetched: boolean;
  multisigContracts: MultisigContractInfoType[];
  currentMultisigContract: MultisigContractInfoType | null;
  isMultisigContractInvalid: boolean;
  currentMultisigTransactionId: string | null;
}

const initialState: StateType = {
  multisigContracts: [],
  fetched: false,
  isMultisigContractInvalid: false,
  currentMultisigContract: null,
  currentMultisigTransactionId: null,
};

export const multisigContractsSlice = createSlice({
  name: 'multisigContracts',
  initialState,
  reducers: {
    setMultisigContractsFetched: (
      state: StateType,
      action: PayloadAction<boolean>,
    ) => {
      state.fetched = action.payload;
    },
    setMultisigContracts: (
      state: StateType,
      action: PayloadAction<MultisigContractInfoType[]>,
    ) => {
      state.multisigContracts = action.payload;
      state.fetched = true;
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
      const currentContract = contracts.find(
        (contract) => contract.address === action.payload,
      );

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
  setMultisigContractsFetched,
  setCurrentMultisigContract,
  setIsMultisigContractInvalid,
  setCurrentMultisigTransactionId,
  updateMultisigContract,
  setMultisigContracts,
} = multisigContractsSlice.actions;

export default multisigContractsSlice.reducer;
