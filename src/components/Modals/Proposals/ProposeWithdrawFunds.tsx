import { useEffect, useState } from 'react';
import MultistepForm from 'src/components/Utils/MultistepForm';
import { withdrawSteps } from 'src/pages/Stake/steps';
import { MultisigSendNft } from 'src/types/multisig/proposals/MultisigSendNft';

interface ProposeWithdrawFundsType {
  handleChange: (proposal: MultisigSendNft) => void;
  setSubmitDisabled: (value: boolean) => void;
  setIsAtFinish: React.Dispatch<React.SetStateAction<boolean>>;
  stepChanged?: (step: number) => void | null;
  announceTotalSteps?: (step: number) => void | null;
}

const ProposeWithdrawFunds = ({
  handleChange: _1,
  setSubmitDisabled: _2,
  setIsAtFinish: _3,
  stepChanged = () => null,
  announceTotalSteps = () => null,
}: ProposeWithdrawFundsType) => {
  const [step, setStep] = useState(1);

  useEffect(() => {
    stepChanged(step);
  }, [step, stepChanged]);

  useEffect(() => {
    announceTotalSteps(withdrawSteps.length);
  }, [announceTotalSteps]);

  return (
    <MultistepForm
      finalActionText="Propose"
      emitStepChange={setStep}
      steps={withdrawSteps}
      hasFinalActionButton={false}
    />
  );
};
export default ProposeWithdrawFunds;
