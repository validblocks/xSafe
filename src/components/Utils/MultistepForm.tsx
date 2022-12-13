import { useTrackTransactionStatus } from '@elrondnetwork/dapp-core/hooks';
import { Box } from '@mui/material';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { currentMultisigTransactionIdSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { useTheme } from 'styled-components';
import { Text } from '../StyledComponents/StyledComponents';
import { FinalStepActionButton, ChangeStepButton } from '../Theme/StyledComponents';
import * as Styled from './styled';

interface IMultistepFormProps {
  steps: React.ReactElement[];
  emitStepChange?: React.Dispatch<React.SetStateAction<number>>;
  finalActionText?: string;
  hasFinalActionButton?: boolean;
  autoForwardSteps?: number[];
  noBackwardsSteps?: number[];
}

interface IMultistepFormContextType {
  setBuiltFinalActionHandler: any;
  activeStepNumber: number;
  proceedToPreviousStep: () => void;
  proceedToNextStep: () => void;
  setIsFinalStepButtonActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const MultistepFormContext = createContext<IMultistepFormContextType>(
  {} as IMultistepFormContextType,
);

export const useMultistepFormContext = () =>
  useContext(MultistepFormContext);

const MultistepForm = ({
  steps,
  finalActionText = 'Proceed',
  hasFinalActionButton = true,
  autoForwardSteps = [],
  noBackwardsSteps = [],
  emitStepChange = () => null }: IMultistepFormProps) => {
  const theme: any = useTheme();
  const [activeStepNumber, setActiveStepNumber] = useState(1);
  const [isNextButtonActive, setIsNextButtonActive] = useState(false);
  const [isFinalStepButtonActive, setIsFinalStepButtonActive] = useState(false);

  const finalStep = steps.length;
  const { t } = useTranslation();

  const activeStepJSX = useMemo(() => React.cloneElement(steps[activeStepNumber - 1], {
    stepNumber: activeStepNumber,
    enableNextStep: setIsNextButtonActive,
  }), [activeStepNumber, steps]);

  const proceedToNextStep = useCallback(() => {
    if (activeStepNumber < finalStep) {
      setActiveStepNumber((activeStepNumber) => activeStepNumber + 1);
      emitStepChange((activeStepNumber) => activeStepNumber + 1);
    }
  }, [activeStepNumber, emitStepChange, finalStep]);

  const proceedToPreviousStep = useCallback(() => {
    setActiveStepNumber((activeStepNumber) => activeStepNumber - 1);
    emitStepChange((activeStepNumber) => activeStepNumber - 1);
  }, [emitStepChange]);

  const [builtFinalActionHandler, setBuiltFinalActionHandler] = useState(() => () => null);

  const isFinalActionButtonVisible = hasFinalActionButton && activeStepNumber === finalStep;
  const isBackButtonVisible = activeStepNumber > 1 && !noBackwardsSteps.includes(activeStepNumber);
  const isNextButtonVisible = activeStepNumber < finalStep && !autoForwardSteps.includes(activeStepNumber);

  const [lastTransactionId, setLastTransactionId] = useState<string | null>(null);

  const currentTransactionId = useSelector(currentMultisigTransactionIdSelector);
  useTrackTransactionStatus({
    transactionId: currentTransactionId,
    onSuccess: () => {
      setLastTransactionId(currentTransactionId);
    },
    onCompleted: () => {
      setLastTransactionId(currentTransactionId);
    },
  });

  return (
    <MultistepFormContext.Provider value={useMemo(() => ({
      proceedToPreviousStep,
      proceedToNextStep,
      activeStepNumber,
      lastTransactionId,
      setIsFinalStepButtonActive,
      setBuiltFinalActionHandler,
    }),
    [activeStepNumber, proceedToNextStep, proceedToPreviousStep])}
    >
      <Styled.MultistepForm sx={{ backgroundColor: theme.palette.background.secondary }} className="modal-content">
        <Box>
          <Text>{activeStepJSX}</Text>
        </Box>
        {(isNextButtonVisible || isBackButtonVisible || isFinalActionButtonVisible) && (
        <Box
          display={'flex'}
          gap={2}
          padding={activeStepNumber > 1 || activeStepNumber < finalStep ? '2rem 3rem' : '0'}
        >
          {isBackButtonVisible && (
          <ChangeStepButton onClick={proceedToPreviousStep}>
            <Text>{t('Back') as string}</Text>
          </ChangeStepButton>
          )}
          {isNextButtonVisible ? (
            <ChangeStepButton
              sx={{ ...(!isNextButtonActive && {
                background: '#eee !important',
                border: '1px solid #ddd !important',
              }) }}
              disabled={!isNextButtonActive}
              onClick={proceedToNextStep}
            >
              <Text>{t('Next') as string}</Text>
            </ChangeStepButton>
          ) : isFinalActionButtonVisible && (
          <FinalStepActionButton
            disabled={!isFinalStepButtonActive}
            onClick={builtFinalActionHandler}
          >
            <Text>{t(finalActionText) as string}</Text>
          </FinalStepActionButton>
          )}
        </Box>
        )}
      </Styled.MultistepForm>
    </MultistepFormContext.Provider>
  );
};

export default MultistepForm;
