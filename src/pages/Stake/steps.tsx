import StakingFormStepOne from 'src/components/Staking/StakingFormStepOne';
import StakingFormStepTwo from 'src/components/Staking/StakingFormStepTwo';
import WithdrawFormStepOne from 'src/components/Staking/WithdrawFormStepOne';

export const stakingSteps = [
  <StakingFormStepOne key={0} />,
  <StakingFormStepTwo key={1} />,
];

export const withdrawSteps = [<WithdrawFormStepOne key={0} />];
