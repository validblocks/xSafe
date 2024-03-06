import { useEffect, useState } from 'react';
import MultistepForm from 'src/components/Utils/MultistepForm';
import { stakingSteps } from 'src/pages/Stake/steps';
import { MultisigSendNft } from 'src/types/multisig/proposals/MultisigSendNft';

interface StakeTokensModalContentType {
  handleChange: (proposal: MultisigSendNft) => void;
  setSubmitDisabled: (value: boolean) => void;
  setIsAtFinish: React.Dispatch<React.SetStateAction<boolean>>;
  stepChanged?: (step: number) => void | null;
  announceTotalSteps?: (step: number) => void | null;
}

const StakeTokensModalContent = ({
  handleChange: _1,
  setSubmitDisabled: _2,
  setIsAtFinish: _3,
  stepChanged = () => null,
  announceTotalSteps = () => null,
}: StakeTokensModalContentType) => {
  const [step, setStep] = useState(1);

  useEffect(() => {
    stepChanged(step);
  }, [step, stepChanged]);

  useEffect(() => {
    announceTotalSteps(stakingSteps.length);
  }, [announceTotalSteps]);

  return (
    <MultistepForm
      finalActionText="Propose"
      emitStepChange={setStep}
      steps={stakingSteps}
      hasFinalActionButton={false}
      noBackwardsSteps={[2]}
    />
  );
};
export default StakeTokensModalContent;
