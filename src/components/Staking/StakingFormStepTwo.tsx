/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, useMediaQuery } from '@mui/material';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useCustomTranslation } from 'src/hooks/useCustomTranslation';
import { useDispatch, useSelector } from 'react-redux';
import { selectedStakingProviderSelector } from 'src/redux/selectors/modalsSelector';
import useProviderIdentitiesAfterSelection from 'src/hooks/useProviderIdentitiesAfterSelection';
import { Address, BigUIntValue, TokenTransfer } from '@multiversx/sdk-core/out';
import { mutateSmartContractCall } from 'src/contracts/MultisigContract';
import { currentMultisigTransactionIdSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { useTrackTransactionStatus } from '@multiversx/sdk-dapp/hooks';
import { setProposeMultiselectSelectedOption } from 'src/redux/slices/modalsSlice';
import ProviderPresentation from './ProviderPresentation';
import { useMultistepFormContext } from '../Utils/MultistepForm';
import {
  ChangeStepButton,
  FinalStepActionButton,
} from '../Theme/StyledComponents';
import { Text } from '../StyledComponents/StyledComponents';
import AmountInputWithTokenSelection from '../Utils/AmountInputWithTokenSelection';
import useAmountInputController from 'src/hooks/useAmountInputController';

const StakingFormStepTwo = () => {
  const [buttonWidth, setButtonWidth] = useState(0);
  const [isProcessingTransaction, setIsProcessingTransaction] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const t = useCustomTranslation();
  const {
    handleAmountInputChange,
    amount,
    amountErrorAfterTouch,
    updateAmountErrorAfterTouchIfExists,
  } = useAmountInputController('1');
  const { setIsFinalStepButtonActive, setBuiltFinalActionHandler } =
    useMultistepFormContext();
  const selectedProviderIdentifier = useSelector(
    selectedStakingProviderSelector,
  );

  const { proceedToPreviousStep } = useMultistepFormContext();
  const { fetchedProviderIdentities } = useProviderIdentitiesAfterSelection();

  const selectedProvider = useMemo(
    () =>
      fetchedProviderIdentities?.find(
        (provider) => provider.id === selectedProviderIdentifier,
      ),
    [fetchedProviderIdentities, selectedProviderIdentifier],
  );

  useEffect(() => {
    try {
      if (!selectedProvider?.provider) return;

      const addressParam = new Address(selectedProvider?.provider);

      const inputAmount = amount.toString().replaceAll(',', '');
      const amountNumeric = Number(inputAmount);
      if (Number.isNaN(amountNumeric)) {
        return;
      }

      const amountParam = new BigUIntValue(
        TokenTransfer.egldFromAmount(amountNumeric).valueOf(),
      );

      setBuiltFinalActionHandler(() => () => {
        mutateSmartContractCall(addressParam, amountParam, 'delegate');
      });
    } catch (err) {
      console.error(err);
    }
  }, [amount, selectedProvider?.provider, setBuiltFinalActionHandler]);

  useLayoutEffect(() => {
    if (buttonRef.current) setButtonWidth(buttonRef.current.offsetWidth);
  }, []);

  const dispatch = useDispatch();

  const closeModal = useCallback(() => {
    dispatch(setProposeMultiselectSelectedOption(null));
  }, [dispatch]);

  const proposeStake = useCallback(() => {
    setIsProcessingTransaction(true);

    if (!selectedProvider?.provider) return false;

    const addressParam = new Address(selectedProvider?.provider);

    const inputAmount = amount.replaceAll(',', '');
    const amountNumeric = Number(inputAmount);
    if (Number.isNaN(amountNumeric)) {
      return;
    }

    const amountParam = new BigUIntValue(
      TokenTransfer.egldFromAmount(amountNumeric).valueOf(),
    );

    mutateSmartContractCall(addressParam, amountParam, 'delegate');
    closeModal();
  }, [amount, closeModal, selectedProvider?.provider]);

  const transactionId = useSelector(currentMultisigTransactionIdSelector);
  useTrackTransactionStatus({
    transactionId,
    onSuccess: () => {
      setIsProcessingTransaction(false);
    },
    onCancelled: () => {
      setIsProcessingTransaction(false);
    },
    onTimedOut: () => {
      setIsProcessingTransaction(false);
    },
    onFail: () => {
      setIsProcessingTransaction(false);
    },
  });

  const maxWidth600 = useMediaQuery('(max-width:600px)');
  const maxWidth480 = useMediaQuery('(max-width:480px)');

  const buttonStyle = useMemo(
    () => ({
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: buttonWidth > 90 ? 0 : 3,
      background: 'rgba(76, 47, 252, 0.1)',
      padding: maxWidth480 ? '1rem' : '0 1rem 1rem',
      borderRadius: '10px',
    }),
    [buttonWidth, maxWidth480],
  );

  const disableFinalStep = useCallback(
    () => setIsFinalStepButtonActive(false),
    [setIsFinalStepButtonActive],
  );

  const enableFinalStep = useCallback(
    () => setIsFinalStepButtonActive(true),
    [setIsFinalStepButtonActive],
  );

  return (
    <Box
      sx={{
        padding: maxWidth600 ? '16px' : '2rem 3rem 0',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box sx={buttonStyle}>
        <Box sx={{ flex: 4 }}>
          <ProviderPresentation provider={selectedProvider} />
        </Box>
        <Box sx={{ width: '100%' }}>
          <ChangeStepButton
            disabled={isProcessingTransaction}
            ref={buttonRef}
            onClick={proceedToPreviousStep}
            sx={{ marginTop: maxWidth480 ? '1rem' : 0 }}
          >
            {t('Change') as string}
          </ChangeStepButton>
        </Box>
      </Box>
      <AmountInputWithTokenSelection
        minAmountAllowed={'1'}
        onInputChange={handleAmountInputChange}
        onAmountIsBiggerThanBalance={disableFinalStep}
        onAmountIsLessThanAllowed={disableFinalStep}
        onAmountIsZero={disableFinalStep}
        onAmountIsNaN={disableFinalStep}
        onAmountErrorAfterTouch={updateAmountErrorAfterTouchIfExists}
        onSuccessfulAmountValidation={enableFinalStep}
        config={{ withTokenSelection: false, withAvailableAmount: true }}
      />
      <Box display={'flex'} gap={2} paddingBottom={maxWidth600 ? '4px' : 4}>
        <ChangeStepButton
          disabled={isProcessingTransaction}
          onClick={proceedToPreviousStep}
        >
          <Text>{t('Back') as string}</Text>
        </ChangeStepButton>
        <FinalStepActionButton
          disabled={
            !!amountErrorAfterTouch ||
            !selectedProvider ||
            isProcessingTransaction
          }
          onClick={proposeStake}
        >
          <Text>Propose</Text>
        </FinalStepActionButton>
      </Box>
    </Box>
  );
};
export default StakingFormStepTwo;
