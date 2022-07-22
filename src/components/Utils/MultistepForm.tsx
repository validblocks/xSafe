import { Box } from '@mui/material';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FinalStepActionButton, ChangeStepButton } from '../Theme/StyledComponents';

interface IMultistepFormProps {
    steps: React.ReactElement[];
    finalActionHandler: () => void;
    emitStepChange?: React.Dispatch<React.SetStateAction<number>>;
    finalActionText?: string;
}

interface IMultistepFormContextType {
    activeStepNumber: number;
    proceedToPreviousStep: () => void;
}

const MultistepFormContext = createContext<IMultistepFormContextType>(
  {} as IMultistepFormContextType,
);

export const useMultistepFormContext = () =>
  useContext(MultistepFormContext);

const MultistepForm = ({
  steps,
  finalActionText = 'Proceed',
  finalActionHandler,
  emitStepChange = () => null }: IMultistepFormProps) => {
  const [activeStepNumber, setActiveStepNumber] = useState(1);
  const [isNextButtonActive, setIsNextButtonActive] = useState(false);

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

  return (
    <MultistepFormContext.Provider value={useMemo(() => ({
      proceedToPreviousStep,
      activeStepNumber,
    }),
    [proceedToPreviousStep])}
    >
      <Box>
        <Box>
          {activeStepJSX}
        </Box>
        <Box display={'flex'} gap={2} padding="2rem 3rem">
          {activeStepNumber > 1 && (
          <ChangeStepButton onClick={proceedToPreviousStep}>
            {t('Back') as string}
          </ChangeStepButton>
          )}
          {activeStepNumber < finalStep ? (
            <ChangeStepButton disabled={!isNextButtonActive} onClick={proceedToNextStep}>
              {t('Next') as string}
            </ChangeStepButton>
          ) : (
            <FinalStepActionButton onClick={() => finalActionHandler()}>
              {t(finalActionText) as string}
            </FinalStepActionButton>
          )}
        </Box>
      </Box>
    </MultistepFormContext.Provider>
  );
};

export default MultistepForm;
