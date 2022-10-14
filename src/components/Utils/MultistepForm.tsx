import { Box } from '@mui/material';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '../StyledComponents/StyledComponents';
import { FinalStepActionButton, ChangeStepButton } from '../Theme/StyledComponents';

interface IMultistepFormProps {
    steps: React.ReactElement[];
    emitStepChange?: React.Dispatch<React.SetStateAction<number>>;
  finalActionText?: string;
  hasFinalActionButton?: boolean;
}

interface IMultistepFormContextType {
    setBuiltFinalActionHandler: any;
    activeStepNumber: number;
    proceedToPreviousStep: () => void;
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
  emitStepChange = () => null }: IMultistepFormProps) => {
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

  const [builtFinalActionHandler, setBuiltFinalActionHandler] = useState(() => () => ({}));

  return (
    <MultistepFormContext.Provider value={useMemo(() => ({
      proceedToPreviousStep,
      activeStepNumber,
      setIsFinalStepButtonActive,
      setBuiltFinalActionHandler,
    }),
    [activeStepNumber, proceedToPreviousStep])}
    >
      <Box>
        <Box>
          <Text>{activeStepJSX}</Text>
        </Box>
        <Box
          display={'flex'}
          gap={2}
          padding={activeStepNumber > 1 || activeStepNumber < finalStep ? '2rem 3rem' : '0'}
        >
          {activeStepNumber > 1 && (
          <ChangeStepButton onClick={proceedToPreviousStep}>
            <Text>{t('Back') as string}</Text>
          </ChangeStepButton>
          )}
          {activeStepNumber < finalStep ? (
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
          ) : hasFinalActionButton && (
            <FinalStepActionButton
              disabled={!isFinalStepButtonActive}
              onClick={builtFinalActionHandler}
            >
              <Text>{t(finalActionText) as string}</Text>
            </FinalStepActionButton>
          )}
        </Box>
      </Box>
    </MultistepFormContext.Provider>
  );
};

export default MultistepForm;
