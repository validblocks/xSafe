import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MultisigActionType } from 'src/types/multisig/MultisigActionType';
import {
  ModalOptionType,
  SelectedOptionType,
} from 'src/types/multisig/proposals/Proposals';
import { NFTType } from 'src/types/nfts';
import { logoutAction } from '../commonActions';
import { Template } from 'src/types/templates';
import { CreateTemplateDto } from 'src/services/xSafeApiProvider';

interface TxSubmittedModal {
  sessionId: string;
  submittedMessage: string;
}

interface NotificationModal {
  icon: typeof faInfoCircle;
  iconClassName: string;
  title: string;
  description: string;
}

export interface SelectedActionToPerform {
  id: number;
  actionType?: MultisigActionType;
}

export interface SelectedTokenToSend {
  token?: any;
}
interface PerformActionModal {
  selectedAction: SelectedActionToPerform | null;
  selectedToken: any | null;
  selectedNft: any | null;
  selectedStakingProvider: any | null;
  selectedTemplateForSaving: Template | null;
  selectedTemplateForCreation: Partial<CreateTemplateDto> | null;
}

interface ProposeModal {
  selectedOption?: SelectedOptionType | ModalOptionType;
}

interface ProposeMultiselectModal {
  selectedOption?: SelectedOptionType;
}

export interface ModalsSliceState {
  txSubmittedModal?: TxSubmittedModal;
  notificationModal?: NotificationModal;
  proposeModal: ProposeModal;
  proposeMultiselectModal: ProposeMultiselectModal;
  performActionModal: PerformActionModal;
}

const initialState: ModalsSliceState = {
  proposeModal: {
    selectedOption: null,
  },
  proposeMultiselectModal: {
    selectedOption: null,
  },
  performActionModal: {
    selectedAction: null,
    selectedToken: null,
    selectedNft: null,
    selectedStakingProvider: null,
    selectedTemplateForSaving: null,
    selectedTemplateForCreation: null,
  },
};

export const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    setTxSubmittedModal: (
      state: ModalsSliceState,
      action: PayloadAction<TxSubmittedModal>,
    ) => {
      state.txSubmittedModal = action.payload;
    },
    setNotificationModal: (
      state: ModalsSliceState,
      action: PayloadAction<NotificationModal>,
    ) => {
      state.notificationModal = action.payload;
    },
    clearTxSubmittedModal: (state: ModalsSliceState) => {
      state.txSubmittedModal = undefined;
    },
    clearNotificationModal: (state: ModalsSliceState) => {
      state.notificationModal = undefined;
    },
    setProposeModalSelectedOption: (
      state: ModalsSliceState,
      action: PayloadAction<SelectedOptionType | ModalOptionType | null>,
    ) => {
      state.proposeModal.selectedOption = action.payload;
    },
    setProposeMultiselectSelectedOption: (
      state: ModalsSliceState,
      action: PayloadAction<SelectedOptionType | null>,
    ) => {
      state.proposeMultiselectModal.selectedOption = action.payload;
    },
    setSelectedPerformedAction: (
      state: ModalsSliceState,
      action: PayloadAction<SelectedActionToPerform | null>,
    ) => {
      state.performActionModal.selectedAction = action.payload;
    },
    setSelectedTokenToSend: (
      state: ModalsSliceState,
      action: PayloadAction<any>,
    ) => {
      state.performActionModal.selectedToken = action.payload;
    },
    setSelectedTemplateForSaving: (
      state: ModalsSliceState,
      action: PayloadAction<Template>,
    ) => {
      state.performActionModal.selectedTemplateForSaving = action.payload;
    },
    setSelectedTemplateForCreation: (
      state: ModalsSliceState,
      action: PayloadAction<Partial<CreateTemplateDto>>,
    ) => {
      state.performActionModal.selectedTemplateForCreation = action.payload;
    },
    setSelectedNftToSend: (
      state: ModalsSliceState,
      action: PayloadAction<NFTType>,
    ) => {
      state.performActionModal.selectedNft = action.payload;
    },
    setSelectedStakingProvider: (
      state: ModalsSliceState,
      action: PayloadAction<any>,
    ) => {
      state.performActionModal.selectedStakingProvider = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(logoutAction, () => initialState);
  },
});

export const {
  setTxSubmittedModal,
  setNotificationModal,
  setProposeMultiselectSelectedOption,
  clearTxSubmittedModal,
  clearNotificationModal,
  setProposeModalSelectedOption,
  setSelectedPerformedAction,
  setSelectedTokenToSend,
  setSelectedNftToSend,
  setSelectedStakingProvider,
  setSelectedTemplateForSaving,
  setSelectedTemplateForCreation,
} = modalsSlice.actions;

export default modalsSlice.reducer;
