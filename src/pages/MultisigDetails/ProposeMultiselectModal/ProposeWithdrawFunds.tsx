import { Address } from '@multiversx/sdk-core/out';
import { useEffect, useState } from 'react';
import MultistepForm from 'src/components/Utils/MultistepForm';
import { steps } from 'src/pages/Stake/withdrawFormSteps';
import { MultisigSendNft } from 'src/types/MultisigSendNft';

interface ProposeWithdrawFundsType {
    handleChange: (proposal: MultisigSendNft) => void;
    setSubmitDisabled: (value: boolean) => void;
    setIsAtFinish: React.Dispatch<React.SetStateAction<boolean>>;
    stepChanged?: (step: number) => void | null;
    announceTotalSteps?: (step: number) => void | null;
}

function _validateRecipient(value?: string) {
  try {
    // eslint-disable-next-line no-new
    new Address(value);
    return true;
  } catch (err) {
    return false;
  }
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

  useEffect(() => { announceTotalSteps(steps.length); }, [announceTotalSteps]);

  return (
    <MultistepForm
      finalActionText="Propose"
      emitStepChange={setStep}
      steps={steps}
      hasFinalActionButton={false}
    />
  );
};
export default ProposeWithdrawFunds;
