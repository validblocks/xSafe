import { createDeepEqualSelector } from './helpers';
import { RootState } from '../store';

export const modalsSliceSelector = (state: RootState) => state.modals;

export const txSubmittedModalSelector = createDeepEqualSelector(
  modalsSliceSelector,
  (state) => state.txSubmittedModal,
);

export const notificationModalSelector = createDeepEqualSelector(
  modalsSliceSelector,
  (state) => state.notificationModal,
);

export const proposeModalSelector = createDeepEqualSelector(
  modalsSliceSelector,
  (state) => state.proposeModal,
);

export const proposeMultiselectModalSelector = createDeepEqualSelector(
  modalsSliceSelector,
  (state) => state.proposeMultiselectModal,
);

export const proposeModalSelectedOptionSelector = createDeepEqualSelector(
  proposeModalSelector,
  (state) => {
    return state.selectedOption;
  },
);

export const proposeMultiselectModalSelectedOptionSelector =
  createDeepEqualSelector(
    proposeMultiselectModalSelector,
    (state) => state.selectedOption,
  );

export const performActionModalSelector = createDeepEqualSelector(
  modalsSliceSelector,
  (state) => state.performActionModal,
);

export const selectedPerformedActionSelector = createDeepEqualSelector(
  performActionModalSelector,
  (state) => state.selectedAction,
);

export const selectedTokenToSendSelector = createDeepEqualSelector(
  performActionModalSelector,
  (state) => state.selectedToken ?? { identifier: 'EGLD' },
);

export const selectedNftToSendSelector = createDeepEqualSelector(
  performActionModalSelector,
  (state) => state.selectedNft,
);

export const selectedStakingProviderSelector = createDeepEqualSelector(
  performActionModalSelector,
  (state) => state.selectedStakingProvider,
);
